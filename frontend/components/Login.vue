<script>
	import {mapActions, mapState, mapGetters, mapMutations} from 'vuex'
	export default {
		data() {
			return {
				loginSuccess: 0,
				loginFailed: 0
			}
		},
		head: {
			titleTemplate: '%s - Login',
		},
		methods: {
			redirectToLog() {
				window.location.href = "http://localhost:3000/login/42"
			},
			connectTest() {
				this.$store.state.isLogged = 1
				this.loginSuccess = 1
				this.loginFailed = 0
			},
		}

	}
</script>

<template>
	<v-container fill-height>
	<h1 v-if="this.$store.state.isLogged">
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
			<h1 v-if="this.loginSuccess">
				<v-alert
					type="success"
					transition="scale-transition"
					dismissible
				>Logged successfully!</v-alert>
			</h1>
			<h1 v-if="this.loginFailed">
				<v-alert
					type="error"
					transition="scale-transition"
					dismissible
				>Failed to log!</v-alert>
			</h1>
		</v-col>
	</v-container>
</template>
