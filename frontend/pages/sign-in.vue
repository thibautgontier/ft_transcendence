<template>
  <div>
      <button  @click="signIn">sign-in</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SignInPage',
  methods: {
    async signIn() {
      await this.$axios.$get("/api/auth/42/sign-in");
    },
  },
});
</script>
