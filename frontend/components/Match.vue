<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
	props: {
		WinnerID: Number,
        date: String,
        score: Number,
        ennemyID: Number,
    },
    data() {
        return {
            ennemy: '',
            win: 0,
        }
    },
    mounted() {
    if (!this.$store.state.currentUser.nickname)
        return
      axios.get("/user?id=" + this.ennemyID, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
    } ).then(response => (this.ennemy = response.data[0].Nickname));
  }
})
</script>

<template>
    <h1>
        <v-card
            elevation="1"
            class="mx-auto"
            style="width: 950px"
            outlined
        >
        <v-list-item three-line>
        <v-list-item-content>
            <v-row class="pl-3">
                <div class="text-overline mb-4">
                    {{date}}
                </div>
                <div class="Versus">
                    VS {{ennemy}}
                </div>
            </v-row>
            <h1 v-if="this.WinnerID === this.$store.state.currentUser.id">
                <v-list-item-title class="text-h5 mb-1 green--text">
                    Victory
                </v-list-item-title>
            </h1>
            <h1 v-else>
                <v-list-item-title class="text-h5 mb-1 red--text">
                    Defeat
                </v-list-item-title>
            </h1>
        </v-list-item-content>
        <div class="Score">
            {{score}}
        </div>
        </v-list-item>
        </v-card>
    </h1>
</template>

<style>
.Versus {
  margin-left: 450px;
  padding-top: 30px;
  color: lemonchiffon;
}

.Score {
    color: Grey;
}
</style>