import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

export const EVENTS_EXCHANGE = 'gloopy.events';

/**
 * Gerencia a conexão/canal AMQP e reconecta automaticamente em caso de queda -
 * o RabbitMQ é infraestrutura compartilhada e pode reiniciar independentemente da API.
 */
@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqService.name);
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private connecting: Promise<void> | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  async getChannel(): Promise<amqp.Channel> {
    if (this.channel) return this.channel;
    await this.connect();
    if (!this.channel) throw new Error('Não foi possível estabelecer canal com o RabbitMQ.');
    return this.channel;
  }

  private async connect(): Promise<void> {
    if (this.connecting) return this.connecting;

    this.connecting = (async () => {
      const url = this.config.get<string>('RABBITMQ_URL', 'amqp://gloopy:gloopy@localhost:5673');
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(EVENTS_EXCHANGE, 'topic', { durable: true });

      this.connection.on('close', () => {
        this.logger.warn('Conexão com o RabbitMQ caiu - tentando reconectar em 3s...');
        this.channel = null;
        this.connection = null;
        setTimeout(() => this.connect().catch((err) => this.logger.error(err)), 3000);
      });
      this.connection.on('error', (err: Error) => {
        this.logger.error(`Erro na conexão com o RabbitMQ: ${err.message}`);
      });

      this.logger.log('Conectado ao RabbitMQ.');
    })();

    try {
      await this.connecting;
    } finally {
      this.connecting = null;
    }
  }
}
