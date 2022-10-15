<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  layout: 'DefaultLayout',
  data() {
    return {
        ballSpeed: 50,
        color: '#000000',
        paddleSpeed: 30,
        pointsToWin: 30,
        start: 0,
    }
  },
  mounted() {
    this.$store.commit('changeNoBall', false)
  },
  methods: {
    startGame() {
      const gameOption = { ballSpeed: this.ballSpeed / 100, paddleSpeed: this.paddleSpeed / 100, pointsToWin: this.pointsToWin / 10, color: this.color};
      this.$store.commit('changeGameOption', gameOption);
      this.start = 1;
      this.$router.push(`/PlayMenu/?id=${this.$route.query.id}`)
    },
    resetToDefault() {
      this.ballSpeed = 50;
      this.paddleSpeed = 30;
      this.pointsToWin = 30;
    },
    changeColor(color: string) {
      this.color = color;
    }
  },
})
</script>

<template>
  <v-container fill-height>
        <v-row justify="center">
          <v-subheader class="text-h2 grey--text title">
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
                  :value="((ballSpeed - 50) / 200) * 100"
                  color="blue"
                  size="100"
                  width="10">
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
                    :value="((paddleSpeed - 30) / 120) * 100"
                    color="blue"
                    size="100"
                    width="10">
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
                    :value="((pointsToWin - 30) / 120) * 100"
                    color="blue"
                    size="100"
                    width="10">
                    {{pointsToWin / 10}}
                  </v-progress-circular>
                </v-row>
                <v-subheader class="pl-0 text-h5">
                  Background Color:
                </v-subheader>
                <v-row class="mt-5">
                  <v-btn x-large color="#000000" class="colorBtn" @click.stop="changeColor('#000000')">Black</v-btn>
                  <v-btn x-large color="#FF0000" class="colorBtn" @click.stop="changeColor('#FF0000')"></v-btn>
                  <v-btn x-large color="#FF8400" class="colorBtn" @click.stop="changeColor('#FF8400')"></v-btn>
                  <v-btn x-large color="#FFE100" class="colorBtn" @click.stop="changeColor('#FFE100')"></v-btn>
                  <v-btn x-large color="#00B315" class="colorBtn" @click.stop="changeColor('#00B315')"></v-btn>
                  <v-btn x-large color="#0067F1" class="colorBtn" @click.stop="changeColor('#0067F1')"></v-btn>
                  <v-btn x-large color="#B000FD" class="colorBtn" @click.stop="changeColor('#B000FD')"></v-btn>
                  <v-btn x-large color="#FF00A1" class="colorBtn" @click.stop="changeColor('#FF00A1')"></v-btn>
                  <v-btn height="100" width="100" fab :color="color" class="preview">Preview</v-btn>
                </v-row>
                <v-row class="justify-space-between">
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <v-btn v-bind="attrs" class="mt-14" x-large color="secondary" v-on="on" @click.stop="resetToDefault()">Default</v-btn>
                    </template>
                    <span class="secondary--text">Reset option to the default value</span>
                  </v-tooltip>
                  <v-btn class="mt-14" x-large color="secondary" @click.stop="startGame()">Play</v-btn>
                </v-row>
          </v-col>
        </v-row>
	</v-container>
</template>

<style>
  .colorBtn{
    margin-left: 12px;
    margin-right: 12px;
    margin-top: 25px;
    border: thick solid white;
  }
  .preview{
    margin-left: 133px;
  }
  .title {
  margin-top: 10%;
  }
</style>