<template>
<v-app>
  <v-row>
    <v-col class="text-center">
		<v-btn color="secondary">42 Connect</v-btn>
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-col>
  </v-row>
  </v-app>
</template>

<script>
export default {
	theme: {dark: true},
}
</script>

<style scoped>
.v-application {
  background: linear-gradient(180deg, #050E13 0%, #113143 41.15%, #1C5474 81.77%);
}
</style>
