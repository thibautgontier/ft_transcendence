import { Client, Room } from 'colyseus';

export class MainRoom extends Room {
  constructor() {
    super();
  }

  async onCreate(options: any) {
    console.info('Main room created: ');

    this.onMessage('Joining', (client: Client, message: any) => {
      console.log('MainRoom: client', message.nickname, 'is online');
    })
  }

  async onJoin(client: Client, options: any) {
  }

  async onLeave(client: Client, options: any) {
    console.log('MainRoom: client', options.nickname, 'is online');
  }

  async onDispose() {
    console.info('Main room disposed');
  }
}