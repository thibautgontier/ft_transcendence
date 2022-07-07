<template>
	<v-app dark>
		<PongBall v-if="!inGame" />
		<v-main>
			<v-btn @click.stop="activeComponent='LoginPage'">Login Page</v-btn>
			<v-btn @click.stop="activeComponent='MainMenu'">Main Menu</v-btn>
			<!-- <v-btn @click.stop="changeActiveComponent('LoginPage')">Login Page</v-btn>
			<v-btn @click.stop="changeActiveComponent('MainMenu')">Main Menu</v-btn> -->
			<Transition name="fade" mode="out-in">
				<component :is="activeComponent"></component>
			</Transition>
			<v-btn @click.stop="getFriends()">Get Friends</v-btn>
		<ul v-for="friend in friends" :key="friend.id">
			<li>{{ friend }}</li>
		</ul>
		</v-main>
	</v-app>
</template>

<script>
	import {mapActions, mapState, mapGetters, mapMutations} from 'vuex'
	export default {
		components: true,
		data () {
			return {
				inGame: false,
				authenticated: false,
				activeComponent: "LoginPage"
			}
		},
		computed: 
			mapState(['friends']),
			activeComponent() {
				return this.store.state.activeComponent
		},
		methods:
			mapActions(['getFriends']),
			...mapMutations({
				changeActiveComponent: 'changeActiveComponent'
			})
	}
</script>

<style>
	body {
		overflow: hidden;
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.2s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

</style>