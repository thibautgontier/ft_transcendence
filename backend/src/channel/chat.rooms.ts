import { Client, Room } from 'colyseus';

export interface IChatRoomMessage {
  Content: string;
  Nickname: string;
}

export class ChatRoomMessage implements IChatRoomMessage {
  Content = '';
  Nickname = '';
}

export class ChatRoom extends Room {
  constructor() {
    super();
  }

  async onCreate(options: any) {
    console.info('Chat room created: ', options);

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

    this.onMessage('*', (client, type, message) => {
      console.log('client :', client.sessionId, 'sent', type, message);
    });
  }

  async onJoin(client: Client, options: any) {
    console.info(
      `Client sessionId: ${client.sessionId} roomId: ${this.roomId} joined the chat`,
    );
  }

  async onLeave(client: Client, options: any) {
    console.info(`Client ${client.sessionId} left the chat`);
  }

  async onDispose() {
    console.info(`Chat room : ${this.roomId} disposed`);
  }
}
