import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {Logger, ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("AuthService");

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_AUTH_QUEUE || 'auth_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);

  logger.log(`🚀 Auth Service running on port ${process.env.PORT || 3001}`);
  logger.log(`📡 RabbitMQ connected to ${process.env.RABBITMQ_AUTH_QUEUE || 'auth_queue'}`);
}
bootstrap();
