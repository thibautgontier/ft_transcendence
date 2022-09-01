<script lang="ts">
import Vue from 'vue'
import * as Colyseus from "colyseus.js";
export default Vue.extend({
	data () {
		return {
			snackbar: false,
			text: "Je suis une notification",
			timeout: 4000,
		}
	},
	head(): {} {
		const title = "Transcendence - Test Zone"
		return {
			title,
		}
	},
	methods: {
		createClient() {
			const client = new Colyseus.Client('ws://localhost:8080')
			console.log(client)
			client.joinOrCreate("testRoom", {});
		},
	}
})
</script>

<template>
	<div>
		<v-row justify="center">
			<v-btn @click.stop="snackbar = true">Send Notification</v-btn>
			<v-btn @click.stop="createClient()">Create Client</v-btn>
		</v-row>
		<v-snackbar
			v-model="snackbar"
			:timeout="timeout"
			top right
			absolute
			max-height="1%"
			transition="slide-x-reverse-transition"
		>
			<v-btn
				color="#fff"
				icon
				@click="snackbar = false"
			> > </v-btn>
			{{ text }}
		</v-snackbar>
	</div>
</template>