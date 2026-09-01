export interface BusEvent<T = unknown> {
    type: string;
    data: T;
}
export declare abstract class MessageBusPublisher {
    abstract publishToUser(userId: string, event: BusEvent): Promise<void>;
    abstract publishToConversation(conversationId: string, event: BusEvent): Promise<void>;
}
