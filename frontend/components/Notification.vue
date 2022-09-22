<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data () {
		return {
			active: false,
			text: '',
			timeout: 4000,
			type: ''
		}
	}
})
</script>

<template>
	<div>
		<v-row
			justify="center"
		>
			<v-btn @click.stop="active = true">Send notification</v-btn>
		</v-row>
		<v-snackbar
			v-model="active"
			:timeout="timeout"
			top right
			absolute
			max-height="1%"
			transition="slide-x-reverse-transition"
		>
			<v-btn
				v-if="type != 'info'"
				color="#FA0"
				icon
				@click="active = false"
			> ACCEPT </v-btn>
			<v-btn
				color="#fff"
				icon
				@click="active = false"
			> > </v-btn>
			{{ text }}
		</v-snackbar>
	</div>
</template>