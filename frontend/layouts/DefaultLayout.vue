<script lang="ts">
import Vue from 'vue'
import { Store } from 'vuex'

export default Vue.extend({
		data () {
		return {
		}
		},
		beforeCreate() {
			this.$store.commit('initialiseStore');
		},
		methods : {
		},
})
</script>

<template>
	<div>
		<v-app dark>
			<PongBall v-if="!inGame" />
			<div class="testbuttons">
				<v-row justify="center">
					<!-- <v-btn @click.stop="activeComponent='LoginPage'">Login Page</v-btn> -->
					<v-btn @click.stop="activeComponent='MainMenu'">Main Menu</v-btn>
					<v-btn @click.stop="activeComponent='GameMenu'">Game Menu</v-btn>
					<v-btn @click.stop="activeComponent='ChatMenu'">Chat Menu</v-btn>
					<v-btn @click.stop="activeComponent='TestZone'">Test Zone</v-btn>
					<v-btn @click.stop="activeComponent='History'">History</v-btn>
				</v-row>
			</div>
			<Transition name="fade" mode="out-in">
				<nuxt-child />
			</Transition>
		</v-app>
	</div>
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
</style>