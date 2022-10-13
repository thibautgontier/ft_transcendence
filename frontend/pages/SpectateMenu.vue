<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    layout: 'DefaultLayout',
    data () {
      return {

      }
    },
    beforeCreate() {
    if (!this.$store.state.currentUser.nickname)
      this.$router.push('/');
  },
  mounted() {
    this.$store.commit('changeNoBall', false)
  }
})
</script>

<template>
  
</template>