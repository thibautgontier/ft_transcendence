<script lang="ts">
import Vue from 'vue'
import Login from '../components/Login.vue'
import Main from '../components/Main.vue'
import ChatMenu from '../components/ChatMenu.vue'

export default Vue.extend({
		components: {
			Login,
			Main,
			ChatMenu,
		},
		data () {
			return {
				inGame: false,
				authenticated: false,
				activeComponent: "Login"
			}
		},
		// computed: 
		// 	mapState(['friends']),
		// 	activeComponent() {
		// 		console.log(this.store.state.activeComponent)
		// 		return this.store.state.activeComponent
		// },
		// methods:
		// 	mapActions(['getFriends']),
		// 	...mapMutations({
		// 		changeActiveComponent: 'changeActiveComponent'
		// 	})
})
</script>

<template>
	<v-app dark>
		<PongBall v-if="!inGame" />
		<v-main>
			<div class="testbuttons">
				<v-row justify="center">
					<v-btn @click.stop="activeComponent='Login'">Login Page</v-btn>
					<v-btn @click.stop="activeComponent='Main'">Main Menu</v-btn>
					<v-btn @click.stop="activeComponent='ChatMenu'">Chat Menu</v-btn>
				</v-row>
			</div>
			<!-- <v-btn @click.stop="changeActiveComponent('LoginPage')">Login Page</v-btn> -->
			<!-- <v-btn @click.stop="changeActiveComponent('MainMenu')">Main Menu</v-btn> -->
			<Transition name="fade" mode="out-in">
				<component :is="activeComponent"></component>
			</Transition>
			<!-- <v-btn @click.stop="getFriends()">Get Friends</v-btn> -->
		<!-- <ul v-for="friend in friends" :key="friend.id"> -->
			<!-- <li>{{ friend }}</li> -->
		<!-- </ul> -->
		</v-main>
	</v-app>
</template>

<style>
	body {
		overflow: hidden;
	}

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