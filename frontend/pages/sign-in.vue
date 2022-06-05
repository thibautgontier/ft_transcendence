<template>
  <div>
      <button  @click="signIn">sign-in</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import axios from 'axios';

export default Vue.extend({
  name: 'SignInPage',
  methods: {
    signIn() {
      // axios.get("https://api.intra.42.fr/oauth/authorize");
      // const toto = this.$axios.$get("auth/sign-in");
    },
  },
});
</script>
