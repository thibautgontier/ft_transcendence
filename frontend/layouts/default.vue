<template>
  <v-app dark>
    <!-- <v-app-bar flat color="transparent"> </v-app-bar> -->
    <v-main>
        <v-col class="d-flex justify-center">
          <PongLogo size=100% />
        </v-col>
			<CanvasTest />
        <v-col class="d-flex justify-center" style="margin-top:40%">
			<ConnectButton ButtonType="42 Connect" />
			<ConnectButton ButtonType="Something else" />
		</v-col>
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