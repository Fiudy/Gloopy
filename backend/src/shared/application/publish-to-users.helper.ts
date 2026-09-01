import { MessageBusPublisher } from './message-bus.port';

/** Publica o mesmo evento para uma lista de usuários (um publish por destinatário). */
export async function publishToUsers(
  bus: MessageBusPublisher,
  userIds: string[],
  type: string,
  data: unknown,
): Promise<void> {
  await Promise.all(userIds.map((userId) => bus.publishToUser(userId, { type, data })));
}
