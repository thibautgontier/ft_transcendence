<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: ["buttonType"],
	data () {
		return {
			text: this.buttonType
		}
	},
	// Prototype pour comportement qui change en fonction du message du bouton
	methods: {
		log () {
			if (this.buttonType === "42 Connect")
				console.log("42 Connect");
			else
			{
				console.log("something else");
				this.text = "I changed!"
			}
		}
	}
})
</script>

<template>
	<v-btn class="button" color="secondary" @click="log">{{ text }}</v-btn>
</template>