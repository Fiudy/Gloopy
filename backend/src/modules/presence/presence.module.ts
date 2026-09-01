import { Module } from '@nestjs/common';
import { IdentityModule } from '@modules/identity/identity.module';
import { PresenceService } from './application/presence.service';
import { PresenceRepository } from './domain/repositories/presence.repository';
import { RedisPresenceRepository } from './infrastructure/redis-presence.repository';
import { redisProvider } from './infrastructure/redis.provider';

@Module({
  imports: [IdentityModule], // usa UserRepository para atualizar "lastSeenAt"
  providers: [
    redisProvider,
    PresenceService,
    { provide: PresenceRepository, useClass: RedisPresenceRepository },
  ],
  exports: [PresenceService],
})
export class PresenceModule {}
