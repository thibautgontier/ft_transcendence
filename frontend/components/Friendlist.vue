<script lang="ts">
import Vue from 'vue'

let id = 0

export default Vue.extend({
  data() {
    return {
      friends: [
        { id: id++, status: 1, name: 'tgontier'},
        { id: id++, status: 0, name: 'ben'},
        { id: id++, status: 2, name: 'tom'},
        { id: id++, status: 3, name: 'luigi'},
      ]
    }
  },
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
        v-for="friend in friends.filter((friend) => friend.status)"
        :key="friend.id">
        <v-list-item-avatar>
          <v-img :src="$store.state.currentUser.avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="friend.name"></v-list-item-title>
        </v-list-item-content>
        <v-badge v-if="friend.status == 1" inline color="green"></v-badge>
        <v-badge v-if="friend.status == 2" inline color="orange"></v-badge>
        <v-badge v-if="friend.status == 3" inline color="blue"></v-badge>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list subheader>
      <v-subheader>Offline</v-subheader>
      <v-list-item
        v-for="friend in friends.filter((friend) => !friend.status)"
        :key="friend.id">
        <v-list-item-avatar>
          <v-img :src="$store.state.currentUser.avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="friend.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style>

</style>