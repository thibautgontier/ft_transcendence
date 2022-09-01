import { Client, Room } from 'colyseus';

export class ChatRoom extends Room {
  constructor() {
    super();
  }

  async onCreate(options : any) {
    console.info('Chat room created: ', options);
	this.onMessage("action", (client, message) => {
        //
        // Triggers when 'action' message is sent.
        //
		console.log("action")
    });

    this.onMessage("*", (client, type, message) => {
        //
        // Triggers when any other type of message is sent,
        // excluding "action", which has its own specific handler defined above.
        //
        console.log(client.sessionId, "sent", type, message);
    });
  }

  async onJoin(client: Client, options: any) {
    console.info(`Client sessionId: ${client.sessionId} roomId: ${this.roomId} joined the chat`);
	client.send("Message de bienvenue", "Welcome to our ChatRoom")
  }

  async onLeave(client: Client, options: any) {
    console.info(`Client ${client.sessionId} left the chat`);
  }

  async onDispose() {
    console.info(`Chat room : ${this.roomId} disposed`);
  }
}
