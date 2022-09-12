<script lang="ts">
import Vue from 'vue'
import { Client, Room } from 'colyseus.js'
import { PaddleMoveMessage } from '../../backend/src/pong/PongRoom'
import { GameState } from '../../backend/src/pong/schema'
import { render, resizeCanvas } from './../types/render'
import { PaddleDirection } from '../../backend/src/pong/Physics'
export default Vue.extend({
  data(): any {
    return {
      state: GameState,
    }
  },
  async mounted() {
    const client = new Client('ws://localhost:2567')
    let room: Room<GameState>
    try {
      room = await client.joinOrCreate('pong', {}, GameState)
      console.log(room.sessionId, 'joined', room.name)
    } catch (e) {
      console.log('JOIN ERROR', e)
    }

    this.state = room.state // set initial state
    room.onStateChange((s) => {
      // set state on every update
      this.state = s
    })

    window.addEventListener('resize', () => resizeCanvas())
    resizeCanvas()

    this.renderLoop() // start render loop

    // input handling
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          room.send('PaddleMoveMessage', {
            newDirection: PaddleDirection.UP,
          } as PaddleMoveMessage)
          break
        case 'ArrowDown':
          room.send('PaddleMoveMessage', {
            newDirection: PaddleDirection.DOWN,
          } as PaddleMoveMessage)
          break
      }
    })

    document.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          room.send('PaddleMoveMessage', {
            newDirection: PaddleDirection.STOP,
          } as PaddleMoveMessage)
      }
    })
  },
  methods: {
    renderLoop() {
      requestAnimationFrame(this.renderLoop)
      render(this.state)
    },
  },
})
</script>

<template>
  <CanvasTest />
</template>
