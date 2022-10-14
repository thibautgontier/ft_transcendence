<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
	props: {
		victory: Number,
        date: String,
        score: String,
        ennemy: String,
        userID: Number,
    },
    data: () => ({
        level: 0,
        win: 0,
        loose: 0,
        Xp: 0,
        photo: null,
        parameters: false,
        newNickname: '',
        newAvatar: null,
        overlay: false,
        defaultEmail: true,
        email: '',
        emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        settingsSuccess: 0,
        settingsFail: 0,
        snackbarMessage: '',
    }),
    watch: {
        userID() {
            let use = this.$store.state.currentUser.id;
            if (this.userID)
                use = this.userID
            axios.get("/game/" + use, {
            headers: {
            'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
            }
            } ).then(response => {this.level = response.data.Level;
                this.Xp = Math.round((response.data.Xp / ((this.level * 50) + 100)) * 100);
                this.win = response.data.NbWin;
                this.loose = (response.data.NbParty - response.data.NbWin)});
            axios.get("/user/?id=" + use, {
            headers: {
            'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
            }
            } ).then(response => {this.photo = response.data[0].Avatar});
    }
  },
    async mounted() {
        const user = await axios.get("/user?id=" + this.$store.state.currentUser.id, {
            headers: {
            'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
            }
            });
        if (!user.data[0]) {
            this.$store.commit('deleteUser');
            this.$cookies.remove('user');
            this.$store.commit('changeLoginFinish', false);
            this.$store.commit('change2faStatus', false);
            this.$router.push('/');
            return;
        }
        if (!this.$store.state.currentUser.nickname)
          return
        let use = this.$store.state.currentUser.id;
        if (this.userID)
            use = this.userID
        axios.get("/game/" + use, {
            headers: {
            'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
            }
        } ).then(response => {
        this.level = response.data.Level;
        this.Xp = Math.round((response.data.Xp / ((this.level * 50) + 100)) * 100);
        this.win = response.data.NbWin;
        this.loose = (response.data.NbParty - response.data.NbWin);});
        axios.get("/user/?id=" + use, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
        } ).then(response => {this.photo = response.data[0].Avatar;});
    },
    methods: {
        openParameters() {
            this.parameters = !this.parameters;
        },
        async activate2fa() {
            await axios.get("/login/2fa", {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
                }
            });
            this.$store.commit('change2faStatus', true);
            this.overlay = true;
            this.defaultEmail = true;
        },
        async deactivate2fa() {
            await axios.get("/login/2fa", {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
                }
            });
            this.$store.commit('change2faStatus', false);
            this.email = '';
        },
        async confirmSetting(){
            this.settingsSuccess = 0;
            this.settingsFail = 0;
            if (this.newNickname)
            {
                this.$store.commit('changeNickname', this.newNickname);
                const res = await axios.patch("/user/updateNickname", { newNickname: this.newNickname }, {
                headers: {
                'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
                }})
                if (res.data.message === this.newNickname) {
                    this.settingsSuccess = 1;
                    this.snackbarMessage = 'Nickname successfully updated.'
                }
                else if (res.data.message === "nickname already taken") {
                    this.settingsFail = 1;
                    this.snackbarMessage = 'Nickname already taken, please choose another one.'
                }
            }
            if (this.newAvatar)
            {
                const newAvatar = 'user/avatars/' + this.newAvatar.name;
                this.$store.commit('changeAvatar', this.photo);
                const res = await axios.patch("/user/updateAvatar", {newAvatar: newAvatar}, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
                }});

                const formData = new FormData();
                formData.append('avatar', this.newAvatar, this.newAvatar.name);
                await axios.post("/user/uploadAvatar/", formData, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
                }});
                this.photo = newAvatar;
                this.parameters = false;
            }
        },
        async saveEmail() {
            if (this.email)
            {
                const res = await axios.post("/login/2faemail", {email: this.email}, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
                    }
                });
            }
            this.overlay = false;
        },
    },
})
</script>

<template>
    <h1>
        <v-row class="mt-10 px-auto">
        <v-col>
        <v-card
            elevation="1"
            class="mx-auto my-6"
            style="width: 1150px; height: 450px"
            outlined
        >
        <v-list-item three-line>
        <v-list-item-content>
            <v-row>
                <v-menu
                    v-model="parameters"
                    :close-on-content-click="false"
                    :nudge-left="345"
                    max-height="400"
                    max-width="400">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            v-bind="attrs"
                            v-on="on"
                            elevation="2"
                            icon
                            outlined
                            class="mt-16 ml-6"
                            color="secondary"
                            small>
                            <v-icon dark>
                                mdi-wrench
                            </v-icon>
                        </v-btn>
                    </template>
                        <v-card
                            elevation="2"
                            style="width: 300px; height: 175px">
                            <v-text-field
                                v-model="newNickname"
                                :counter="10"
                                label="Nickname"
                                required>
                            </v-text-field>
                            <v-file-input
                                v-model="newAvatar"
                                prepend-icon="mdi-camera"
                                accept="image/png, image/jpeg, image/bmp"
                                label="Avatar"
                            ></v-file-input>
                            <v-btn
                                elevation="2"
                                outlined
                                class="mb-5 ml-1"
                                color="secondary"
                                small
                                @click.stop="confirmSetting()">
                                <v-icon dark>
                                    Accept
                                </v-icon>
                            </v-btn>
                    </v-card>
                </v-menu>
                <v-col cols="4">
                <div class="ml-14 mt-16">
                   <v-avatar
                        color="grey lighten-2"
                        size="275">
                        <img :src="this.photo">
                    </v-avatar>
                </div>
                <v-btn v-if="$store.state.currentUser.twoFA === false" class="dfa" x-large color="black" @click.stop="activate2fa()">Activate 2FA</v-btn>
                <v-btn v-else class="dfa" x-large color="black" @click.stop="deactivate2fa()">Deactivate 2FA</v-btn>
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
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-progress-circular
                                        :value="Xp"
                                        color="teal"
                                        height="25"
                                        size="125"
                                        width="15"
                                        v-bind="attrs"
                                        v-on="on">
                                        {{level}}
                                    </v-progress-circular>
                                </template>
                                <span class="teal--text">{{Xp}}%</span>
                            </v-tooltip>
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
                            {{win}}
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
                                Lose 
                            </v-chip>
                        </v-card-title>
                        <v-card-text class="Text red--text" style="text-align:center">
                            {{loose}}
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
        <v-snackbar v-model="settingsSuccess" timeout="3000" color="green" min-height="75">
            <div class="snackText">{{ snackbarMessage }}</div>
        </v-snackbar>
        <v-snackbar v-model="settingsFail" timeout="3000" color="red" min-height="75">
            <div class="snackText">{{ snackbarMessage }}</div>
        </v-snackbar>
        </v-col>
        </v-row>
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

.snackText {
    text-align: center;
    font-size: 1.5rem;
}

</style>