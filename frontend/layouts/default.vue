<template>
	<v-app dark>
		<v-main>
			<v-col class="d-flex justify-center">
				<PongLogo2 />
			</v-col>
			<v-col class="d-flex justify-center">
				<PongBall />
			</v-col>
		</v-main>
	</v-app>
</template>

<script>
	export default {
		components: true
	}
</script>

<style>
	body {
		overflow: hidden;
	}
</style>