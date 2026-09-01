"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RabbitMqService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqService = exports.EVENTS_EXCHANGE = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqp = require("amqplib");
exports.EVENTS_EXCHANGE = 'gloopy.events';
let RabbitMqService = RabbitMqService_1 = class RabbitMqService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(RabbitMqService_1.name);
        this.connection = null;
        this.channel = null;
        this.connecting = null;
    }
    async onModuleInit() {
        await this.connect();
    }
    async onModuleDestroy() {
        await this.channel?.close().catch(() => undefined);
        await this.connection?.close().catch(() => undefined);
    }
    async getChannel() {
        if (this.channel)
            return this.channel;
        await this.connect();
        if (!this.channel)
            throw new Error('Não foi possível estabelecer canal com o RabbitMQ.');
        return this.channel;
    }
    async connect() {
        if (this.connecting)
            return this.connecting;
        this.connecting = (async () => {
            const url = this.config.get('RABBITMQ_URL', 'amqp://gloopy:gloopy@localhost:5673');
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(exports.EVENTS_EXCHANGE, 'topic', { durable: true });
            this.connection.on('close', () => {
                this.logger.warn('Conexão com o RabbitMQ caiu - tentando reconectar em 3s...');
                this.channel = null;
                this.connection = null;
                setTimeout(() => this.connect().catch((err) => this.logger.error(err)), 3000);
            });
            this.connection.on('error', (err) => {
                this.logger.error(`Erro na conexão com o RabbitMQ: ${err.message}`);
            });
            this.logger.log('Conectado ao RabbitMQ.');
        })();
        try {
            await this.connecting;
        }
        finally {
            this.connecting = null;
        }
    }
};
exports.RabbitMqService = RabbitMqService;
exports.RabbitMqService = RabbitMqService = RabbitMqService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RabbitMqService);
//# sourceMappingURL=rabbitmq.service.js.map