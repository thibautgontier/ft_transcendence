<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    props: {
		userID: Number,
    },
    data() {
        return {
            level: 0,
            win: 0,
            loose: 0,
            Xp: 0,
            photo: null,
        }
    },
    mounted() {
        let use = this.$store.state.currentUser.id;
        if (this.userID)
            use = this.userID
        axios.get("/game/" + use, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
    } ).then(response => {  console.log('encore', response.data.Level);
                            this.level = response.data.Level;
                            this.Xp = Math.round((response.data.Xp / ((this.level * 50) + 100)) * 100);
                          this.win = response.data.NbWin;
                          this.loose = (response.data.NbParty - response.data.NbWin);
                          console.log('pour etre sur:', response.data)});

        axios.get("/user/?id=" + use, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
        } ).then(response => {this.photo = response.data[0].Avatar; console.log(this.photo)});
  },
  watch: {
    userID() {
        let use = this.$store.state.currentUser.id;
        if (this.userID)
            use = this.userID
        axios.get("/game/" + use, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
        } ).then(response => {  console.log('encore', response.data.Level);
                            this.level = response.data.Level;
                            this.Xp = Math.round((response.data.Xp / ((this.level * 50) + 100)) * 100);
                            this.win = response.data.NbWin;
                            this.loose = (response.data.NbParty - response.data.NbWin);
                            console.log('pour etre sur:', response.data)});
        axios.get("/user/?id=" + use, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
        } ).then(response => {this.photo = response.data[0].Avatar; console.log(this.photo)});
    }
  }
})
</script>

<template>
    <h1>
        <v-card
            elevation="1"
            class="mx-auto my-6"
            style="width: 1150px; height: 450px"
            outlined
        >
        <v-list-item three-line>
        <v-list-item-content>
            <v-row>
                <div class="ml-14 mt-16">
                    <v-file-input
                        hide-input
                        truncate-length="1"
                    ></v-file-input>
                   <v-avatar
                        color="grey lighten-2"
                        size="275">
                        <img :src="this.photo">
                    </v-avatar>
                </div>
                <v-card
                    elevation="1"
                    class="mx-auto my-12"
                    outlined
                    style="width: 200px; height: 350px">
                        <v-card-title class="mx-12">
                            <v-chip color="blue"
                                    outlined
                                    large> 
                                Level
                            </v-chip>
                        </v-card-title>
                        <v-card-text class="Text purple--text my-10" style="text-align:center">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-progress-circular
                                        value=50
                                        color="teal"
                                        height="25"
                                        size="125"
                                        width="15"
                                        v-bind="attrs"
                                        v-on="on">
                                        {{level}}
                                    </v-progress-circular>
                                </template>
                                <span class="teal--text">{{Xp}}%</span>
                            </v-tooltip>
                        </v-card-text>
                </v-card>
                <v-card
                    elevation="1"
                    class="mx-auto my-12"
                    outlined
                    style="width: 200px; height: 350px">
                        <v-card-title class="mx-14">
                            <v-chip color="blue"
                                    outlined
                                    large> 
                                Win 
                            </v-chip>
                        </v-card-title>
                        <v-card-text class="Text green--text" style="text-align:center">
                            {{win}}
                        </v-card-text>
                </v-card>
                <v-card
                    elevation="1"
                    class="mx-auto my-12"
                    outlined
                    style="width: 200px; height: 350px">
                        <v-card-title class="mx-12">
                            <v-chip color="blue"
                                    outlined
                                    large> 
                                Loose 
                            </v-chip>
                        </v-card-title>
                        <v-card-text class="Text red--text" style="text-align:center">
                            {{loose}}
                        </v-card-text>
                </v-card>
            </v-row>
        </v-list-item-content>
        </v-list-item>
        </v-card>
    </h1>
</template>

<style>

.Text {
    font-size: 3.75rem;
    margin-top: 100px;
}

.v-progress-circular {
  font-size: 2rem;
}
</style>