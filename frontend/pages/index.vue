<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  layout: 'DefaultLayout',
  data() {
    return {
      loginSuccess: 0,
      loginFailed: 0,
    }
  },
  mounted() {
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
				this.$store.commit('deleteUser');
				this.loginSuccess = 0;
				this.loginFailed = 0;
			},
		}
})
</script>

<template>
<v-app dark>
  <v-container fill-height>
    <v-col>
      <v-row justify="center" align="center">
        <PongLogo />
      </v-row>
      <v-row justify="center" align="center" style="margin-top: 10%">
        <div v-if="!$store.state.currentUser.id">
          <v-btn x-large color="black" @click.stop="redirectToLog()"
            >42 Connect</v-btn
          >
        </div>
        <div v-else>
            <v-btn x-large color="black" @click.stop="disconnectRequest()">Disconnect</v-btn>
        </div>
      </v-row>
      <h1 v-if="loginFailed">
        <v-alert type="error" transition="scale-transition" dismissible
          >Failed to log!</v-alert
        >
      </h1>
    </v-col>
  </v-container>
</v-app>
</template>
