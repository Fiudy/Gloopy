import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
export declare const EVENTS_EXCHANGE = "gloopy.events";
export declare class RabbitMqService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly logger;
    private connection;
    private channel;
    private connecting;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getChannel(): Promise<amqp.Channel>;
    private connect;
}
