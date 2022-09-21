<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  data() {
    return {
        ballSpeed: 50,
        paddleSpeed: 30,
        pointsToWin: 30,
        start: 0,
    }
  },
  mounted() {
  },
  methods: {
    startGame() {
      this.start = 1;
    },
    resetToDefault() {
      this.ballSpeed = 50;
      this.paddleSpeed = 30;
      this.pointsToWin = 30;
    },
  },
})
</script>

<template>
	<v-container fill-height>
        <v-row justify="center">
          <v-subheader class="text-h2 grey--text">
              Game settings
          </v-subheader>
        </v-row>
        <v-row class="mb-16">
            <v-col>
              <v-subheader class="pl-0 text-h5">
                Ball speed:
              </v-subheader>
              <v-row>
                <v-slider
                  v-model="ballSpeed"
                  min="50"
                  max="250"
                  class="mt-9"
                  color="blue"
                ></v-slider>
                <v-progress-circular
                  :value="ballSpeed"
                  color="blue"
                  size="100"
                  width="10"
                  v-bind="attrs"
                  v-on="on">
                  {{ballSpeed / 100}}
                </v-progress-circular>
              </v-row>
                <v-subheader class="pl-0 text-h5">
                Paddle speed:
                </v-subheader>
                <v-row>
                  <v-slider
                    v-model="paddleSpeed"
                    min="30"
                    max="150"
                    class="mt-9"
                    color="blue"
                  ></v-slider>
                  <v-progress-circular
                    :value="paddleSpeed"
                    color="blue"
                    size="100"
                    width="10"
                    v-bind="attrs"
                    v-on="on">
                    {{paddleSpeed / 100}}
                  </v-progress-circular>
                </v-row>
                <v-subheader class="pl-0 text-h5">
                Points to win:
                </v-subheader>
                <v-row>
                  <v-slider
                    v-model="pointsToWin"
                    min="30"
                    max="150"
                    ticks="always"
                    step="10"
                    tick-size="5"
                    class="mt-9"
                    color="blue"
                  ></v-slider>
                  <v-progress-circular
                    :value="pointsToWin"
                    color="blue"
                    size="100"
                    width="10"
                    v-bind="attrs"
                    v-on="on">
                    {{pointsToWin / 10}}
                  </v-progress-circular>
                </v-row>
                <v-row class="justify-space-between">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" class="mt-14" x-large color="secondary" @click.stop="resetToDefault()">Default</v-btn>
                    </template>
                    <span class="secondary--text">Reset option to the default value</span>
                  </v-tooltip>
                  <v-btn class="mt-14" x-large color="secondary" @click.stop="startGame()">Play</v-btn>
                </v-row>
          </v-col>
        </v-row>
	</v-container>
</template>