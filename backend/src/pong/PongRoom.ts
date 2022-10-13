import { Room, Client } from 'colyseus';
import { GameState, GameStatus } from './schema';
import { Physics, PaddleDirection } from './Physics';

export interface PaddleMoveMessage {
  newDirection: PaddleDirection,
}

export class PongRoom extends Room<GameState> {
  maxClients = 2;

  private physics!: Physics;
  private lpId!: string;
  private rpId!: string;
  private pointsToWin!: number;

  onCreate(options: any) {
    console.info('PongRoom created', options);
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
    if (this.clients.length === 1) {
      this.lpId = client.id;
    } else if (this.clients.length === 2) {
      this.rpId = client.id;
      this.state.gameStatus = GameStatus.PLAYING;
      this.setSimulationInterval(deltaTime => this.update(deltaTime));
      this.setPatchRate(16.66);
    }
  }

  onLeave(client: Client, consented: boolean) {
    // if a player leaves the game is cancelled
    this.state.gameStatus = GameStatus.INTERRUPTED;
  }

  onDispose() {
    console.info('Disposing PongRoom');
  }

}