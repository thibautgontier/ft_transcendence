<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    props: {
		userID: Number,
    },
    data() {
        return {
            level: 0,
            win: 0,
            loose: 0,
            Xp: 0,
            photo: null,
            parameters: false,
            newNickname: '',
            newAvatar: null,
        }
    },
    mounted() {
        let use = this.$store.state.currentUser.id;
        if (this.userID)
            use = this.userID
        axios.get("/game/" + use, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
    } ).then(response => {  console.log('encore', response.data.Level);
                            this.level = response.data.Level;
                            this.Xp = Math.round((response.data.Xp / ((this.level * 50) + 100)) * 100);
                          this.win = response.data.NbWin;
                          this.loose = (response.data.NbParty - response.data.NbWin);
                          console.log('pour etre sur:', response.data)});

        axios.get("/user/?id=" + use, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
        }
        } ).then(response => {this.photo = response.data[0].Avatar; console.log(this.photo)});
  },
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
        } ).then(response => {this.photo = response.data[0].Avatar; console.log(this.photo)});
    }
  },
  methods:{
    openParameters() {
        this.parameters = !this.parameters;
    },
    async confirmSetting(){
        if (this.newNickname)
        {
            this.$store.commit('changeNickname', this.newNickname);
        }
        if (this.newAvatar)
        {
            console.log('aavat');
            this.$store.commit('changeAvatar', this.newAvatar);
        }
        console.log("debut");

        let payload = {
            "email": "mbaxmann42@gmail.com",
            "nickname": "this.$store.state.currentUser.nickname",
            "avatar": this.$store.state.currentUser.avatar,
            "status": "online",
            "twoFA": true,
        }
        const res = await axios.patch("/user/update/" + this.$store.state.currentUser.id, payload, {
            headers: {
            'Authorization': 'Bearer ' + this.$store.state.currentUser.accessToken,
            }
        })
        console.log("fin");
        this.parameters = false;
    }
  }
})
</script>

<template>
    <h1>
        <v-row class="mt-10">
        <v-card
            v-if="parameters"
            elevation="2"
            class="setting"
            style="width: 300px; height: 175px">
            <v-text-field
                v-model="newNickname"
                :counter="10"
                label="Nickname"
                required
          ></v-text-field>
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
        <v-card
            elevation="1"
            class="mx-auto my-6"
            style="width: 1150px; height: 450px"
            outlined
        >
        <v-list-item three-line>
        <v-list-item-content>
            <v-row>
                <v-btn
                    elevation="2"
                    icon
                    outlined
                    class="mt-16 ml-6"
                    color="secondary"
                    small
                    @click.stop="openParameters()">
                    <v-icon dark>
                        mdi-wrench
                    </v-icon>
                </v-btn>
                <div class="ml-14 mt-16">
                   <v-avatar
                        color="grey lighten-2"
                        size="275">
                        <img :src="this.photo">
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
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-progress-circular
                                        value=50
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
                                Loose 
                            </v-chip>
                        </v-card-title>
                        <v-card-text class="Text red--text" style="text-align:center">
                            {{loose}}
                        </v-card-text>
                </v-card>
            </v-row>
        </v-list-item-content>
        </v-list-item>
        </v-card>
        </v-row>
    </h1>
</template>

<style>

.Text {
    font-size: 3.75rem;
    margin-top: 100px;
}

.v-progress-circular {
  font-size: 2rem;
}

.setting {
    left: 180px;
    top: 25px;
}

</style>