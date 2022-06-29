<template>
	<v-app dark>
		<PongBall v-show="!inGame"/>
			<v-main>
				<Transition name="login">
					<div v-if="!authenticated">
						<v-col class="d-flex justify-center" style="margin-top: 33%">
							<PongLogo2 />
						</v-col>
						<v-col class="d-flex justify-center mt-16">
							<v-btn x-large color="black" @click.stop="authenticated = !authenticated">42 Connect</v-btn>
						</v-col>
					</div>
				</Transition>
				<!-- <div v-else>
					<Transition name="Menu">
						Hello !
					</Transition>
				</div> -->
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
			}
		}
	}
</script>

<style>
	body {
		overflow: hidden;
	}
	.login-enter-active,
	.login-leave-active {
		transition: opacity 1s ease;
	}

	.login-enter-from,
	.login-leave-to {
		opacity: 0;
	}
</style>