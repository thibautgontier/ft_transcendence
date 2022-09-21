<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import * as Colyseus from 'colyseus.js'
import {
  ourRoom,
  Message,
  chanStatus,
  ChatRoomMessage,
} from '../types/room'

export default Vue.extend({
  data(): any {
    return {
      newChannel: { name: '', protected: false, password: '' },
      editChannel: { name: '', protected: false, password: '' },
      activeChannel: ourRoom,
      admin: true,
      leaveChannelDialog: false,
      createChannelDialog: false,
      editChannelDialog: false,
      inChannel: false,
      client: Colyseus.Client,
      dialogRoom: ourRoom,
      myMessage: '',
      receivedMessage: '',
      rooms: [] as ourRoom[],
      inputRules: [
        (value: string) =>
          (value && value.length >= 3 && value.length <= 12) ||
          'between 3 and 12 characters',
      ],
      showPassword: false,
    }
  },
  head(): {} {
    const title = 'Transcendence - Chat'
    return {
      title,
    }
  },
  watch: {
    createChannelDialog(newValue) {
      if (!newValue) {
        this.newChannel.name = ''
        this.newChannel.password = ''
        this.newChannel.protected = false
        this.showPassword = false
      }
    },
    editChannelDialog(newValue) {
      if (!newValue) {
        this.editChannel.name = ''
        this.editChannel.password = ''
        this.editChannel.protected = false
        this.showPassword = false
      }
    },
    channelChange(newValue) {
      if (!newValue) {
        this.editChannel.name = ''
        this.editChannel.password = ''
        this.editChannel.protected = false
        this.showPassword = false
      }
    },
  },
  async mounted() {
    await this.createClient()
    await this.getChannel()
  },
  destroyed() {
    for (const room of this.rooms as ourRoom[]) {
      room.channel.leave()
    }
  },
  methods: {
    leaveChannelPending(current: ourRoom): void {
      this.leaveChannelDialog = !this.leaveChannelDialog
      this.dialogRoom = current
    },
    editChannelPending(current: ourRoom): void {
      this.editChannelDialog = !this.editChannelDialog
      this.dialogRoom = current
    },
    async leaveChannelConfirmed() {
      this.leaveChannelDialog = false
      this.dialogRoom.channel.leave()
      const index = this.rooms.indexOf(this.dialogRoom)
      this.rooms.splice(index, 1)
      this.activeChannel = this.rooms[0]
      await axios.patch(
        `/channel/${this.dialogRoom.id}/removeUser/${this.$store.state.currentUser.id}`
      )
      if (this.rooms.length === 0) this.inChannel = false
    },
    async newChannelConfirmed() {
      if (
        this.newChannel.name.length < 3 ||
        this.newChannel.name.length > 12 ||
        (this.newChannel.protected === true &&
          (this.newChannel.password.length < 3 ||
            this.newChannel.password.length > 12))
      )
        return
      const newRoom = new ourRoom()
      try {
        newRoom.channel = await this.client.create('ChatRoom')
        const response = await axios.post('/channel/create', {
          owner: `${this.$store.state.currentUser.id}`,
          Name: this.newChannel.name,
          RoomId: newRoom.channel.id,
        })
        newRoom.channelName = this.newChannel.name
        newRoom.id = response.data.id
        this.rooms.push(newRoom)
        this.inChannel = true
        this.newChannel.name = ''
        this.createChannelDialog = false
        newRoom.channel.onMessage('Message', (message: ChatRoomMessage) => {
          // listening message from socket
          const newMsg = new Message()
          newMsg.Content = message.Content
          newMsg.Nickname = message.Nickname
          newRoom.messages.push(newMsg)
        })
        this.activeChannel = newRoom
      } catch (e) {
        console.error('join error', e)
      }
    },
    async editChannelConfirmed() {
      if (
        this.editChannel.name.length < 3 ||
        this.editChannel.name.length > 12 ||
        (this.editChannel.protected === true &&
          (this.editChannel.password.length < 3 ||
            this.editChannel.password.length > 12))
      )
        return
      if (this.editChannel.name !== '') {
        // changement de nom
        const response = await axios.patch(
          `/channel/update/${this.dialogRoom.id}/${this.$store.state.currentUser.id}`,
          { name: this.editChannel.name }
        )
      }
      if (this.dialogRoom.Type === chanStatus.PUBLIC) {
        if (this.editChannel.protected === true) {
          // channel public devient protected
          const response = await axios.patch(
            `/channel/${this.dialogRoom.id}/switchToPrivate/${this.$store.state.currentUser.id}`,
            { Password: this.editChannel.password }
          )
        }
      } // if channel is protected by a pw
      else {
        if (this.editChannel.protected === false) {
          // channel protected devient public
          const response = await axios.patch(
            `/channel/${this.dialogRoom.id}/switchToPublic/${this.$store.state.currentUser.id}`
          )
        } else if (this.editChannel.protected === true) {
          // changement du mdp
          const response = await axios.patch(
            `/channel/update/${this.dialogRoom.id}/${this.$store.state.currentUser.id}`,
            { Password: this.editChannel.password }
          )
        }
      }
      this.editChannelDialog = false
    },
    onlineStatus(online: boolean) {
      if (online === true) return '🟢'
      return '🔴'
    },
    async createClient() {
      try {
        this.client = await new Colyseus.Client('ws://localhost:3000')
      } catch (e) {
        console.error('Create Client ERROR', e)
      }
    },
    sendMessage(): void {
      if (this.myMessage === '') return
      this.activeChannel.channel.send(
        'Message',
        this.$store.state.currentUser.nickname + '@:' + this.myMessage
      )
      axios.post(
        `channel/${this.activeChannel.id}/sendMessage/${this.$store.state.currentUser.id}`,
        { Content: this.myMessage }
      )
      this.myMessage = ''
    },
    async getChannel() {
      const response = await axios.get(
        `/user/channel/${this.$store.state.currentUser.id}`
      )
      for (const channel of response.data.ChannelUser) {
        const room = new ourRoom()
        try {
          room.channel = await this.client.joinById(channel.RoomId)
        } catch (e) {
          room.channel = await this.client.create('ChatRoom')
          await axios.patch(
            `/channel/update/${channel.id}/${this.$store.state.currentUser.id}`,
            { RoomId: room.channel.id }
          )
        }
        room.channelName = channel.Name
        room.id = channel.id
        room.messages = channel.Messages
        room.messages.forEach((num1, index) => {
          num1.Nickname = channel.Messages[index].User.Nickname
        })
          room.members = channel.Users;
          this.rooms.push(room)
          room.channel.onMessage('Message', (message: ChatRoomMessage) => {
          const newMsg = new Message()
          newMsg.Content = message.Content
          newMsg.Nickname = message.Nickname
          room.messages.push(newMsg)
        })
      }
      if (this.rooms.length > 0) {
        this.activeChannel = this.rooms[0]
        this.inChannel = true
      }
    },
    openPrivateChat() {},
    inviteToPlay() {},
    async sendFriendRequest(friend: any) {
      const response = await axios.patch(
        `/socialProfile/${this.$store.state.currentUser.id}/friend/add/${friend.id}`
      )
    },
    async switchBlock(member: any) {
      if (this.blocked === false) {
        const response = await axios.patch(
          `/socialProfile/${this.$store.state.currentUser.id}/blocked/add/${member.id}`
        )
      } else {
        const response = await axios.patch(
          `/socialProfile/${this.$store.state.currentUser.id}/blocked/remove/${member.id}`
        )
      }
    },
    switchAdmin(member: any) {
    },
    async banFromChannel(member: any) {
      const response = await axios.patch(
        `/channel/${this.activeChannel.id}/banUser/${this.$store.state.currentUser.id}/${member.id}}`
      )
    },
  },
})
</script>

