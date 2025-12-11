import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('ShopService');

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_SHOP_QUEUE || 'shop_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3003);

  logger.log(`🛒 Shop Service running on port ${process.env.PORT || 3003}`);
  logger.log(`📡 RabbitMQ connected to ${process.env.RABBITMQ_SHOP_QUEUE || 'shop_queue'}`);
}
bootstrap();