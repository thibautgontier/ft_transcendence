<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data () {
		return {
			authenticated: false
		}
	},
	methods: {
		authenticate () {
			this.authenticated = !this.authenticated
		}
	}
})
</script>

<template>
	<v-container fill-height>
		<v-col>
			<v-row justify="center" align="center">
				<PongLogo />
			</v-row>
			<v-row justify="center" align="center" style="margin-top: 10%">
				<v-btn x-large color="black" @click.stop="authenticate()">42 Connect</v-btn>
			</v-row>
		</v-col>
	</v-container>
</template>