import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ConsumeMessage } from 'amqplib';
import { RabbitMqService, EVENTS_EXCHANGE } from '@shared/infrastructure/rabbitmq/rabbitmq.service';
import { PresenceService } from '@modules/presence/application/presence.service';
import { ConversationRepository } from '@modules/messaging/domain/repositories/conversation.repository';
import { WsJwtAuthGuard } from '@common/guards/ws-jwt-auth.guard';

const conversationRoom = (conversationId: string) => `conversation:${conversationId}`;
const userRoutingKey = (userId: string) => `user.${userId}`;

interface SocketData {
  userId?: string;
  consumerTag?: string;
  queueName?: string;
  joinedConversationIds?: Set<string>;
}

/**
 * Ponto único de integração em tempo real entre os bounded contexts.
 * Não contém regra de negócio - só traduz mensagens do barramento (RabbitMQ)
 * e estado de conexão (Presence) em eventos de WebSocket para o cliente.
 *
 * Cada conexão declara sua própria fila efêmera (autoDelete) ligada à exchange
 * `gloopy.events` com routing key `user.{userId}` - é isso que permite múltiplos
 * dispositivos do mesmo usuário receberem cópia de cada evento, e permite escalar
 * a API para várias instâncias sem perder entrega (cada instância só recebe os
 * eventos dos usuários conectados a ELA).
 */
@WebSocketGateway({ cors: { origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN ?? false : true } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly presenceService: PresenceService,
    private readonly conversationRepository: ConversationRepository,
    private readonly rabbitMq: RabbitMqService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const userId = await this.authenticate(client);
    if (!userId) {
      client.disconnect(true);
      return;
    }

    const data = client.data as SocketData;
    data.userId = userId;
    data.joinedConversationIds = new Set();

    const { wasOffline } = await this.presenceService.connect(userId, client.id);
    if (wasOffline) {
      await this.broadcastPresence(userId, 'ONLINE');
    }

    await this.subscribeToUserEvents(client, userId);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const data = client.data as SocketData;
    if (!data.userId) return;

    await this.unsubscribeFromUserEvents(client);

    const { isNowOffline } = await this.presenceService.disconnect(data.userId, client.id);
    if (isNowOffline) {
      await this.broadcastPresence(data.userId, 'OFFLINE');
    }
  }

  // ---------- Mensagens recebidas do cliente ----------

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('conversation:join')
  async onJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ): Promise<void> {
    const userId = (client.data as SocketData).userId!;
    const conversation = await this.conversationRepository.findById(payload.conversationId);

    if (!conversation || !conversation.isActiveMember(userId)) {
      return; // silenciosamente ignora - não vaza se a conversa existe ou não
    }
    await client.join(conversationRoom(payload.conversationId));
    (client.data as SocketData).joinedConversationIds?.add(payload.conversationId);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('conversation:leave')
  async onLeaveConversationRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ): Promise<void> {
    await client.leave(conversationRoom(payload.conversationId));
    (client.data as SocketData).joinedConversationIds?.delete(payload.conversationId);
  }

  /**
   * Indicador de "digitando" - fica só em memória local (sala do socket.io),
   * não passa pelo RabbitMQ: é um evento efêmero de baixíssima latência,
   * o custo de uma fila aqui não se paga. Limitação conhecida: só chega a quem
   * está conectado nesta mesma instância da API (ok pra Fase 1, revisitar se
   * escalarmos horizontalmente antes de resolver isso).
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('typing:start')
  onTypingStart(@ConnectedSocket() client: Socket, @MessageBody() payload: { conversationId: string }): void {
    const data = client.data as SocketData;
    if (!data.joinedConversationIds?.has(payload.conversationId)) return;
    const userId = data.userId;
    client.to(conversationRoom(payload.conversationId)).emit('typing:update', {
      conversationId: payload.conversationId,
      userId,
      isTyping: true,
    });
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('typing:stop')
  onTypingStop(@ConnectedSocket() client: Socket, @MessageBody() payload: { conversationId: string }): void {
    const data = client.data as SocketData;
    if (!data.joinedConversationIds?.has(payload.conversationId)) return;
    const userId = data.userId;
    client.to(conversationRoom(payload.conversationId)).emit('typing:update', {
      conversationId: payload.conversationId,
      userId,
      isTyping: false,
    });
  }

  // ---------- Barramento (RabbitMQ) -> WebSocket ----------

  private async subscribeToUserEvents(client: Socket, userId: string): Promise<void> {
    const channel = await this.rabbitMq.getChannel();
    const queueName = `rt.${client.id}`;

    await channel.assertQueue(queueName, { durable: false, autoDelete: true, exclusive: false });
    await channel.bindQueue(queueName, EVENTS_EXCHANGE, userRoutingKey(userId));

    const { consumerTag } = await channel.consume(
      queueName,
      (msg: ConsumeMessage | null) => {
        if (!msg) return;
        try {
          const event = JSON.parse(msg.content.toString()) as { type: string; data: unknown };
          client.emit(event.type, event.data);
        } catch (error) {
          this.logger.warn(`Falha ao processar evento do barramento: ${(error as Error).message}`);
        } finally {
          channel.ack(msg);
        }
      },
      { noAck: false },
    );

    const data = client.data as SocketData;
    data.consumerTag = consumerTag;
    data.queueName = queueName;
  }

  private async unsubscribeFromUserEvents(client: Socket): Promise<void> {
    const data = client.data as SocketData;
    if (!data.consumerTag) return;

    try {
      const channel = await this.rabbitMq.getChannel();
      await channel.cancel(data.consumerTag); // fila autoDelete some sozinha ao ficar sem consumidor
    } catch (error) {
      this.logger.warn(`Falha ao cancelar consumidor do RabbitMQ: ${(error as Error).message}`);
    }
  }

  // ---------- Helpers ----------

  private async broadcastPresence(userId: string, status: 'ONLINE' | 'OFFLINE'): Promise<void> {
    const conversations = await this.conversationRepository.findAllForUser(userId);
    const partnerIds = new Set<string>();
    conversations.forEach((c) =>
      c.activeParticipants.forEach((p) => {
        if (p.userId !== userId) partnerIds.add(p.userId);
      }),
    );

    const channel = await this.rabbitMq.getChannel();
    const payload = Buffer.from(JSON.stringify({ type: 'presence:update', data: { userId, status } }));
    partnerIds.forEach((partnerId) => {
      channel.publish(EVENTS_EXCHANGE, userRoutingKey(partnerId), payload, { persistent: false });
    });
  }

  private async authenticate(client: Socket): Promise<string | null> {
    const raw = client.handshake.auth?.token || client.handshake.headers?.authorization;
    if (!raw) return null;
    const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      return payload.sub;
    } catch (error) {
      this.logger.warn(`Falha ao autenticar conexão WebSocket: ${(error as Error).message}`);
      return null;
    }
  }
}
