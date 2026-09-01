import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { RabbitMqModule } from '@shared/infrastructure/rabbitmq/rabbitmq.module';
import { IdentityModule } from '@modules/identity/identity.module';
import { MessagingModule } from '@modules/messaging/messaging.module';
import { PresenceModule } from '@modules/presence/presence.module';
import { MediaModule } from '@modules/media/media.module';
import { GamesModule } from '@modules/games/games.module';
import { RealtimeModule } from './realtime/realtime.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    RabbitMqModule,
    IdentityModule,
    MessagingModule,
    PresenceModule,
    MediaModule,
    GamesModule,
    RealtimeModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
