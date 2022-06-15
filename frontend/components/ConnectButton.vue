<template>
	<v-btn v-on:click="log" class="button" color="secondary">{{ text }}</v-btn>
</template>

<script>
	export default {
		props: ["ButtonType"],
		data () {
			return {
				text: this.ButtonType
			}
		},
		// Prototype pour comportement qui change en fonction du message du bouton
		methods: {
			log: function () {
				if (this.ButtonType === "42 Connect")
					console.log("42 Connect");
				else
				{
					console.log("something else");
					this.text = "I changed!"
				}
			}
		}
	}
</script>