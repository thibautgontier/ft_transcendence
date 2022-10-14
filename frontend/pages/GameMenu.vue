<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    layout: 'DefaultLayout',
    data () {
      return {
      }
    },
    beforeCreate() {
    if (!this.$store.state.currentUser.nickname) {
      this.$router.push('/');
    }
  },
  async mounted() {
    const user = await axios.get("/user?id=" + this.$store.state.currentUser.id, {
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
            },
          });
    if (!user.data[0]) {
        this.$store.commit('deleteUser');
        this.$cookies.remove('user');
        this.$store.commit('changeLoginFinish', false);
        this.$store.commit('change2faStatus', false);
        this.$router.push('/');
        return;
    }
    this.$store.commit('changeNoBall', false)
  }
})
</script>

<template>
  <v-container fill-height>
    <v-col>
      <v-row justify="center" style="margin-top: 10%">
          <v-btn x-large color="black" router to="/PlayMenu" style="margin-right: 5%"
            ><v-icon style="margin-right: 10%">mdi-sword-cross</v-icon>PLAY</v-btn
          >
          <v-btn x-large color="black" router to="/SpectateMenu"
            ><v-icon style="margin-right: 10%">mdi-binoculars</v-icon>SPECTATE</v-btn
          >
      </v-row>
    </v-col>
    </v-container>
</template>