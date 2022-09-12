<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  data() {
    return {
      loginSuccess: 0,
      loginFailed: 0,
    }
  },
  mounted() {
    console.log('mounted test id: ', this.$store.state.currentUser.id);
  },
  methods: {
    async redirectToLog() {
				window.location.href = "http://localhost:3000/login/42"
        const response = await axios.get("/login/");
        if (response.data) {
          this.$store.commit('getCurrentUser', response.data);
          this.loginSuccess = 1;
          }
          else {
            this.loginFailed = 1
          }
        },
		    disconnectRequest() {
				console.log('TEST');
				this.$store.commit('deleteUser');
				this.loginSuccess = 0;
				this.loginFailed = 0;
			},
		}
})
</script>

<template>
  <v-container fill-height>
    <v-col>
      <v-row justify="center" align="center">
        <PongLogo />
      </v-row>
      <v-row justify="center" align="center" style="margin-top: 10%">
        <h1 v-if="!$store.state.currentUser.id">
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
      <h1 v-if="$store.state.currentUser.id != 0">
        <v-alert type="success" transition="scale-transition" dismissible
          >Logged successfully!</v-alert
        >
      </h1>
      <h1 v-if="loginFailed">
        <v-alert type="error" transition="scale-transition" dismissible
          >Failed to log!</v-alert
        >
      </h1>
    </v-col>
  </v-container>
</template>
