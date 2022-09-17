<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { $cookies } from 'vue/types/umd';

Vue.use(VueCookies, { expire: '7d'});
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
     redirectToLog() {
				window.location.href = "http://localhost:3000/login/42";
        while (1) {
          const cookie = this.$cookies.get('testCookie');
          if (cookie) {
            this.$store.state.currentUser.nickname = cookie;
            break;
          }
        }
        console.log('name: ', this.$store.state.currentUser.nickname);
        this.loginSuccess = 1;
        // console.log('response');
        // if (response.data) {
        //   this.$store.commit('getCurrentUser', response.data);
        //   this.loginSuccess = 1;
        //   }
        //   else {
        //     this.loginFailed = 1
        //   }
        },
		    async disconnectRequest() {
				console.log('TEST');
        const res = await axios.get("/login/logout", {
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
          }
        });
        if (res) {
          console.log('res: ', res)
          this.$store.commit('deleteUser');
          this.$cookies.remove('testCookie');
          this.loginSuccess = 0;
          this.loginFailed = 0;
        }
			},
		}
})
</script>

<template>
  <v-container fill-height>
    <h1> {{this.$store.state.currentUser.nickname}} </h1>
    <v-col>
      <v-row justify="center" align="center">
        <PongLogo />
      </v-row>
      <v-row justify="center" align="center" style="margin-top: 10%">
        <h1 v-if="!this.$store.state.currentUser.nickname">
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
      <h1 v-if="loginSuccess">
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
