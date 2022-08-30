<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data() {
        return {};
    },
	head(): {} {
		const title = "Transcendence - Main Menu"
		return {
			title,
		}
	},
    methods: {
		
	},
})
</script>

<template>
	<div>
		<ToolBar />
		<v-row justify="center" style="margin-top: 10%">
			<v-btn>Leaderboard</v-btn>
			<v-btn>Play</v-btn>
			<v-btn>Spectate</v-btn>
		</v-row>
	</div>
</template>