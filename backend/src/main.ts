import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as http from 'http';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { GameService } from './game.service';
import { Globals } from './utils/globals';
import { MainRoom } from './rooms/main.rooms';
import { monitor } from '@colyseus/monitor';

const ROOMS = [MainRoom];

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const basicAuth = require('express-basic-auth');
  const gameApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(gameApp),
  );
  const basicAuthMiddleware = basicAuth({
    users: { admin: 'admin' },
    challenge: true,
  });
  nestApp.enableShutdownHooks();
  nestApp.enableCors();
  nestApp.init();

  const httpServer = http.createServer(gameApp);
  const gameServer = nestApp.get(GameService);
  gameServer.createServer(httpServer);

  const config = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('The Transcendence API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('api', nestApp, document);

  nestApp.useGlobalPipes(new ValidationPipe());
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

  for (const room of ROOMS) {
    console.info(`Registering room: ${room.name}`);
    gameServer.defineRoom(room.name, room);
  }

  gameServer.listen(3000).then(() => {
    Globals.nestApp = nestApp;
  });
}
bootstrap();
