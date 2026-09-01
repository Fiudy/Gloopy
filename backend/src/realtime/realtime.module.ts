import { Module } from '@nestjs/common';
import { IdentityModule } from '@modules/identity/identity.module';
import { MessagingModule } from '@modules/messaging/messaging.module';
import { PresenceModule } from '@modules/presence/presence.module';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [IdentityModule, MessagingModule, PresenceModule],
  providers: [RealtimeGateway],
})
export class RealtimeModule {}
