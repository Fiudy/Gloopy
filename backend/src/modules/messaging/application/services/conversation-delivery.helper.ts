import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Conversation } from '../../domain/entities/conversation.entity';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';

/**
 * Passo comum a qualquer envio de conteúdo numa conversa (texto ou mídia):
 * carrega o agregado, garante que quem está enviando é membro ativo e, se for
 * uma conversa DIRECT pendente respondida pelo destinatário, marca como aceita.
 * Extraído pra não duplicar entre SendMessageUseCase e SendMediaMessageUseCase.
 */
export async function loadConversationForSending(
  conversationRepository: ConversationRepository,
  params: { conversationId: string; senderId: string },
): Promise<Conversation> {
  const conversation = await conversationRepository.findById(params.conversationId);
  if (!conversation) {
    throw new NotFoundException('Conversa não encontrada.');
  }
  if (!conversation.isActiveMember(params.senderId)) {
    throw new ForbiddenException('Você não faz parte desta conversa.');
  }

  if (conversation.isDirectPending && conversation.initiatorId !== params.senderId) {
    conversation.acceptDirect();
    await conversationRepository.save(conversation);
  }

  return conversation;
}
