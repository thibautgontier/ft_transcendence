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
      this.$axios.$get("auth/42/login");
    },
  },
});
</script>
