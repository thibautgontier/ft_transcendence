<script>
	export default {
		data() {
			return {
				password: "init",
				isConnected: 0
				}
		},
		head: {
			titleTemplate: '%s - Login',
		},
		methods: {
			redirectToLog() {
				window.location.href = "http://localhost:3000/login-main"
			},
			connectTest() {
				this.isConnected = 1
			},
		}

	}
</script>

<template>
	<v-container fill-height>
	<h1 v-if="isConnected">
	<Toolbar />
	</h1>
		<v-col>
			<v-row justify="center" align="center">
				<PongLogo />
			</v-row>
			<v-row justify="center" align="center" style="margin-top: 10%">
			<v-btn x-large color="black" @click.stop="redirectToLog()">42 Connect</v-btn>
			<v-btn x-large color="black" @click.stop="connectTest()">TEST</v-btn>
			</v-row>
			<h1 v-if="isConnected">
				<v-alert
					type="success"
					transition="scale-transition"
					dismissible
				>Logged successfully!</v-alert>
			</h1>
		</v-col>
	</v-container>
</template>
