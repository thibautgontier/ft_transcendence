<template>
	<v-app dark>
		<v-main>
			<PongBall />
			<v-col class="d-flex justify-center" style="margin-top: 33%;">
				<PongLogo2 />
			</v-col>
			<v-col class="d-flex justify-center mt-16">
				<v-btn x-large color="black">42 Connect</v-btn>
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