<template>
	<canvas> {{x}}, {{y}}</canvas>
</template>

<script>
	export default {
		props: 
			["content", "x", "y"],
		// Prototype pour comportement qui change en fonction du message du bouton
		methods: {
			log: function () {
			}
		}
	}
</script>