<template>
  <div>
    <!-- EXIT ARROW -->
    <!-- CONVERSATIONS -->
    <v-navigation-drawer
      clipped
      app
      :permanent="!$vuetify.breakpoint.smAndDown"
      :expand-on-hover="$vuetify.breakpoint.smAndDown"
    >
      <template #prepend>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Conversations</v-list-item-title>
          </v-list-item-content>
          <v-btn text color="white" @click.stop="createChannelDialog = true"
            >New</v-btn
          >
        </v-list-item>
      </template>
      <v-divider></v-divider>

      <v-list dense>
        <v-list-item-group>
          <v-list-item
            v-for="(room, index) in rooms"
            :key="index"
            @click.stop="activeChannel = room"
          >
            <v-list-item-content>
              <v-list-item-title>{{ room.channelName }}</v-list-item-title>
            </v-list-item-content>
            <v-btn
              v-if="admin"
              fab
              x-small
              text
              @click.stop="editChannelPending(room)"
              ><v-icon>mdi-cog</v-icon></v-btn
            >
            <v-btn text fab x-small @click.stop="leaveChannelPending(room)"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <!-- MEMBERS -->
    <v-navigation-drawer
      v-if="activeChannel"
      clipped
      right
      app
      :permanent="!$vuetify.breakpoint.smAndDown"
      :expand-on-hover="$vuetify.breakpoint.smAndDown"
    >
      <template #prepend>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Members</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item
          v-for="(member, index) in activeChannel.members"
          :key="index"
        >
          <v-menu
            v-model="member.menu"
            :close-on-content-click="false"
            left
            offset-x
            transition="slide-x-reverse-transition"
          >
            <template #activator="{ on, attrs }">
              <v-btn class="wide" text color="white" v-bind="attrs" v-on="on">
                <v-avatar size="32"><img :src="member.Avatar"></v-avatar>
                <v-list-item-content class="ml-2">
                  <v-list-item-title>{{ member.Nickname }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title>{{onlineStatus(member.Status)}}</v-list-item-title>
                  <v-list-item-subtitle>{{ member.Status }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-btn>
            </template>

            <!-- MEMBER CARD MENU -->
            <v-card>
              <v-list>
                <v-list-item>
                    <v-avatar size="64"><img :src="member.Avatar"></v-avatar>
                <v-list-item-content class="ml-2">
                  <v-list-item-title>{{onlineStatus(member.Status)}}</v-list-item-title>
                  <v-list-item-subtitle>{{ member.Status }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title>{{ member.Nickname }}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-item>
                  <v-btn @click.stop="openPrivateChat(member)"
                    >Private chat</v-btn
                  >
                </v-list-item>
                <v-list-item>
                  <v-btn @click.stop="inviteToPlay(member)"
                    >Invite to a match</v-btn
                  >
                </v-list-item>
                <v-list-item>
                  <v-btn @click.stop="sendFriendRequest(member)"
                    >Send friend request</v-btn
                  >
                </v-list-item>
                <v-list-item
                  v-if="
                    admin && member.name != $store.state.currentUser.nickname
                  "
                >
                  <v-btn @click.stop="banFromChannel(member)"
                    >Remove from channel</v-btn
                  >
                </v-list-item>
                <v-list-item
                  v-if="member.name !== $store.state.currentUser.nickname"
                >
                  <v-list-item-title>Blocked</v-list-item-title>
                  <v-checkbox
                    v-model="member.blockSwitch"
                    dense
                    @change="switchBlock(member)"
                  ></v-checkbox>
                </v-list-item>
                <v-list-item v-if="admin">
                  <v-list-item-title>Admin</v-list-item-title>
                  <v-checkbox
                    v-model="member.adminSwitch"
                    dense
                    @change="switchAdmin(member)"
                  ></v-checkbox>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- TOOLBAR -->
    <!-- CHANNEL -->
    <v-main>
      <!-- CHANNEL LEAVE DIALOG -->
      <v-dialog v-model="leaveChannelDialog" max-width="400px">
        <v-card>
          <v-card-text class="text-center">
            <div class="white--text dialogTitle">
              Do you really want to leave this channel ?
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text color="grey" @click="leaveChannelDialog = false">
              CANCEL
            </v-btn>
            <v-btn text color="red" @click="leaveChannelConfirmed()">
              LEAVE
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- CHANNEL CREATION DIALOG -->
      <v-dialog v-model="createChannelDialog" max-width="400px">
        <v-card>
          <v-card-text class="text-center">
            <div class="white--text dialogTitle">NEW CHANNEL CREATION</div>
          </v-card-text>
          <v-card-text class="text-center">
            <div class="white--text dialogTitle">Channel name :</div>
          </v-card-text>
          <v-text-field
            v-model="newChannel.name"
            dense
            hide-details
            solo
            required
            type="text"
            placeholder="must be between 3 and 12 characters"
            clearable
            clear-icon="mdi-close-circle"
            :rules="inputRules"
            @keydown.enter.prevent="newChannelConfirmed()"
          ></v-text-field>
          <v-list-item>
            <v-list-item-title>Protected channel</v-list-item-title>
            <v-checkbox v-model="newChannel.protected"></v-checkbox>
          </v-list-item>
          <v-card-text v-if="newChannel.protected" class="text-center">
            <div class="white--text dialogTitle">Password :</div>
          </v-card-text>
          <v-text-field
            v-if="newChannel.protected"
            v-model="newChannel.password"
            dense
            hide-details
            solo
            placeholder="must be between 3 and 12 characters"
            clear-icon="mdi-close-circle"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="!showPassword ? 'password' : 'text'"
            :rules="inputRules"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text color="grey" @click="createChannelDialog = false">
              CANCEL
            </v-btn>
            <v-btn text color="red" @click="newChannelConfirmed()">
              CREATE
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- CHANNEL CONTROL PANEL DIALOG -->
      <v-dialog v-model="editChannelDialog" max-width="400px">
        <v-card>
          <v-card-text class="text-center">
            <div class="white--text dialogTitle">CHANNEL CONTROL PANEL</div>
          </v-card-text>
          <v-card-text class="text-center">
            <div class="white--text dialogTitle">Channel name :</div>
          </v-card-text>
          <v-text-field
            v-model="editChannel.name"
            dense
            hide-details
            solo
            required
            type="text"
            placeholder="must be between 3 and 12 characters"
            clearable
            clear-icon="mdi-close-circle"
            :rules="inputRules"
            @keydown.enter.prevent="editChannelConfirmed()"
          ></v-text-field>
          <v-list-item>
            <v-list-item-title>Protected channel</v-list-item-title>
            <v-checkbox v-model="editChannel.protected"></v-checkbox>
          </v-list-item>
          <v-card-text v-if="editChannel.protected" class="text-center">
            <div class="white--text dialogTitle">Password :</div>
          </v-card-text>
          <v-text-field
            v-if="editChannel.protected"
            v-model="editChannel.password"
            dense
            hide-details
            solo
            placeholder="must be between 3 and 12 characters"
            clear-icon="mdi-close-circle"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="!showPassword ? 'password' : 'text'"
            :rules="inputRules"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="grey" @click="editChannelDialog = false">
              CANCEL
            </v-btn>
            <v-btn text color="green" @click="editChannelConfirmed()">
              SAVE AND QUIT
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- CHANNEL MESSAGES -->
      <v-container v-if="inChannel">
        <v-list-item-content>
          <v-list-item-title>{{ activeChannel.channelName }}</v-list-item-title>
        </v-list-item-content>
        <v-divider></v-divider>
        <v-list-item
          v-for="(message, index) in activeChannel.messages"
          :key="index"
          refs="messagesContainer"
          two-line
          app
        >
          <v-list-item-content>
            <v-list-item-title>{{ message.Nickname }}</v-list-item-title>
            <v-list-item-subtitle>> {{ message.Content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-container>
    </v-main>
    <!-- INPUT ZONE -->
    <v-footer v-if="inChannel" app inset>
      <v-text-field
        v-if="inChannel"
        v-model="myMessage"
        dense
        hide-details
        solo
        type="text"
        placeholder="Type here"
        clearable
        clear-icon="mdi-close-circle"
        clear-icon-color="black"
        @keydown.enter.prevent="sendMessage()"
      ></v-text-field>
    </v-footer>
  </div>
</template>

<style>
.wide {
  width: 100%;
}
.dialogTitle {
  padding-top: 10%;
  font-size: 1rem;
}
</style>
