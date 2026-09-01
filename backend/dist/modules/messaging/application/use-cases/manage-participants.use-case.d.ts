import { MessageBusPublisher } from '@shared/application/message-bus.port';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
export declare class ManageParticipantsUseCase {
    private readonly conversationRepository;
    private readonly messageRepository;
    private readonly messageBus;
    constructor(conversationRepository: ConversationRepository, messageRepository: MessageRepository, messageBus: MessageBusPublisher);
    addParticipant(params: {
        conversationId: string;
        requesterId: string;
        newUserId: string;
    }): Promise<void>;
    removeParticipant(params: {
        conversationId: string;
        requesterId: string;
        targetUserId: string;
    }): Promise<void>;
    leave(params: {
        conversationId: string;
        userId: string;
    }): Promise<void>;
    promoteToAdmin(params: {
        conversationId: string;
        requesterId: string;
        targetUserId: string;
    }): Promise<void>;
    demoteAdmin(params: {
        conversationId: string;
        requesterId: string;
        targetUserId: string;
    }): Promise<void>;
    renameGroup(params: {
        conversationId: string;
        requesterId: string;
        name: string;
    }): Promise<import("../../domain/entities/conversation.entity").Conversation>;
    private loadConversation;
    private emitSystemMessage;
    private notify;
}
