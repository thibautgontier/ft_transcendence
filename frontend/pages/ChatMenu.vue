<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import * as Colyseus from 'colyseus.js'
import {
  OurRoom,
  Message,
  chanStatus,
  ChatRoomMessage,
  Channel,
} from '../types/room'

export default Vue.extend({
  layout: 'DefaultLayout',
  data(): any {
    return {
      newChannel: { name: '', protected: false, password: '' },
      editChannel: { name: '', protected: false, password: '' },
      snackbar: { active: false, errorMessage: '' },
      activeChannel: OurRoom,
      admin: true,
      addChannelDialog: false,
      createChannelDialog: false,
      editChannelDialog: false,
      leaveChannelDialog: false,
      channelPasswordDialog: false,
      inChannel: false,
      client: Colyseus.Client,
      dialogRoom: OurRoom,
      myMessage: '',
      receivedMessage: '',
      rooms: [] as OurRoom[],
      availableChannels: [] as Channel[],
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
    snackbar(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.snackbar.active = false
        this.snackbar.errorMessage = ''
      }
    },
    createChannelDialog(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.newChannel.name = ''
        this.newChannel.password = ''
        this.newChannel.protected = false
        this.showPassword = false
      }
    },
    editChannelDialog(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.editChannel.name = this.dialogRoom.channelName
        this.editChannel.password = ''
        this.editChannel.protected = false
        this.showPassword = false
      }
    },
    channelChange(newValue, oldValue) {
      if (newValue !== oldValue) {
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
  destroyed() {},
  methods: {
    leaveChannelPending(current: OurRoom): void {
      this.leaveChannelDialog = !this.leaveChannelDialog
      this.dialogRoom = current
    },
    async addChannelPending() {
      this.addChannelDialog = !this.addChannelDialog
      const response = await axios.get(
        `/user/otherChannel/${this.$store.state.currentUser.id}`
      )
      this.availableChannels = response.data
      console.log(this.availableChannels)
    },
    async joinChannel(channel: any) {
      try {
        if (channel.Type === chanStatus.PROTECTED && channel.inputPassword) {
          const response = await axios.patch(`/channel/addUser/${channel.id}`, {
            user_id: this.$store.state.currentUser.id,
            password: channel.inputPassword,
          })
        } else {
          const response = await axios.patch(`/channel/addUser/${channel.id}`, {
            user_id: this.$store.state.currentUser.id,
          })
        }
      } catch (e) {
        console.warn('cannot join chan', e)
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot join channel'
        return
      }
      const room = new OurRoom()
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
      const response = await axios.get(`channel/${channel.id}`)
      room.members = response.data.Users
      this.rooms.push(room)
      room.channel.onMessage('Message', (message: ChatRoomMessage) => {
        const newMsg = new Message()
        newMsg.Content = message.Content
        newMsg.Nickname = message.Nickname
        room.messages.push(newMsg)
      })
      this.addChannelDialog = false
      if (this.rooms.length > 0) {
        this.activeChannel = this.rooms[0]
        this.inChannel = true
      }
    },
    editChannelPending(current: OurRoom): void {
      this.editChannelDialog = !this.editChannelDialog
      this.dialogRoom = current
    },
    async leaveChannelConfirmed() {
      this.leaveChannelDialog = false
      this.dialogRoom.channel.leave()
      const index = this.rooms.indexOf(this.dialogRoom)
      this.rooms.splice(index, 1)
      this.activeChannel = this.rooms[0]
      if (this.rooms.length === 0) this.inChannel = false
      await axios.patch(
        `/channel/${this.dialogRoom.id}/removeUser/${this.$store.state.currentUser.id}`
      )
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
      const newRoom = new OurRoom()
      try {
        newRoom.channel = await this.client.create('ChatRoom')
        const response = await axios.post('/channel/create', {
          owner: `${this.$store.state.currentUser.id}`,
          Name: this.newChannel.name,
          RoomId: newRoom.channel.id,
        })
        newRoom.channelName = this.newChannel.name
        newRoom.id = response.data.id
		newRoom.members = response.data.Users
        this.rooms.push(newRoom)
        this.inChannel = true
        this.newChannel.name = ''
        this.createChannelDialog = false
        if (this.newChannel.protected === true) {
          await axios.patch(
            `/channel/${newRoom.id}/switchToPrivate/${this.$store.state.currentUser.id}`,
            { Password: this.newChannel.password }
          )
        }
        newRoom.channel.onMessage('Message', (message: ChatRoomMessage) => {
          const newMsg = new Message()
          newMsg.Content = message.Content
          newMsg.Nickname = message.Nickname
          newRoom.messages.push(newMsg)
        })
        this.activeChannel = newRoom
      } catch (e) {
        console.error('create error', e)
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot create channel'
      }
    },
    async editChannelConfirmed() {
      if (!this.editChannel.name) {
        this.snackbar.active = true
        this.snackbar.errorMessage = 'At least a name is necessary'
        return
      }
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
        await axios.patch(
          `/channel/update/${this.dialogRoom.id}/${this.$store.state.currentUser.id}`,
          { name: this.editChannel.name }
        )
      }
      if (this.dialogRoom.Type === chanStatus.PUBLIC) {
        if (this.editChannel.protected === true) {
          // channel public devient protected
          await axios.patch(
            `/channel/${this.dialogRoom.id}/switchToPrivate/${this.$store.state.currentUser.id}`,
            { Password: this.editChannel.password }
          )
        }
      } // if channel is protected by a pw
      else if (this.editChannel.protected === false) {
        // channel protected devient public
        await axios.patch(
          `/channel/${this.dialogRoom.id}/switchToPublic/${this.$store.state.currentUser.id}`
        )
      } else if (this.editChannel.protected === true) {
        // changement du mdp
        await axios.patch(
          `/channel/update/${this.dialogRoom.id}/${this.$store.state.currentUser.id}`,
          { Password: this.editChannel.password }
        )
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
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot create client'
      }
    },
    async sendMessage() {
      if (this.myMessage === '') return
      try {
        const response = await axios.post(
          `channel/${this.activeChannel.id}/sendMessage/${this.$store.state.currentUser.id}`,
          { Content: this.myMessage }
        )
      } catch (e) {
        console.warn('you are ban or muted:\n', e)
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot send message'
        return
      }
      this.activeChannel.channel.send(
        'Message',
        this.$store.state.currentUser.nickname + '@:' + this.myMessage
      )
      this.myMessage = ''
    },
    async getChannel() {
      const response = await axios.get(
        `/user/channel/${this.$store.state.currentUser.id}`
      )
      for (const channel of response.data.ChannelUser) {
        const room = new OurRoom()
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
        room.members = channel.Users
        this.rooms.push(room)
        room.channel.onMessage('Message', (message: ChatRoomMessage) => {
          const newMsg = new Message()
          newMsg.Content = message.Content
          newMsg.Nickname = message.Nickname
          room.messages.push(newMsg)
        })
        this.addChannelDialog = false
        channel.active = false
      }
      if (this.rooms.length > 0) {
        this.activeChannel = this.rooms[0]
        this.inChannel = true
      }
    },
    async openPrivateChat(member: any) {
      const response = await axios.get(`channel/isPrivateCreated/${member.id}/${this.$store.state.currentUser.id}`)
      if (response.data) {
        this.activeChannel = this.rooms.find((channel: OurRoom) => channel.id == response.data.id)
        this.inChannel = true;
        return
      }
      else {
        const newRoom = new OurRoom()
        try{
          newRoom.channel = await this.client.create('ChatRoom')
          const response2 = await axios.post('channel/createPriv', {
            user_1 : this.$store.state.currentUser.id,
            user_2 : member.id,
            Name : ( this.$store.state.currentUser.nickname + member.Nickname),
            RoomId: newRoom.channel.id,
          })
          newRoom.channelName = ( this.$store.state.currentUser.nickname + member.Nickname );
          newRoom.id = response2.data.id
          newRoom.members = response2.data.Users
          this.rooms.push(newRoom);
          this.inChannel = true;
          this.activeChannel = newRoom
          newRoom.channel.onMessage('Message', (message: ChatRoomMessage) => {
          const newMsg = new Message()
          newMsg.Content = message.Content
          newMsg.Nickname = message.Nickname
          newRoom.messages.push(newMsg)
        })
        } catch(e) {
          console.warn('Cannot create private channel', e);
          return;
        }
      }
    },
    inviteToPlay(member: any) {},
    async sendFriendRequest(friend: any) {
      await axios.patch(
        `/social/${this.$store.state.currentUser.id}/friend/add/${friend.id}`
      )
    },
    async switchBlock(member: any) {
      console.log(this.blocked)
      if (this.blocked === false) {
        await axios.patch(
          `/social/${this.$store.state.currentUser.id}/blocked/add/${member.id}`
        )
      } else {
        await axios.patch(
          `/social/${this.$store.state.currentUser.id}/blocked/remove/${member.id}`
        )
      }
    },
    switchAdmin(member: any) {},
    async banFromChannel(member: any) {
      await axios.patch(
        `/channel/${this.activeChannel.id}/banUser/${this.$store.state.currentUser.id}/${member.id}}`
      )
    },
  },
})
</script>

