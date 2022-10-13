<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'DefaultLayout',
  data () {
    return {
      rooms: [
        {player1: 'Ben', player2: 'Toto'},
        {player1: 'Ben', player2: 'Toto'},
        {player1: 'Ben', player2: 'Toto'},
        {player1: 'Ben', player2: 'Toto'},
        {player1: 'Ben', player2: 'Toto'},
        {player1: 'Ben', player2: 'Toto'},
        {player1: 'Ben', player2: 'Toto'}
      ]
    }
  },
  beforeCreate() {
    if (!this.$store.state.currentUser.nickname)
      this.$router.push('/');
  },
  mounted() {
    this.$store.commit('changeNoBall', false)
  },
  methods: {
    watchRoom(room : any) {
      console.log("Currently watchin room: ", room);
    }
  }
})
</script>

<template>
  <v-app dark fill-height>
    <v-subheader class="text-h2 white--text title">
      Ongoing games
    </v-subheader>
      <v-list
        v-for="(room, index) in rooms"
        :key="index"
        class="game">
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