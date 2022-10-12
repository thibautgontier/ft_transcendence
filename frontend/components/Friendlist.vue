<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

let id = 0

export default Vue.extend({
  data() {
    return {
      friendTest: [],
      changeComponent: false,
      newComponent: '',
    }
  },
  mounted() {
    if (!this.$store.state.currentUser.nickname)
      return
      axios.get("/social/" + this.$store.state.currentUser.id + "/friend", {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
    } ).then(response => {(this.friendTest = response.data)});
  },
  methods: {
    loadProfile(id: any) {
      this.$store.commit('changeHistoryId', id);
      this.$router.push('/History');
    },
    deleteFriend(id: any) {
      axios.patch("/social/" + this.$store.state.currentUser.id + "/friend/remove/" + id, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
      } ).then(response => {(this.friendTest = response.data.Friends); console.log('test: ', response.data.Friends)});
    },
	}
})
</script>

<template>
  <v-card
    class="mx-auto"
    max-width="500">
    <v-toolbar
      color="deep-purple accent-4"
      dark>
      <v-toolbar-title>Friends</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-list subheader>
      <v-subheader>Online</v-subheader>
          <v-list-item
            v-for="friend in friendTest.filter((friend) => (friend.Status != 'offline' && friend.Status != 'invisible'))"
            :key="friend.id">
            <v-menu
              absolute
              offset-y
              style="max-width: 600px">
            <template v-slot:activator="{ on, attrs }">
            <v-card v-bind="attrs" v-on="on" style="width: 650px; height: 50px">
              <v-row>
                <v-list-item-avatar class="mt-4 ml-5">
                  <v-img :src="friend.Avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="friend.Nickname"></v-list-item-title>
                </v-list-item-content>
                <v-badge class="mt-6 mr-6" v-if="friend.Status == 'online'" inline color="green"></v-badge>
                <v-badge class="mt-6 mr-6" v-if="friend.Status == 'AFK'" inline color="orange"></v-badge>
                <v-badge class="mt-6 mr-6" v-if="friend.Status == 'inGame'" inline color="blue"></v-badge>
                <v-badge class="mt-6 mr-6" v-if="friend.Status == 'doNotDistrub'" inline color="red"></v-badge>
              </v-row>
            </v-card>
            </template>
            <v-list>
              <v-row>
                <v-btn
                  @click.stop="loadProfile(friend.id)"
                  elevation="2">
                  Profile
                </v-btn>
              </v-row>
              <v-row>
                <v-btn 
                  elevation="2"
                  @click.stop="deleteFriend(friend.id)">
                  Delete
                </v-btn>
              </v-row>
            </v-list>
            </v-menu>
          </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list subheader>
      <v-subheader>Offline</v-subheader>
      <v-list-item
        v-for="friend in friendTest.filter((friend) => (friend.Status == 'offline' || friend.Status == 'invisible'))"
        :key="friend.id">
        <v-menu
          absolute
          offset-y
          style="max-width: 600px">
        <template v-slot:activator="{ on, attrs }">
          <v-card v-bind="attrs" v-on="on" style="width: 650px; height: 50px">
            <v-row>
              <v-list-item-avatar>
                <v-img :src="$store.state.currentUser.Avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="friend.Nickname"></v-list-item-title>
              </v-list-item-content>
            </v-row>
          </v-card>
           </template>
            <v-list>
              <v-row>
                <v-btn
                  @click.stop="loadProfile(friend.id)" 
                  elevation="2">
                  Profile
                </v-btn>
              </v-row>
              <v-row>
                <v-btn 
                  elevation="2"
                  @click.stop="deleteFriend(friend.id)">
                  Delete
                </v-btn>
              </v-row>
            </v-list>
          </v-menu>
        </v-list-item>
    </v-list>
  </v-card>
</template>

<style>
	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.12s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
	.testbuttons {
		margin-top: 1%;
		margin-bottom: 2%;
	}
</style>