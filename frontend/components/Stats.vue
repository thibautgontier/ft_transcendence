<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		victory: Number,
        date: String,
        score: String,
        ennemy: String,
    }	
})
</script>

<template>
    <h1>
        <v-card
            elevation="1"
            class="mx-auto my-6"
            style="width: 1150px; height: 450px"
            outlined
        >
        <v-list-item three-line>
        <v-list-item-content>
            <v-row>
                <div class="ml-14 mt-16">
                   <v-avatar
                        color="grey lighten-2"
                        size="275">
                        <img :src="this.$store.state.currentUser.avatar">
                    </v-avatar>
                </div>
                <v-card
                    elevation="1"
                    class="mx-auto my-12"
                    outlined
                    style="width: 200px; height: 350px">
                        <v-card-title class="mx-12">
                            <v-chip color="blue"
                                    outlined
                                    large> 
                                Level 
                            </v-chip>
                        </v-card-title>
                        <v-card-text class="Text purple--text my-10" style="text-align:center">
                            <v-progress-circular
                                value=50
                                color="teal"
                                height="25"
                                size="125"
                                width="15">
                                50%
                            </v-progress-circular>
                        </v-card-text>
                </v-card>
                <v-card
                    elevation="1"
                    class="mx-auto my-12"
                    outlined
                    style="width: 200px; height: 350px">
                        <v-card-title class="mx-14">
                            <v-chip color="blue"
                                    outlined
                                    large> 
                                Win 
                            </v-chip>
                        </v-card-title>
                        <v-card-text class="Text green--text" style="text-align:center">
                            56
                        </v-card-text>
                </v-card>
                <v-card
                    elevation="1"
                    class="mx-auto my-12"
                    outlined
                    style="width: 200px; height: 350px">
                        <v-card-title class="mx-12">
                            <v-chip color="blue"
                                    outlined
                                    large> 
                                Loose 
                            </v-chip>
                        </v-card-title>
                        <v-card-text class="Text red--text" style="text-align:center">
                            3
                        </v-card-text>
                </v-card>
            </v-row>
        </v-list-item-content>
        </v-list-item>
        </v-card>
    </h1>
</template>

<style>

.Text {
    font-size: 3.75rem;
    margin-top: 125px;
}

.v-progress-circular {
  font-size: 2rem;
}
</style>