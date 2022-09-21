<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data: () => ({
            overlay: false,
            defaultEmail: true,
            email: '',
            emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
    }),
	props: {
		victory: Number,
        date: String,
        score: String,
        ennemy: String,
    },
    methods: {
        activate2fa() {
            this.$store.commit('change2faStatus');
            if (this.$store.state.twoFA)
                this.overlay = true;
            else
                this.email = '';
            this.defaultEmail = true;
        },
        saveEmail() {
            this.overlay = false;
        },
    },
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
            <div>{{email}}</div>
            <v-row>
                <v-col cols="4">
                <div class="ml-14 mt-16">
                   <v-avatar
                        color="grey lighten-2"
                        size="275">
                        <img :src="this.$store.state.currentUser.avatar">
                    </v-avatar>
                </div>
                <v-btn v-if="!$store.state.twoFA" class="dfa" x-large color="black" @click.stop="activate2fa()">Activate 2FA</v-btn>
                <v-btn v-if="$store.state.twoFA" class="dfa" x-large color="black" @click.stop="activate2fa()">Deactivate 2FA</v-btn>
                </v-col>
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
        <v-overlay :value="overlay">
            <v-card
                elevation="2"
                style="width: 400px; height: 200px">
                <v-card-text>
                    <v-checkbox
                        v-model="defaultEmail"
                        label="Use default 42 email"
                    ></v-checkbox>
                </v-card-text>
                <v-form ref="form">
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="Email"
                        :disabled="defaultEmail"
                    ></v-text-field>
                </v-form>
                <v-row justify="end" class="mr-4">
                    <v-btn small color="black" @click.stop="saveEmail()">ok</v-btn>
                </v-row>
            </v-card>
        </v-overlay>
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

.dfa {
    margin-left: 110px;
    margin-top: 10px;
}
</style>