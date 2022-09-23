<template>
	<nav>
		<!-- Penser a changer la height pour avoir quelquechose de responsive -->
		<v-app-bar flat app color="transparent" height="150">
			<div class="testbuttons">
				<v-row justify="center">
					<v-btn router to="/">ft_pong</v-btn>
					<v-btn router to="/LoginPage">Login Page</v-btn>
					<v-btn router to="/MainMenu">Main Menu</v-btn>
					<v-btn router to="/GameMenu">Game Menu</v-btn>
					<v-btn router to="/ChatMenu">Chat Menu</v-btn>
					<v-btn router to="/TestZone">Test Zone</v-btn>
				</v-row>
			</div>
		</v-app-bar>
	</nav>
</template>