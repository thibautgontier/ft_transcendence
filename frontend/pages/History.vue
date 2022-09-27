<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

let id = 0

export default Vue.extend({
  layout: 'DefaultLayout',
  props: {
		ID: Number,
  },
  data() {
    return {
      matchNumber: 0,
      matchInfosTest: null,
    }
  },
  mounted() {
      const userID = this.ID;
      let path = "/game/";
      
      if (userID)
        path += userID + "/history";
      else
        path += this.$store.state.currentUser.id + "/history"
      axios.get(path, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
    } ).then(response => (this.matchInfosTest = response.data));
  }
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