<template>
  <v-app dark>
    <v-container>
      <PrimaryButton message="42 Connect" @click.native="connect" />
    </v-container>
  </v-app>
</template>

<script>
  export default {
    methods: {
      connect() {
        this.$axios.$get("auth/42/login");
      }
    }
  }
</script>

<style scoped>
.v-application {
  background: linear-gradient(
    180deg,
    #050e13 0%,
    #113143 41.15%,
    #1c5474 81.77%
  );
}
</style>