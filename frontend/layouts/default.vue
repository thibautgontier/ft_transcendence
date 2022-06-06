<template>
  <v-app dark>
    <!-- <v-app-bar flat color="transparent"> </v-app-bar> -->
    <v-main>
      <v-flex class="flex-direction:column">
        <v-col class="d-flex justify-center">
          <PongLogo />
          <ConnectButton message="42 Connect" d-inline-blo />
        </v-col>
        <!-- <v-col class="d-flex justify-center"> -->
        <!-- </v-col> -->
      </v-flex>
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