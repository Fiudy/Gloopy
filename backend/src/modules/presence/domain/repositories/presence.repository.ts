/**
 * Porta de presença. Um usuário pode estar conectado em múltiplos dispositivos
 * (várias abas/celular+web) - só fica OFFLINE quando a última conexão cai.
 */
export abstract class PresenceRepository {
  /** Registra uma nova conexão (socket) e retorna se o usuário ESTAVA offline antes disso. */
  abstract addConnection(userId: string, socketId: string): Promise<{ wasOffline: boolean }>;

  /** Remove uma conexão e retorna se o usuário FICOU offline (nenhuma conexão restante). */
  abstract removeConnection(userId: string, socketId: string): Promise<{ isNowOffline: boolean }>;

  abstract isOnline(userId: string): Promise<boolean>;
  abstract filterOnline(userIds: string[]): Promise<string[]>;
}
