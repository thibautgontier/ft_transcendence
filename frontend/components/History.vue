<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

let id = 0

export default Vue.extend({
  data() {
    return {
      matchNumber: 0,
      matchInfosTest: null,
      matchInfos: [
        { id: id++, score: '3 / 1', date: '23/09/2022:21h00', victory: 1, ennemy: 'tgontier'},
        { id: id++, score: '0 / 3', date: '23/09/2022:20h36', victory: 0, ennemy: 'ben'},
        { id: id++, score: '3 / 2', date: '14/09/2022:14h34', victory: 1, ennemy: 'tom'},
      ]
    }
  },
  mounted() {
      axios.get("/game/2/history", {
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
              <Stats/>
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