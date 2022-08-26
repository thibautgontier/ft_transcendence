import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  await app.listen(3000);
}
bootstrap();
