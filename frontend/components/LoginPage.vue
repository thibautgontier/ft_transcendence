<template>
	<div>
		<v-col class="d-flex justify-center" style="margin-top: 33%">
			<PongLogo2 />
		</v-col>
		<v-col class="d-flex justify-center mt-16">
			<v-btn x-large color="black" @click.stop="this.authenticated = !this.authenticated">42 Connect</v-btn>
		</v-col>
	</div>
</template>

