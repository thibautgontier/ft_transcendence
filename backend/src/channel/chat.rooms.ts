import { Client, Room } from 'colyseus';
import { Schema, type } from '@colyseus/schema';

export interface IChatRoomMessage {
  Content: string;
  Nickname: string;
}

export class ChatRoomMessage implements IChatRoomMessage {
  Content = '';
  Nickname = '';
}

export interface IUser {
  accessToken: string;
  avatar: string;
  id: number;
  nickname: string;
}

export class User implements IUser {
  accessToken = '';
  avatar = '';
  id = 0;
  nickname = '';
}

export class ChatState extends Schema {
  @type('string')
  public name = '';
}

export class ChatRoom extends Room<ChatState> {
  constructor() {
    super();
  }

  async onCreate(options: any) {
    console.info('Chat room created: ');

    // this.setState(new ChatState());

    this.onMessage('Message', (client, message: string) => {
      let msg = new ChatRoomMessage();
      msg.Content = message.substring(
        message.indexOf('@:') + 2,
        message.length,
      );
      msg.Nickname = message.substring(0, message.indexOf('@:'));

      this.broadcast('Message', msg);
      console.log('client :', client.sessionId, 'sent', message);
    });

    this.onMessage('Leaving', (client, message: User) => {
      this.broadcast('Leaving', message, { except: client});
    });

    this.onMessage('*', (client, type, message) => {
      console.log('client :', client.sessionId, 'sent', type, message);
    });
  }

  async onJoin(client: Client, options: User) {
    console.info(
      `Client sessionId: ${client.sessionId} roomId: ${this.roomId} joined the chat`,
      options.nickname,
    );
    this.broadcast('Joining', options, { except: client } );
  }

  async onLeave(client: Client, options: any) {
    console.info(`Client ${client.sessionId} left the chat`);
  }

  async onDispose() {
    console.info(`Chat room : ${this.roomId} disposed`);
  }
}
