<template>
  <v-app dark>
    <!-- <v-app-bar flat color="transparent"> </v-app-bar> -->
    <v-main>
		<!-- <Discord /> -->
        <v-col class="d-flex justify-center">
          <PongLogo size=100% />
        </v-col>
		<v-btn v-bind:color="canvas === false ? 'accent' : 'success'" v-on:click="canvas = !canvas" class="d-flex justify-center">Canvas Test</v-btn>
		<CanvasTest v-if="canvas" />
		<v-btn v-bind:color="buttons === false ? 'accent' : 'success'" v-on:click="buttons = !buttons" class="d-flex justify-center">Buttons Test</v-btn>
		<v-col v-if="buttons" class="d-flex justify-center">
			<ConnectButton ButtonType="42 Connect" />
			<ConnectButton ButtonType="Click me" />
		</v-col>
		<v-btn v-bind:color="friends === false ? 'accent' : 'success'" v-on:click="friends = !friends" class="d-flex justify-center">Friends Test</v-btn>
		<SocialMenu v-if="friends" />
		<PongBall />
    </v-main>
  </v-app>
</template>

<style scoped>
.v-application {
  background: linear-gradient(
    180deg,
    #050e13 0%,
    #113143 41.15%,
    #1c5474 81.77%
  );
}
.logo {
  position: relative;
  margin-left: 33%;
  margin-top: 20%;
  /* transform: translate(-50%, 0); */
}
</style>

<script>
	export default {
		data () { 
			return {
				canvas: false,
				buttons: false,
				friends: false,
			}
		},
		methods: {

		},
		computed: {

		}
	}
</script>