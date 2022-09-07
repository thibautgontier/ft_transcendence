import { Client, Room } from 'colyseus';

export class ChatRoom extends Room {
  constructor() {
    super();
  }

  async onCreate(options: any) {
    console.info('Chat room created: ', options);

    this.onMessage('Message', (client, message) => {
      //
      // Triggers when 'Message' message is sent.
      //
      this.broadcast('Message', message);
      console.log('client :', client.sessionId, 'sent', message);
    });

    this.onMessage('*', (client, type, message) => {
      //
      // Triggers when any other type of message is sent,
      // excluding "Message", which has its own specific handler defined above.
      //
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
