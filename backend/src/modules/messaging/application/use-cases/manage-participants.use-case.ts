import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { publishToUsers } from '@shared/application/publish-to-users.helper';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';

/**
 * Agrupa as operações de gestão de participantes de um grupo (adicionar,
 * remover, sair, promover/rebaixar admin) - todas seguem o mesmo formato:
 * carregar o agregado, aplicar a regra, persistir, gerar mensagem de sistema
 * e publicar o evento no barramento.
 */
@Injectable()
export class ManageParticipantsUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly messageBus: MessageBusPublisher,
  ) {}

  async addParticipant(params: { conversationId: string; requesterId: string; newUserId: string }) {
    const conversation = await this.loadConversation(params.conversationId);
    conversation.addParticipant(params.requesterId, params.newUserId);
    await this.conversationRepository.save(conversation);

    await this.emitSystemMessage(conversation.id, 'PARTICIPANT_JOINED', 'Um novo participante entrou no grupo.');
    await this.notify(conversation.id, conversation.activeParticipants.map((p) => p.userId));
  }

  async removeParticipant(params: { conversationId: string; requesterId: string; targetUserId: string }) {
    const conversation = await this.loadConversation(params.conversationId);
    const recipientsBefore = conversation.activeParticipants.map((p) => p.userId);

    conversation.removeParticipant(params.requesterId, params.targetUserId);
    await this.conversationRepository.save(conversation);

    await this.emitSystemMessage(conversation.id, 'PARTICIPANT_REMOVED', 'Um participante foi removido do grupo.');
    await this.notify(conversation.id, recipientsBefore);
  }

  async leave(params: { conversationId: string; userId: string }) {
    const conversation = await this.loadConversation(params.conversationId);
    const recipientsBefore = conversation.activeParticipants.map((p) => p.userId);

    conversation.leave(params.userId);
    await this.conversationRepository.save(conversation);

    await this.emitSystemMessage(conversation.id, 'PARTICIPANT_LEFT', 'Um participante saiu do grupo.');
    await this.notify(conversation.id, recipientsBefore);
  }

  async promoteToAdmin(params: { conversationId: string; requesterId: string; targetUserId: string }) {
    const conversation = await this.loadConversation(params.conversationId);
    conversation.promoteToAdmin(params.requesterId, params.targetUserId);
    await this.conversationRepository.save(conversation);

    await this.emitSystemMessage(conversation.id, 'ADMIN_PROMOTED', 'Um participante virou administrador.');
    await this.notify(conversation.id, conversation.activeParticipants.map((p) => p.userId));
  }

  async demoteAdmin(params: { conversationId: string; requesterId: string; targetUserId: string }) {
    const conversation = await this.loadConversation(params.conversationId);
    conversation.demoteAdmin(params.requesterId, params.targetUserId);
    await this.conversationRepository.save(conversation);

    await this.emitSystemMessage(conversation.id, 'ADMIN_DEMOTED', 'Um administrador foi rebaixado a membro.');
    await this.notify(conversation.id, conversation.activeParticipants.map((p) => p.userId));
  }

  async renameGroup(params: { conversationId: string; requesterId: string; name: string }) {
    const conversation = await this.loadConversation(params.conversationId);
    conversation.rename(params.requesterId, params.name);
    await this.conversationRepository.save(conversation);
    await this.emitSystemMessage(conversation.id, 'GROUP_RENAMED', `O grupo agora se chama "${conversation.name}".`);
    await this.notify(conversation.id, conversation.activeParticipants.map((participant) => participant.userId));
    return conversation;
  }

  private async loadConversation(conversationId: string) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada.');
    }
    return conversation;
  }

  private async emitSystemMessage(
    conversationId: string,
    event: Parameters<typeof Message.createSystem>[0]['event'],
    content: string,
  ) {
    const systemMessage = Message.createSystem({ conversationId, event, content }, uuid());
    await this.messageRepository.save(systemMessage);
  }

  private async notify(conversationId: string, recipientUserIds: string[]) {
    await publishToUsers(this.messageBus, recipientUserIds, 'conversation:participants_changed', {
      conversationId,
    });
  }
}
