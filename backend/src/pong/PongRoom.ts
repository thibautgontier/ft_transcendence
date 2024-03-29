import { Room, Client } from 'colyseus';
import { GameState, GameStatus } from './schema';
import { Physics, PaddleDirection } from './Physics';

export interface PaddleMoveMessage {
  newDirection: PaddleDirection,
}

export class PongRoom extends Room<GameState> {

  private physics!: Physics;
  private lpId!: string;
  private rpId!: string;
  private User1ID!: number;
  private User2ID!: number
  private pointsToWin!: number;

  onCreate(options: any) {
    console.info('PongRoom created');
    this.User1ID = -1;
    this.User2ID = -1;
    this.setState(new GameState());

    if (options.ballSpeed) {
      this.physics = new Physics(this.state.ball, this.state.leftPaddle, this.state.rightPaddle, options);
      this.pointsToWin = options.pointsToWin;
    }
    else {
      this.physics = new Physics(this.state.ball, this.state.leftPaddle, this.state.rightPaddle, { ballSpeed: 0.5, paddleSpeed: 0.5 });
      this.pointsToWin = 3;
    }
	  // FIXME: strong typing of message is not enforced
	this.onMessage('PaddleMoveMessage', (client: Client, message : PaddleMoveMessage) => {
		if (client.id === this.rpId)
		  this.physics.setRightPaddleDirection(message.newDirection);
	
		if (client.id === this.lpId)
		  this.physics.setLeftPaddleDirection(message.newDirection);
	  });
    this.onMessage('Score', (client: Client, message : any) => {
      if (client.id == this.lpId) {
        if (this.state.scoreboard.left > this.state.scoreboard.right)
          client.send('Score', {winnerId: this.User1ID, loserId: this.User2ID})
        else
          client.send('Score', {winnerId: this.User2ID, loserId: this.User1ID})
      }
    })
  }


  private update(deltaTime: number) {
    if (this.state.gameStatus !== GameStatus.PLAYING) return;
    if (this.physics.checkLeftWall()) {
      this.state.scoreboard.right += 1;
      this.state.ball.center();
      this.physics.setAngle(0);
    }
    if (this.physics.checkRightWall()) {
      this.state.scoreboard.left += 1;
      this.state.ball.center();
      this.physics.setAngle(Math.PI);
    }

    if (this.state.scoreboard.left >= this.pointsToWin || this.state.scoreboard.right >= this.pointsToWin) {
      this.state.gameStatus = GameStatus.FINISHED;
      return;
    }
    this.physics.update(deltaTime);
  }

  onJoin(client: Client, options: any) {
    if (this.clients.length === 1 && this.User1ID == -1) {
      this.User1ID = options.idPlayer
      this.lpId = client.id;
      console.log(1)
    } else if (this.clients.length === 2 && this.User2ID == -1) {
      console.log(2)
      this.User2ID = options.idPlayer
      this.rpId = client.id;
      this.state.gameStatus = GameStatus.PLAYING;
      this.setSimulationInterval(deltaTime => this.update(deltaTime));
      this.setPatchRate(16.66);
    } else {
      console.log('spectator')
      client.send('info', {'id1' : this.User1ID, 'id2' : this.User2ID})
    }
  }

  onLeave(client: Client, consented: boolean) {
    // if a player leaves the game is cancelled
    if (client.id == this.rpId || client.id == this.lpId) {
      this.state.gameStatus = GameStatus.INTERRUPTED;
      this.lock()
    }
    if(client.id == this.lpId) {
      console.log('client 1 left');
    } else if(client.id == this.rpId) {
      console.log('client 2 left');
    } else
      console.log('spectator left');
  }

  async onDispose() {
    console.info('Disposing PongRoom');
    await this.disconnect()
  }

}