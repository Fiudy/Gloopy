import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from '@common/filters/domain-exception.filter';

async function bootstrap(): Promise<void> {
  if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change-me-in-production')) {
    throw new Error('JWT_SECRET seguro é obrigatório em produção.');
  }
  const app = await NestFactory.create(AppModule, { cors: { origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN ?? false : true } });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());

  const port = process.env.PORT ? Number(process.env.PORT) : 3333;
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`Gloopy API rodando na porta ${port}`);
}

bootstrap();
