<script>

import {mapActions, mapState, mapGetters, mapMutations} from 'vuex';
import axios from "axios";

export default {
	data() {
		return {
			isConnected: false,
			loginSuccess: 0,
		}
	},
	methods: {
		redirectToLog() {
			this.isConnected = 1;
		},
		disconnectRequest() {
			this.isConnected = 0;
		},
	}
}


</script>

<template>
	<v-container fill-height>
	<h1 v-if="1 != 0">
		<Toolbar />
	</h1>
		<v-col>
			<v-row justify="center" align="center">
				<PongLogo />
			</v-row>
			<v-row justify="center" align="center" style="margin-top: 10%">
			<h1 v-if="!isConnected">
				<v-btn x-large color="black" @click.stop="redirectToLog()">42 Connect</v-btn>
			</h1>
			<h1 v-else>
				<v-btn x-large color="black" @click.stop="disconnectRequest()">Disconnect</v-btn>
			</h1>
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
