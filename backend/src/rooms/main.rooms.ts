import { Client, Room } from 'colyseus';
import { User } from '../channel/chat.rooms'

export class mainUser {
  user: User;
  clientid: string;
}

export class MainRoom extends Room {
  constructor() {
    super();
  }

  private users! : mainUser[];

  async onCreate(options: any) {
    console.info('Main room created: ');
    this.users = new Array<mainUser>()

    this.onMessage('Joining', (client: Client, message: User) => {
      let newUser = new mainUser();
      newUser.clientid = client.id;
      newUser.user = message;
      this.users.push(newUser)
      this.broadcast('isOnline', newUser.user.id ,{except : client})
    })

    this.onMessage('isOnGame', (client: Client, message: User) => {
      this.broadcast('isOnGame', message.id, {except : client})
    })

    this.onMessage('isOnline', (client: Client, message: User) => {
      this.broadcast('isOnline', message.id, { except : client})
    })

    this.onMessage('Invitating', (client: Client, message: any) => {
      this.broadcast('Invitation', message, {except : client} )
    })
  }

  async onJoin(client: Client, options: User) {
    // this.users.push(options)
  }

  async onLeave(client: Client, options: any) {
    let leavingUser = this.users.find((element) => element.clientid == client.id);
    this.broadcast('isOffline', leavingUser.user.id, {except : client})
    const index = this.users.indexOf(leavingUser);
    this.users.splice(index, 1);
  }

  async onDispose() {
    console.info('Main room disposed');
  }
}