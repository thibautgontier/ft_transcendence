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
      twoFACode: '',
      loginFinish2: false,
      twoFaFail: 0,
      dialog: false,
    }
  },
  mounted() {
    const user = this.$cookies.get('user');
    if (user === undefined) {
      if (this.$store.state.currentUser.nickname) this.disconnectRequest();
    }
    else if (user && !this.$store.state.currentUser.nickname)
    {
      this.$store.commit('setCurrentUser', user);
        if (user.twoFA)
        {
          this.$store.commit('change2faStatus', true);
          this.dialog = true;
        }
        else
        {
          this.$store.commit('changeLoginFinish', true);
        }
    }
    else if (this.$store.state.currentUser.nickname && user.twoFA && !this.$store.state.loginFinish) {
      this.dialog = true;
    }
    this.loginFinish2 = this.$store.state.loginFinish;
    this.$store.commit('changeNoBall', false)
  },
  watch: {
    loginFinish2() {
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
      const res = await axios.get("/login/logout");
      if (res) {
        this.$store.commit('changeLoginFinish', false);
        this.$store.commit('deleteUser');
        this.$cookies.remove('user');
        this.loginSuccess = 0;
        this.loginFailed = 0;
        this.$store.commit('change2faStatus', false);
      }
		},
    async sendTwoFA() {
      this.twoFaFail = 0;
      const res = await axios.post("/login/validate2fa", {code: this.twoFACode}, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
      });
      if (JSON.stringify(res.data) === 'true') {
        this.dialog = false;
        this.$store.commit('changeLoginFinish', true);
        this.loginFinish2 = this.$store.state.loginFinish;
      }
      else this.twoFaFail = 1;
      this.twoFACode = '';
    },
	}
})
</script>

<template>
  <v-container fill-height>
    <v-col>
      <v-row justify="center">
        <PongLogo />
      </v-row>
      <v-row justify="center" style="margin-top: 10%">
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

        <v-snackbar v-model="loginSuccess" timeout="3000" color="green" min-height="60">
            <div class="snackText">Logged successfully!</div>
        </v-snackbar>
        <v-snackbar v-model="loginFailed" timeout="3000" color="red" min-height="60">
            <div class="snackText">Login failed!</div>
        </v-snackbar>
    </v-col>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="290">
          <v-card>
            <v-card-title class="text-h5 orange--text">
              Please enter the code <br> that was sent to your email
            </v-card-title>
            <v-card-actions>
              <v-otp-input
                v-model="twoFACode"
                style="max-width: 400px"
                length="5"
                type="number"
                @finish="sendTwoFA"
              ></v-otp-input>
            </v-card-actions>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
                <v-btn
                  color="green"
                  text
                  @click="sendTwoFA">
                    Confirm
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-snackbar v-model="twoFaFail" timeout="2000" color="red" min-height="75">
            <div class="snackText">Incorrect code. Try again</div>
        </v-snackbar>
  </v-container>
</template>


<style>

.twoFAMessage {
    font-size: 4rem;
    margin-bottom: 75px;
    text-align: center;
}

.snackText {
    text-align: center;
    font-size: 1.5rem;
}

.alert {
  left: 500px;
  margin-top: 100px;
}

</style>