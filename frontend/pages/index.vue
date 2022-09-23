<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies, { expire: '7d'});
export default Vue.extend({
  layout: 'DefaultLayout',
  data() {
    return {
      loginSuccess: 0,
      loginFailed: 0,
    }
  },
  mounted() {
    const user = this.$cookies.get('user');
    this.$store.commit('changeInMenu', true)
    if (user) {
      this.$store.commit('getCurrentUser', user);
      if (!this.$store.state.currentUser.nickname ) {
        this.loginFailed = 1;
        this.loginSuccess = 0;
      }
      else {
        this.loginSuccess = 1;
        this.loginFailed = 0;
      }
    }
  },
  methods: {
    redirectToLog() {
      window.location.href = "http://localhost:3000/login/42";
    },
		async disconnectRequest() {
      const res = await axios.get("/login/logout", {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
      });
      if (res) {
        this.$store.commit('deleteUser');
        this.$cookies.remove('user');
        this.loginSuccess = 0;
        this.loginFailed = 0;
      }
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
        <h1 v-if="!$store.state.currentUser.nickname">
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
        <v-snackbar type="success" transition="scale-transition" dismissible
          >Logged successfully!</v-snackbar
        >
      </h1>
      <h1 v-if="loginFailed">
        <v-snackbar type="error" transition="scale-transition" dismissible
          >Failed to log!</v-snackbar
        >
      </h1>
    </v-col>
  </v-container>
</v-app>
</template>
