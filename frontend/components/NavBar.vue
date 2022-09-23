<template>
		<!-- Penser a changer la height pour avoir quelquechose de responsive -->
		<v-app-bar v-if="$store.state.currentUser.id" app flat color="transparent" height="90px" class="nav">
			<div class="testbuttons mx-auto">
				<v-btn router to="/">Home</v-btn>
				<v-btn router to="/GameMenu">Game Menu</v-btn>
				<v-btn router to="/ChatMenu">Chat Menu</v-btn>
			</div>
		</v-app-bar>
</template>

<style scoped>
	.nav{
		z-index: 128;
	}
	.testbuttons {
		margin-top: 1%;
		margin-bottom: 2%;
		align-content: center;
	}
</style>