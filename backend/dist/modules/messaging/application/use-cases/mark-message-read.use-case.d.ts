import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository';
export declare class MarkMessageReadUseCase {
    private readonly conversationRepository;
    private readonly messageRepository;
    private readonly userRepository;
    constructor(conversationRepository: ConversationRepository, messageRepository: MessageRepository, userRepository: UserRepository);
    execute(params: {
        messageId: string;
        userId: string;
    }): Promise<void>;
}
