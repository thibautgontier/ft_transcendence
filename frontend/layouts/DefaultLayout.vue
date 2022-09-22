<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { Store } from 'vuex'
import { compileFunction } from 'vm'

export default Vue.extend({
		data () {
			return {
				authenticated: false,
				activeComponent: "LoginPage"
			}
		},
		computed: {
			inGame () {
				if (this.activeComponent !== 'ChatMenu' && this.activeComponent !== 'GameMenu')
					return (false)
				return (true)
			}
		},
		beforeCreate() {
			this.$store.commit('initialiseStore');
		},
		methods : {
			changeComponent (comp: any) {
				this.$store.commit('changeActiveComponent', comp);
				this.$store.commit('changeTmpID', 0);
			}
		},
})
</script>

<template>
	<v-app dark>
		<PongBall v-if="!inGame" />
			<div class="testbuttons">
				<v-row justify="center">
					<!-- <v-btn @click.stop="activeComponent='LoginPage'">Login Page</v-btn> -->
					<v-btn @click.stop="changeComponent('MainMenu')">Main Menu</v-btn>
					<v-btn @click.stop="changeComponent('GameMenu')">Game Menu</v-btn>
					<v-btn @click.stop="changeComponent('ChatMenu')">Chat Menu</v-btn>
					<v-btn @click.stop="changeComponent('TestZone')">Test Zone</v-btn>
					<v-btn @click.stop="changeComponent('History')">History</v-btn>
					<v-btn @click.stop="changeComponent('GameOption')">Option</v-btn>
					<v-btn @click.stop="changeComponent('GameLoader')">GameLoader</v-btn>
				</v-row>
			</div>
			<Transition name="fade" mode="out-in">
				<component :is="this.$store.state.activeComponent" :ID='this.$store.state.tmpID'></component>
			</Transition>
	</v-app>
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