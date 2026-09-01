import { MessageBusPublisher } from './message-bus.port';
export declare function publishToUsers(bus: MessageBusPublisher, userIds: string[], type: string, data: unknown): Promise<void>;
