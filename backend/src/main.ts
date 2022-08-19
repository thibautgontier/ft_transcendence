import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MainRoom } from './rooms/main.rooms';
import { monitor } from '@colyseus/monitor';
import { Server } from 'colyseus';

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);
  nestApp.enableShutdownHooks();
  nestApp.enableCors();
  nestApp.init();
  nestApp.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('The Transcendence API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('api', nestApp, document);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const basicAuth = require('express-basic-auth');
  const basicAuthMiddleware = basicAuth({
    users: { admin: 'admin' },
    challenge: true,
  });
  nestApp.use(
    '/colyseus',
    basicAuthMiddleware,
    monitor({
      columns: [
        'roomId',
        'name',
        'clients',
        { metadata: 'spectators' },
        'locked',
        'elapsedTime',
      ],
    }),
  );

  const gameServer = new Server();
  gameServer.define(MainRoom.name, MainRoom);

  gameServer.attach({ server: nestApp.getHttpServer() });
  await nestApp.listen(3000);
}
bootstrap();
