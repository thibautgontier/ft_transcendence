<script lang="ts">
import * as Colyseus from 'colyseus.js'
import Vue from 'vue'

export default Vue.extend({
  data(): any {
    return {
      client: Colyseus.Client,
    }
  },
  async mounted() {
    this.client = new Colyseus.Client('ws://localhost:3000');
    this.$store.commit('setMainRoom', (await this.client.joinOrCreate('MainRoom', this.$store.state.currentUser)));
    await this.$store.state.myMainRoom.send('Joining', this.$store.state.currentUser)
  },
	methods: {
    	loadProfile() {
      		this.$store.commit('changeHistoryId', this.$store.state.currentUser.id);
      		this.$router.push('/Profile');
    	},
	}
})
</script>

<template>
		<!-- Penser a changer la height pour avoir quelquechose de responsive -->
			<v-app-bar v-if="$store.state.loginFinish != false" app color="#121212" height="90px" class="nav">			<div class="testbuttons mx-auto">
					<v-btn router to="/">Home</v-btn>
					<v-btn router to="/GameMenu">Game</v-btn>
					<v-btn router to="/ChatMenu">Chat</v-btn>
					<v-btn @click.stop="loadProfile()">Profile</v-btn>
					<v-btn router to="/GameOption">Game Options</v-btn>
				</div>
			</v-app-bar>
</template>

<style scoped>
	.nav{
		z-index: 1;
	}
	.testbuttons {
		margin-top: 1%;
		margin-bottom: 2%;
		align-content: center;
	}
</style>