<template>
  <div>
    <v-app dark>
      <!-- EXIT ARROW -->
      <!-- CONVERSATIONS -->
      <v-navigation-drawer
        app
        permanent
        :expand-on-hover="$vuetify.breakpoint.smAndDown"
      >
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-chat</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Conversations</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>

        <v-list v-if="inChannel" dense>
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
        <!-- ADD CHANNEL MENU -->
        <v-footer>
          <v-btn class="mx-auto" fab x-small @click.stop="addChannelPending()">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-footer>
      </v-navigation-drawer>
      <!-- MEMBERS -->
      <v-navigation-drawer
        v-if="activeChannel"
        right
        app
        permanent
        :expand-on-hover="$vuetify.breakpoint.smAndDown"
      >
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Members</v-list-item-title>
        </v-list-item>
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
                  <v-avatar size="32"><img :src="member.Avatar" /></v-avatar>
                  <v-list-item-content class="ml-2">
                    <v-list-item-title>{{ member.Nickname }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      onlineStatus(member.Status)
                    }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      member.Status
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-btn>
              </template>

              <!-- MEMBER CARD MENU -->
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-avatar size="64"><img :src="member.Avatar" /></v-avatar>
                    <v-list-item-content class="ml-2">
                      <v-list-item-title>{{
                        onlineStatus(member.Status)
                      }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        member.Status
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        member.Nickname
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                  <v-list-item
                    v-if="member.Nickname !== $store.state.currentUser.nickname"
                  >
                    <v-btn @click.stop="openPrivateChat(member)"
                      >Private chat</v-btn
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="member.Nickname !== $store.state.currentUser.nickname"
                  >
                    <v-btn @click.stop="inviteToPlay(member)"
                      >Invite to a match</v-btn
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="member.Nickname !== $store.state.currentUser.nickname"
                  >
                    <v-btn @click.stop="sendFriendRequest(member)"
                      >Send friend request</v-btn
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="
                      admin &&
                      member.Nickname != $store.state.currentUser.nickname
                    "
                  >
                    <v-btn @click.stop="banFromChannel(member)"
                      >Remove from channel</v-btn
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="member.Nickname !== $store.state.currentUser.nickname"
                  >
                    <v-list-item-title>Blocked</v-list-item-title>
                    <v-checkbox
                      v-model="member.blocked"
                      dense
                      @change="switchBlock(member)"
                    ></v-checkbox>
                  </v-list-item>
                  <v-list-item v-if="admin">
                    <v-list-item-title>Admin</v-list-item-title>
                    <v-checkbox
                      v-model="member.admin"
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
        <!-- CHANNEL ADD DIALOG -->
        <v-dialog v-model="addChannelDialog" data-app max-width="400px">
          <v-card>
            <v-card-text class="text-center">
              <div class="white--text mb-5 dialogTitle">
                Available Channels :
              </div>
              <v-divider></v-divider>
              <v-list nav dense>
                <v-list-group
                  v-for="(channel, index) in availableChannels"
                  :key="index"
                  v-model="channel.active"
                  :prepend-icon="
                    channel.Type === 'protected'
                      ? 'mdi-lock'
                      : 'mdi-lock-open-variant'
                  "
                  no-action
                >
                  <template #activator>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="channel.Name"
                      ></v-list-item-title>
                      <v-spacer></v-spacer>
                      <v-list-item-subtitle
                        v-text="channel.Users.length + ' people'"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                  <v-list-item>
                    <v-list-item-content v-if="channel.Type === 'protected'">
                      <v-text-field
                        v-model="channel.inputPassword"
                        dense
                        placeholder="enter password"
                        clear-icon="mdi-close-circle"
                        class="mr-1 mt-3"
                        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="!showPassword ? 'password' : 'text'"
                        :rules="inputRules"
                        @click:append="showPassword = !showPassword"
                        @keydown.enter.prevent="joinChannel(channel)"
                      ></v-text-field>
                    </v-list-item-content>
                    <v-spacer v-if="channel.Type !== 'protected'"></v-spacer>
                    <v-btn small @click="joinChannel(channel)">Join</v-btn>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text
                color="green"
                @click="
                  ;(createChannelDialog = true), (addChannelDialog = false)
                "
                >NEW</v-btn
              >
              <v-btn text color="white" @click="addChannelDialog = false">
                DONE
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
            <v-list-item-title>{{
              activeChannel.channelName
            }}</v-list-item-title>
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
              <v-list-item-subtitle
                >> {{ message.Content }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-container>
        <v-snackbar v-model="snackbar.active" :timeout="2000" min-width="0">{{
          snackbar.errorMessage
        }}</v-snackbar>
      </v-main>
      <!-- INPUT ZONE -->
      <v-footer v-if="inChannel" app inset>
        <v-text-field
          v-if="inChannel"
          v-model="myMessage"
          dense
          solo
          hide-details
          type="text"
          placeholder="Type here"
          clearable
          clear-icon="mdi-close-circle"
          clear-icon-color="black"
          @keydown.enter.prevent="sendMessage()"
        ></v-text-field>
      </v-footer>
    </v-app>
  </div>
</template>

<style>
.wide {
  width: 100%;
}
.auto {
  width: auto;
}
.dialogTitle {
  padding-top: 10%;
  font-size: 1rem;
}
</style>
