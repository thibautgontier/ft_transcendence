<script lang="ts">
import Vue from 'vue'
import { Client, Room } from 'colyseus.js'
import { PaddleMoveMessage } from '../../backend/src/pong/PongRoom'
import {
  GameState,
  GameDimensions,
  Ball,
  Paddle,
  Scoreboard,
  GameStatus,
} from '../../backend/src/pong/schema'
import { PaddleDirection } from '../../backend/src/pong/Physics'
export default Vue.extend({
  layout: 'DefaultLayout',
  data(): any {
    return {
      state: GameState,
      canvas: Document,
      ctx: CanvasRenderingContext2D,
      room: GameState,
    }
  },
  beforeCreate() {
    if (!this.$store.state.currentUser.nickname)
      this.$router.push('/');
  },
  async mounted() {
    this.$store.commit('changeNoBall', true)
    this.canvas = document.getElementById(
      'rendering-canvas'
    ) as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')
    const client = new Client('ws://localhost:3000')
    try {
      this.room = await client.joinOrCreate('PongRoom', this.$store.state.gameOption, GameState)
      console.log(this.room.sessionId, 'joined', this.room.name)
    } catch (e) {
      console.log('JOIN ERROR', e)
    }

    this.state = this.room.state // set initial state
    this.room.onStateChange((s : any) => {
      // set state on every update
      this.state = s
    })

    window.addEventListener('resize', () => this.resizeCanvas())
    this.resizeCanvas()

    this.renderLoop() // start render loop

    // input handling
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.room.send('PaddleMoveMessage', {
            newDirection: PaddleDirection.UP,
          } as PaddleMoveMessage)
          break
        case 'ArrowDown':
          this.room.send('PaddleMoveMessage', {
            newDirection: PaddleDirection.DOWN,
          } as PaddleMoveMessage)
          break
      }
    })

    document.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          this.room.send('PaddleMoveMessage', {
            newDirection: PaddleDirection.STOP,
          } as PaddleMoveMessage)
      }
    })
  },
  methods: {
    renderLoop() {
      requestAnimationFrame(this.renderLoop)
      this.render(this.state)
    },
    drawTextCenter(text: string) {
      if (this.ctx == null) return
      this.ctx.fillText(
        text,
        GameDimensions.width / 2,
        GameDimensions.height / 2
      )
    },
    drawHalfwayLine() {
      if (this.ctx == null) return
      this.ctx.beginPath()
      this.ctx.setLineDash([17, 30])
      this.ctx.moveTo(GameDimensions.width / 2, 0)
      this.ctx.lineTo(GameDimensions.width / 2, GameDimensions.height)
      this.ctx.stroke()

      // reset line for next drawing function
      this.ctx.setLineDash([])
    },
    renderBall(ball: Ball) {
      if (this.ctx == null) return
      this.ctx.beginPath()
      this.ctx.arc(ball.x, ball.y, Ball.radius, 0, 2 * Math.PI)
      this.ctx.closePath()
      this.ctx.fill()
    },
    renderPaddle(paddle: Paddle) {
      if (this.ctx == null) return
      this.ctx.fillRect(
        paddle.x - Paddle.width / 2,
        paddle.y - Paddle.height / 2,
        Paddle.width,
        Paddle.height
      )
    },
    renderScoreboard(scoreboard: Scoreboard) {
      if (this.ctx == null) return
      this.ctx.fillText(
        scoreboard.left.toString(),
        GameDimensions.width * (1 / 4),
        100
      )
      this.ctx.fillText(
        scoreboard.right.toString(),
        GameDimensions.width * (3 / 4),
        100
      )
    },
    render(state: GameState) {
      if (this.ctx == null) return
      // Clear screen
      if (this.$store.state.gameOption.color) {
        this.ctx.fillStyle = this.$store.state.gameOption.color;
      }
      else
        this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, GameDimensions.width, GameDimensions.height)

      // Rendering styles
      this.ctx.fillStyle = '#fff'
      this.ctx.strokeStyle = '#fff'
      this.ctx.lineWidth = 10
      this.ctx.font = '100px Monospace'
      this.ctx.textAlign = 'center'

      switch (state.gameStatus) {
        case GameStatus.WAITING:
          this.drawTextCenter('Waiting for opponent')
          break

        case GameStatus.PLAYING:
          // Draw
          this.drawHalfwayLine()
          this.renderBall(state.ball)
          this.renderPaddle(state.leftPaddle)
          this.renderPaddle(state.rightPaddle)
          this.renderScoreboard(state.scoreboard)
          break

        case GameStatus.FINISHED:
          this.renderScoreboard(state.scoreboard)
          this.drawTextCenter('Game finished')
          break

        case GameStatus.INTERRUPTED:
          this.drawTextCenter('Opponent left')
          break
      }
    },
    resizeCanvas() {
      const scale = Math.min(
        window.innerWidth / GameDimensions.width,
        window.innerHeight / GameDimensions.width
      )
      if (this.ctx == null) return
      this.ctx.canvas.width = GameDimensions.width * scale
      this.ctx.canvas.height = GameDimensions.height * scale
      this.ctx.scale(scale, scale)
    },
  },
})
</script>

<template>
<v-app dark>
    <canvas id="rendering-canvas" class="template"></canvas>
</v-app>
</template>

<style>
  .template{
    margin: auto;
    aspect-ratio: 16 9;
    z-index: 128;
  }
</style>
