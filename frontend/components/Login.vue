<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      loginSuccess: 0,
      loginFailed: 0,
    }
  },
  methods: {
    async redirectToLog() {
      window.location.href = 'http://localhost:3000/login/42'
      this.$router.push('Main')
    },
    // disconnectRequest() {
    // 	console.log('TEST');
    // 	this.$store.commit('deleteUser');
    // 	this.loginSuccess = 0;
    // 	this.loginFailed = 0;
    // },
  },
})
</script>

<template>
  <v-container fill-height>
    <h1 v-if="this.$store.state.currentUser.id != 0">
      <Toolbar />
    </h1>
    <v-col>
      <v-row justify="center" align="center">
        <PongLogo />
      </v-row>
      <v-row justify="center" align="center" style="margin-top: 10%">
        <h1 v-if="!this.$store.state.currentUser.id">
          <v-btn x-large color="black" @click.stop="redirectToLog()"
            >42 Connect</v-btn
          >
        </h1>
        <h1 v-else>
          <v-btn x-large color="black" @click.stop="disconnectRequest()"
            >Disconnect</v-btn
          >
        </h1>
      </v-row>
      <h1 v-if="this.loginSuccess">
        <v-alert type="success" transition="scale-transition" dismissible
          >Logged successfully!</v-alert
        >
      </h1>
      <h1 v-if="this.loginFailed">
        <v-alert type="error" transition="scale-transition" dismissible
          >Failed to log!</v-alert
        >
      </h1>
    </v-col>
  </v-container>
</template>
