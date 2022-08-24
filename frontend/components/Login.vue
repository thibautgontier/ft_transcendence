<script>
	export default {
		data() {
			return {
				password: "init"
				}
		},
		head: {
			titleTemplate: '%s - Login',
		},
		methods: {
			redirectToLog() {
				window.location.href = "login-main"
			},
		}

	}
</script>

<template>
	<v-container fill-height>
		<v-col>
			<v-row justify="center" align="center">
				<PongLogo />
			</v-row>
			<v-row justify="center" align="center" style="margin-top: 10%">
			<v-btn x-large color="black" @click.stop="redirectToLog()">42 Connect</v-btn>
			</v-row>
		</v-col>
	</v-container>
</template>
