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
      const respons = await this.$axios.$get("auth/sign-in");
      console.log(respons);
    },
  },
});
</script>
