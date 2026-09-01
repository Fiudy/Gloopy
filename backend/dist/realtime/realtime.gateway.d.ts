import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { RabbitMqService } from '@shared/infrastructure/rabbitmq/rabbitmq.service';
import { PresenceService } from '@modules/presence/application/presence.service';
import { ConversationRepository } from '@modules/messaging/domain/repositories/conversation.repository';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly presenceService;
    private readonly conversationRepository;
    private readonly rabbitMq;
    private readonly logger;
    constructor(jwtService: JwtService, presenceService: PresenceService, conversationRepository: ConversationRepository, rabbitMq: RabbitMqService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    onJoinConversation(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    onLeaveConversationRoom(client: Socket, payload: {
        conversationId: string;
    }): Promise<void>;
    onTypingStart(client: Socket, payload: {
        conversationId: string;
    }): void;
    onTypingStop(client: Socket, payload: {
        conversationId: string;
    }): void;
    private subscribeToUserEvents;
    private unsubscribeFromUserEvents;
    private broadcastPresence;
    private authenticate;
}
