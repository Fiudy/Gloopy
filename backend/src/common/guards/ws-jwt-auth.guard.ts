import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

/**
 * Guard de autenticação para o WebSocket Gateway.
 * Espera o token JWT enviado via handshake: `auth: { token: 'Bearer xxx' }`.
 */
@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);

    if (!token) {
      throw new UnauthorizedException('Token de autenticação ausente.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      (client.data as Record<string, unknown>).userId = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException('Token de autenticação inválido.');
    }
  }

  private extractToken(client: Socket): string | null {
    const raw = client.handshake.auth?.token || client.handshake.headers?.authorization;
    if (!raw) return null;
    return raw.startsWith('Bearer ') ? raw.slice(7) : raw;
  }
}
