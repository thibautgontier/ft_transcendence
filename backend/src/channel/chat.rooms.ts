import { Client, Room } from 'colyseus';
import * as Colyseus from 'colyseus.js';

export interface IUser {
  accessToken: string;
  avatar: string;
  id: number;
  nickname: string;
  twoFA: boolean;
}

export class User implements IUser {
  accessToken = '';
  avatar = '';
  id = 0;
  nickname = '';
  twoFA = false;
}

export interface IRoom {
  channel: Colyseus.Room;
  channelName: string;
  messages: Message[];
  id: number;
  Type: chanStatus;
  members: User[];
}

export class OurRoom implements IRoom {
  channel = new Colyseus.Room('');
  channelName = '';
  messages: Message[] = [];
  id = 0;
  Type = chanStatus.PUBLIC;
  members: User[] = [];
}

export interface Imessage {
  id: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  Content: string;
  Nickname: string;
}

export class Message implements Imessage {
  id = 0;
  CreatedAt = new Date();
  UpdatedAt = new Date();
  Content = '';
  Nickname = '';
}

export enum chanStatus {
  PUBLIC = 'public',
  PROTECTED = 'protected', //if mdp exist
  PRIVATE = 'private', // only dm into two user
}

export class ChatRoom extends Room {
  constructor() {
    super();
  }

  async onCreate(options: any) {
    // console.info('Chat room created: ');

    this.onMessage('Message', (client, msg) => {
      this.broadcast('Message', msg);
    //   console.log('client :', client.sessionId, 'sent', msg.Content);
    });

    this.onMessage('Leaving', (client, message: User) => {
      this.broadcast('Leaving', message, { except: client });
    });

    this.onMessage('PrivateCreating', (client, Content) => {
      this.broadcast('PrivateCreating', Content);
    });

    this.onMessage('ChanMAJ', (client, message: string) => {
      this.broadcast('ChanMAJ', message, { except: client });
    });

    this.onMessage('*', (client, type, message) => {
    //   console.log('client :', client.sessionId, 'sent', type, message);
    });
  }

  async onJoin(client: Client, options: User) {
    // console.info(
    //   `Client sessionId: ${client.sessionId} roomId: ${this.roomId} joined the chat`,
    //   options.nickname,
    // );
    this.broadcast('Joining', options, { except: client });
  }

  async onLeave(client: Client, options: any) {
    // console.info(`Client ${client.sessionId} left the chat`);
  }

  async onDispose() {
    // console.info(`Chat room : ${this.roomId} disposed`);
  }
}
