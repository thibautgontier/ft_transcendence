<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
		data () {
			return {
				authenticated: false,
				activeComponent: "LoginPage"
			}
		},
		computed: {
			inGame () {
				if (this.activeComponent !== 'ChatMenu')
					return (false)
				return (true)
			}
		},
		methods : {

		},
})
</script>

<template>
	<v-app dark>
		<PongBall v-if="!inGame" />
			<div class="testbuttons">
				<v-row justify="center">
					<v-btn @click.stop="activeComponent='LoginPage'">Login Page</v-btn>
					<v-btn @click.stop="activeComponent='MainMenu'">Main Menu</v-btn>
					<v-btn @click.stop="activeComponent='GameMenu'">Game Menu</v-btn>
					<v-btn @click.stop="activeComponent='ChatMenu'">Chat Menu</v-btn>
					<v-btn @click.stop="activeComponent='TestZone'">Test Zone</v-btn>
				</v-row>
			</div>
			<Transition name="fade" mode="out-in">
				<component :is="activeComponent"></component>
			</Transition>
	</v-app>
</template>

<style>
	body {
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