<template>
	<v-app dark>
		<PongBall v-if="!inGame" />
		<v-main>
			<v-btn @click.stop="changeActiveComponent('Login')">Login Page</v-btn>
			<v-btn @click.stop="changeActiveComponent('Main')">Main Menu</v-btn>
			<Transition name="fade" mode="out-in">
				<component :is="this.$store.state.activeComponent"></component>
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
		layout: 'default',
		data () {
			return {
				inGame: false,
				authenticated: false,
			}
		},
		computed:
			mapState(['friends']),
			activeComponent() {
				return this.$store.state.activeComponent
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