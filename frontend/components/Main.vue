<script lang='ts'>
import axios from 'axios'
import Vue from 'vue'
import { User } from '../types/User'

export default Vue.extend({
  data() {
    return {
      loginReturn: User,
    }
  },
  async mounted() {
    const response = await axios.get('/login/');
    this.loginReturn = response.data;
    this.$store.commit('getCurrentUser', this.loginReturn);
    console.log(this.$store.state.currentUser.photo);
    }
  },
)
</script>

<template>
  <div>
    <h1 v-if="$store.state.currentUserId != null">
      <Toolbar />
    </h1>
    <Notification />
    <v-row justify="center" style="margin-top: 10%">
      <v-btn>Leaderboard</v-btn>
      <v-btn>Play</v-btn>
      <v-btn>Spectate</v-btn>
    </v-row>
  </div>
</template>
