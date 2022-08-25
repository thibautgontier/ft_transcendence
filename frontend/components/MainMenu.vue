<script>
	export default {
    data() {
        return {};
    },
    head: {
        titleTemplate: "%s - Main",
    },
    methods: {},
}
</script>

<template>
	<div>
		<Toolbar />
		<TestZone />
		<v-row justify="center" style="margin-top: 10%">
			<v-btn>Leaderboard</v-btn>
			<v-btn>Play</v-btn>
			<v-btn>Spectate</v-btn>
		</v-row>
	</div>
</template>
