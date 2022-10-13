<script lang="ts">
import Vue from 'vue'
import * as Colyseus from 'colyseus.js'
import axios from 'axios'
import { GameState } from '../types/pong/schema'

export class newAvailableRoom {
  player1 = ''
  player2 = ''
  pongRoom = new Colyseus.Room('')
}

export default Vue.extend({
  layout: 'DefaultLayout',
  data() {
    return {
      client: Colyseus.Client,
      available: [],
      rooms: [] as newAvailableRoom[]
    }
  },
  beforeCreate() {
    if (!this.$store.state.currentUser.nickname) this.$router.push('/')
  },
  destroyed() {
    for (const channel of this.rooms) {
      channel.pongRoom.leave()
    }
  },
  async mounted() {
    this.$store.commit('changeNoBall', false)
    this.client = new Colyseus.Client('ws://localhost:3000')
    this.available = await this.client.getAvailableRooms('PongRoom', GameState)
    for (const room of this.available) {
      if (room.clients >= 2) {
        const newavailable = new newAvailableRoom()
        newavailable.pongRoom = await this.client.joinById(
          room.roomId,
          this.$store.state.gameOption,
          GameState
        )
        newavailable.pongRoom.onMessage('info', async (message: any) => {
          let nickname = await axios.get(`user/${message.id1}`)
          newavailable.player1 = nickname.data.Nickname
          nickname = await axios.get(`user/${message.id2}`)
          newavailable.player2 = nickname.data.Nickname
        })
        this.rooms.push(newavailable)
      }
    }
  },
  methods: {
    watchRoom(room: newAvailableRoom) {
      this.$router.push(`/PlayMenu/?sessionId=${room.pongRoom.id}`)
    }
  }
})
</script>

<template>
  <v-app dark fill-height>
    <v-subheader class="text-h2 white--text title"> Ongoing games </v-subheader>
    <v-list v-for="(room, index) in rooms" :key="index" class="game">
      <v-list-item @click.stop="watchRoom(room)">
        <v-list-item-content>
          <v-col>
            <v-list-item-title>{{ room.player1 }}</v-list-item-title>
          </v-col>
          <v-col>
            <v-icon>mdi-sword-cross</v-icon>
          </v-col>
          <v-col>
            <v-list-item-title>{{ room.player2 }}</v-list-item-title>
          </v-col>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-app>
</template>

<style scoped>
.game {
  margin: auto;
  max-width: 30%;
  margin-bottom: 1%;
}
.title {
  margin: auto;
  margin-top: 10%;
  margin-bottom: 5%;
}
</style>
