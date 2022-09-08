import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MainRoom } from './rooms/main.rooms';
import { monitor } from '@colyseus/monitor';
import { Server } from 'colyseus';
import { ChatRoom } from './channel/chat.rooms';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('The Transcendence API description')
    .setVersion('1.0')
    .addTag('user')
    .addTag('auth')
    .addTag('social')
    .addTag('channel')
    .addTag('game')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: '42transcendence',
      cookie: { maxAge: 6000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const gameServer = new Server();
  gameServer.define(MainRoom.name, MainRoom);
  gameServer.define(ChatRoom.name, ChatRoom);

  gameServer.attach({ server: nestApp.getHttpServer() });
  await nestApp.listen(3000);
}
bootstrap();
