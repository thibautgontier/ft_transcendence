<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  layout: 'DefaultLayout',
  data() {
    return {
      matchNumber: 0,
      matchInfosTest: null,
      ID: 0,
    }
  },
  beforeCreate() {
    if (!this.$store.state.currentUser.nickname)
      this.$router.push('/');
  },
  mounted() {
    if (!this.$store.state.currentUser.nickname)
        return
      this.ID = this.$store.state.historyId;
      let path = "/game/";
      
      path += this.ID + "/history";
      axios.get(path, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
    } ).then(response => (this.matchInfosTest = response.data));
    this.$store.commit('changeNoBall', false)
  },
})
</script>

<template>
        <v-row>
          <v-col>
            <div class="Stats">
              <Stats :userID='ID'/>
            </div>
            <v-divider class="mb-5"></v-divider>
            <div
              v-for="match in matchInfosTest"
              :key="match.id">
              <Match :ennemyID='match.PlayerTwoID' :WinnerID='match.WinnerID' :score='match.WinnerID' :date='match.CreatedAt'/>
            </div>
            <Friendlist/>
          </v-col>
          <v-divider vertical inset></v-divider>
        </v-row>
</template>

<style>
.Stats {
  margin-left: 15px;
}
</style>