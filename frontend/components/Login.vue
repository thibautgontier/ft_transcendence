<script>
	import {mapActions, mapState, mapGetters, mapMutations} from 'vuex';
	import axios from "axios";

	export default {
		data() {
			return {
				loginSuccess: 0,
				loginFailed: 0,
				loginReturn: null
			}
		},
		head: {
			titleTemplate: '%s - Login',
		},
		methods: {
			async redirectToLog() {
				window.location.href = "http://localhost:8080/login/42"
				await axios.get("/login")
						   .then((response) => {
							   this.loginReturn = response.data;
						   });

				console.log(this.loginReturn.success);
				if (this.loginReturn.success) {
					console.log(this.loginReturn.username);
					this.$store.commit('getCurrentUserId', this.loginReturn.id);
					this.loginSuccess = 1;
				}
				else {
					this.loginFailed = 1
				}
			},

			async disconnectRequest() {
				this.$store.commit('getCurrentUserId', null);
				this.loginSuccess = 0;
				this.loginFailed = 0;
			},
		}

	}
</script>

<template>
	<v-container fill-height>
	<h1 v-if="this.$store.state.currentUserId != null">
		<Toolbar />
	</h1>
		<v-col>
			<v-row justify="center" align="center">
				<PongLogo />
			</v-row>
			<v-row justify="center" align="center" style="margin-top: 10%">
			<h1 v-if="this.$store.state.currentUserId == null">
				<v-btn x-large color="black" @click.stop="redirectToLog()">42 Connect</v-btn>
			</h1>
			<h1 v-else>
				<v-btn x-large color="black" @click.stop="disconnectRequest()">Disconnect</v-btn>
			</h1>
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
