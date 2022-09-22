<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies, { expire: '7d'});
export default Vue.extend({
  data() {
    return {
      loginSuccess: 0,
      loginFailed: 0,
      overlay: false,
      loginFinish: false,
      twoFACode: '',
    }
  },
  mounted() {
    const user = this.$cookies.get('user');
    if (user && !this.$store.state.currentUser.nickname)
    {
        console.log('user: ', user);
        this.$store.commit('getCurrentUser', user);
        if (user.twoFA)
        {
          this.overlay = true;
        }
        else
        {
          this.loginFinish = true;
        }
    }
  },
  watch: {
    loginFinish() {
      if (!this.$store.state.currentUser.nickname ) {
        this.loginFailed = 1;
        this.loginSuccess = 0;
      }
      else {
        this.loginSuccess = 1;
        this.loginFailed = 0;
      }
    },
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
    async sendTwoFA() {
      const res = await axios.post("/login/validate2fa", {code: this.twoFACode}, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
      });
      this.overlay = false;
      this.loginFinish = true;
    },
	}
})
</script>

<template>
  <v-container fill-height>
    <!-- <h1> {{this.$store.state.currentUser.twoFA}} </h1> -->
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
    <v-overlay :value="overlay" opacity="0.85">
      <v-row>
        <v-col>
          <v-row justify="center" class="mb-16">
            <v-subheader class="twoFAMessage orange--text">
              Please enter 2FA code
            </v-subheader>
          </v-row>
          <v-row justify="center">
            <v-otp-input
              v-model="twoFACode"
              style="max-width: 400px"
              length="5"
              type="number"
              @finish="sendTwoFA"
            ></v-otp-input>
          </v-row>
        </v-col>
      </v-row>
    </v-overlay>
  </v-container>
</template>


<style>

.twoFAMessage {
    font-size: 4rem;
}

</style>