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
    } ).then(response => (this.friendTest = response.data));
  },
  methods: {
    loadProfile(id: any) {
      this.changeComponent = true;
      this.$store.commit('changeTmpID', id);
      this.$store.commit('changeActiveComponent', 'History');
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
        <v-list-item-avatar>
          <v-img :src="friend.Avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="friend.Nickname"></v-list-item-title>
        </v-list-item-content>
        <v-btn
          elevation="2"
          icon
          outlined
          color="secondary"
          small
          @click.stop="loadProfile(friend.id)">
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-btn>
        <v-badge v-if="friend.Status == 'online'" inline color="green"></v-badge>
        <v-badge v-if="friend.Status == 'AFK'" inline color="orange"></v-badge>
        <v-badge v-if="friend.Status == 'inGame'" inline color="blue"></v-badge>
        <v-badge v-if="friend.Status == 'doNotDistrub'" inline color="red"></v-badge>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list subheader>
      <v-subheader>Offline</v-subheader>
      <v-list-item
        v-for="friend in friendTest.filter((friend) => (friend.Status == 'offline' || friend.Status == 'invisible'))"
        :key="friend.id">
        <v-list-item-avatar>
          <v-img :src="$store.state.currentUser.Avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="friend.Nickname"></v-list-item-title>
        </v-list-item-content>
        <v-btn
          elevation="2"
          icon
          outlined
          color="secondary"
          small
          @click.stop="loadProfile(friend.id)">
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-btn>
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