<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

let id = 0

export default Vue.extend({
  data:() => ({
        overlay: false,
        absolute: true,
        timerCount: 5,
  }),
  mounted() {
    this.overlay = true;
  },
  watch: {
    overlay (val) {
        val && setTimeout(() => {
            this.overlay = false
        }, 6000)
    },
    timerCount: {
        handler(value) {
            if (value > 0) {
                setTimeout(() => {
                        this.timerCount--;
                }, 1000);
            }
        },
        immediate: true
    }
  },
})
</script>

<template>
    <v-container fill-height>
        <v-overlay :absolute="absolute" :value="overlay">
            <v-row justify="center">
                <v-subheader class="text-h1 blue--text">
                    {{timerCount}}
                </v-subheader>
            </v-row>
            <v-row class="justify-space-between mt-16" align="start">
                <v-subheader class="p1 purple--text">
                    Player1
                </v-subheader>
                <v-subheader class="vs yellow--text">
                    VS
                </v-subheader>
                <v-subheader class="p2 purple--text">
                    Player2
                </v-subheader>
            </v-row>
        </v-overlay>
    </v-container>
</template>

<style>
.p1 {
    font-size: 5rem;
    margin-top: 50px;
    margin-right: 150px;
}

.p2 {
    font-size: 5rem;
    margin-top: 50px;
    margin-left: 150px;
}

.vs {
    font-size: 3rem;
    margin-top: 50px;
}

</style>