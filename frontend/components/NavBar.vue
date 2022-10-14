<script lang="ts">
import Vue from 'vue'
import * as Colyseus from 'colyseus.js'
import { User } from '../types/User'

export default Vue.extend({
  data(): any {
    return {
      client: Colyseus.Client,
			active: false,
			nickname: 'toto',
			text: 'wants to play !',
			timeout: 4000,
			type: 'invite'
    }
  },
  async mounted() {
    console.log('navbar');
    this.client = new Colyseus.Client('ws://localhost:3000');
    this.$store.commit('setMainRoom', (await this.client.joinOrCreate('MainRoom', this.$store.state.currentUser)));
    await this.$store.state.myMainRoom.send('Joining', this.$store.state.currentUser)
    this.$store.state.myMainRoom.onMessage('')
  },
	methods: {
    	loadProfile() {
      		this.$store.commit('changeHistoryId', this.$store.state.currentUser.id);
      		this.$router.push('/Profile');
    	},
			acceptInvitation() {
				// METTRE LE CODE QUI S'OCCUPE DE REJOINDRE LA PONGROOM
			}
	}
})
</script>

<template>
		<!-- Penser a changer la height pour avoir quelquechose de responsive -->
			<v-app-bar app color="#121212" height="90px" class="nav">			<div class="testbuttons mx-auto">
					<v-btn router to="/">Home</v-btn>
					<v-btn router to="/GameMenu">Game</v-btn>
					<v-btn router to="/ChatMenu">Chat</v-btn>
					<v-btn @click.stop="loadProfile()">Profile</v-btn>
					<v-btn router to="/GameOption">Game Options</v-btn>
				</div>
				<div>
					<v-row
					justify="center"
					>
						<v-btn @click.stop="active = true">Send notification</v-btn>
					</v-row>
					<v-snackbar
						v-model="active"
						:timeout="timeout"
						top right
						absolute
						max-height="2%"
						elevation="5"
						transition="slide-x-reverse-transition"
						class="notification"
					>
						<strong>{{ nickname }}</strong> {{ text }}
						<div class="actions">
							<v-btn
								v-if="type === 'invite'"
								color="orange"
								small
								@click="active = false, acceptInvitation()"
							> ACCEPT </v-btn>
							<v-btn
								color="#fff"
								icon
								@click="active = false"
							> > </v-btn>
						</div>
					</v-snackbar>
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
	.notification {
		position: absolute;
		top: 1px;
		left: 0px;
		z-index: 129;
		display: flex;
	}
	.actions {
		position: absolute;
		display: inline;
		margin: auto;
		margin-left: 20%;
		top: 0%;
	}
</style>