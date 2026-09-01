import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository';

@Injectable()
export class MarkMessageReadUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(params: { messageId: string; userId: string }): Promise<void> {
    const message = await this.messageRepository.findById(params.messageId);
    if (!message) {
      throw new NotFoundException('Mensagem não encontrada.');
    }

    const conversation = await this.conversationRepository.findById(message.conversationId);
    if (!conversation || !conversation.isActiveMember(params.userId)) {
      throw new ForbiddenException('Você não faz parte desta conversa.');
    }

    const user = await this.userRepository.findById(params.userId);
    if (!user?.readReceiptsEnabled) return;

    await this.messageRepository.markRead(params.messageId, params.userId);
  }
}
