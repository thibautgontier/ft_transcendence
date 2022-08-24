<template>
	<div>
		<v-row
			justify="center"
		>
			<v-btn @click.stop="snackbar = true">Send notification</v-btn>
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

<script>
	export default {
		data () {
			return {
				snackbar: false,
				text: "Je suis une notification",
				timeout: 4000,
			}
		}
	}
</script>