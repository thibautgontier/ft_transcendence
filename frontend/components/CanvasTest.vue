<template>
		<div class="canvas mx-auto" @mousemove="updateXY">{{x}}, {{y}}</div>
</template>

<script>
	export default {
		data () {
			return {
				x: 0,
				y: 0
			}
		},
		methods: {
			updateXY (event) {
				this.x = event.offsetX
				this.y = event.offsetY
			}
		}
	}
</script>

<style>
	.canvas {
		border: solid 1px;
		margin-top: 10%;
		height: 80%;
		width: 80%;
	}
</style>