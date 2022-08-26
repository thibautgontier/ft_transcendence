<script>
	export default {
		head: {
			titleTemplate: '%s - Main',
		},
		data () {
			return {
				
			}
		}
	}
</script>

<template>
	<div>
		<h1 v-if="this.$store.state.isLogged">
			<Toolbar />
		</h1>
		<Notification />
		<v-row justify="center" style="margin-top: 10%">
			<v-btn>Leaderboard</v-btn>
			<v-btn>Play</v-btn>
			<v-btn>Spectate</v-btn>
		</v-row>
	</div>
</template>
