<script lang="ts">
import Vue from 'vue'
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
			<PongBall />
			<NavBar />
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