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
		<Toolbar />
		<Notification />
		<v-row justify="center" style="margin-top: 10%">
			<v-btn>Leaderboard</v-btn>
			<v-btn>Play</v-btn>
			<v-btn>Spectate</v-btn>
		</v-row>
	</div>
</template>
