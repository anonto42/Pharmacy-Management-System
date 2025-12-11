import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('ApiGateway');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow frontend
    credentials: true,
  });

  const config = new DocumentBuilder()
      .setTitle('Microservices API Gateway')
      .setDescription('API Gateway for Microservices Architecture')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);

  logger.log(`🚀 API Gateway running on port ${process.env.PORT || 3000}`);
  logger.log(`📚 Swagger docs: http://localhost:${process.env.PORT || 3000}/api/docs`);
}
bootstrap();