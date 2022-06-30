<template>
	<v-app dark>
		<PongBall v-if="!inGame" />
		<v-main>
			<v-btn @click.stop="activeComponent='LoginPage'">Login Page</v-btn>
			<v-btn @click.stop="activeComponent='MainMenu'">Main Menu</v-btn>
			<Transition name="fade" mode="out-in">
				<component :is="activeComponent"></component>
			</Transition>
		</v-main>
	</v-app>
</template>


<script>
	export default {
		components: true,
		data () {
			return {
				inGame: false,
				authenticated: false,
				activeComponent: 'LoginPage' // modifier ca apres l'auth pour passer au main menu de l'app
			}
		}
	}
</script>

<style>
	body {
		overflow: hidden;
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.5s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

</style>