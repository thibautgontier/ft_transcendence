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
  Sanction
} from '../types/room'
import { User } from '../types/User'

export default Vue.extend({
  layout: 'DefaultLayout',
  data(): any {
    return {
      newChannel: { name: '', protected: false, password: '' },
      editChannel: { name: '', protected: false, password: '' },
      sanction: { reason: '', type: '', permanent: true, duration: 0},
      snackbar: { active: false, errorMessage: '' },
      sanctions: [] as Sanction[],
      activeChannel: OurRoom,
      addChannelDialog: false,
      createChannelDialog: false,
      editChannelDialog: false,
      leaveChannelDialog: false,
      channelPasswordDialog: false,
      banUserDialog : false,
      muteUserDialog : false,
      inChannel: false,
      client: Colyseus.Client,
      dialogRoom: OurRoom,
      dialogMember: User,
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
      isBlocked: false,
      isAdmin: false,
      amAdmin: false,
      amOwner: false,
      mode: 'settings'
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
        this.mode = 'settings'
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
    this.$store.commit('changeInMenu', false)
  },
  destroyed() {
    for(const channel of this.rooms)
    {
      channel.channel.leave()
    }
  },
    methods: {
    eventChannel(room: OurRoom) {
          room.channel.onMessage('Message', (message: ChatRoomMessage) => {
          const newMsg = new Message()
          newMsg.Content = message.Content
          newMsg.Nickname = message.Nickname
          room.messages.push(newMsg)
        })
        room.channel.onMessage('Joining', (message: User) => {
          if (room.members.find((User: User) => User.id === message.id) === undefined) {
            let member = new User();
            member = message;
            room.members.push(member)
          }
        })
        room.channel.onMessage('Leaving', (message: User) => {
          if (message.id === this.$store.state.currentUser.id)
          {
            const index = this.rooms.indexOf(room)
            this.rooms.splice(index, 1)
            room.channel.leave()
            this.activeChannel = this.rooms[0];
            if (this.rooms.length === 0)
              this.inChannel = false
          }
          for(let i = 0; i < room.members.length; i++)
          {
            if (room.members[i].id === message.id) {
              room.members.splice(i, 1)
              break;
            }
          }
        })
        room.channel.onMessage('ChanMAJ', (message: string) => {
          room.channelName = message
        })
    },
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
    },
    banUserPending(current: User): void {
      this.banUserDialog = !this.banUserDialog
      this.dialogUser = current
    },
    async banUserConfirmed() {
      this.sanction.type = 'ban'
      if (this.sanction.permanent === true)
        this.sanction.duration = -1
      try {
        await axios.patch(
          `/channel/banUser`, {
            idUser : this.dialogUser.id,
        idAdmin : this.$store.state.currentUser.id,
        reason : this.sanction.reason,
        duration : this.sanction.duration,
        idChan : this.activeChannel.id,
        Sanction: this.sanction.type
        }
      )
      this.activeChannel.channel.send('Leaving', this.dialogUser)
      const index = this.activeChannel.members.indexOf(this.dialogUser)
      this.activeChannel.members.splice(index, 1)
      } catch (e)
      {
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot Ban User'
      }
      this.banUserDialog = false
    },
    muteUserPending(current: User): void {
      this.muteUserDialog = !this.muteUserDialog
      this.dialogUser = current
    },
    async muteUserConfirmed() {
      this.muteUserDialog = false
      this.sanction.type = 'mute'
      if (this.sanction.permanent === true)
        this.sanction.duration = -1
      try {
        await axios.patch(
          `/channel/banUser`, {
        idUser : this.dialogUser.id,
        idAdmin : this.$store.state.currentUser.id,
        reason : this.sanction.reason,
        duration : this.sanction.duration,
        idChan : this.activeChannel.id,
        Sanction: this.sanction.type
	    	}
      )
      } catch(e) {
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot Mute User'
      }
    },
    async joinChannel(channel: any) {
      try {
        if (channel.Type === chanStatus.PROTECTED && channel.inputPassword) {
          await axios.patch(`/channel/addUser/${channel.id}`, {
            user_id: this.$store.state.currentUser.id,
            password: channel.inputPassword,
          })
        } else {
          await axios.patch(`/channel/addUser/${channel.id}`, {
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
        room.channel = await this.client.joinById(channel.RoomId, this.$store.state.currentUser)
      } catch (e) {
        room.channel = await this.client.create('ChatRoom', this.$store.state.currentUser)
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
      for (const user of response.data.Users)
        {
          const newUser = new User();
          newUser.avatar = user.Avatar
          newUser.nickname = user.Nickname
          newUser.id = user.id
          room.members.push(newUser)
        }
      this.rooms.push(room)
      this.eventChannel(room);
      this.addChannelDialog = false
      this.activeChannel = room
      this.inChannel = true
    },
    async editChannelPending(current: OurRoom) {
      this.editChannelDialog = !this.editChannelDialog
      const response = await axios.get(`/channel/${current.id}/isAdmin/${this.$store.state.currentUser.id}`)
      if (response.data === true)
        this.dialogRoom = current
      else
        this.snackbar.active = true
        this.snackbar.errorMessage = 'You are not a channel administrator'
    },
    async leaveChannelConfirmed() {
      this.leaveChannelDialog = false
      this.dialogRoom.channel.send('Leaving', this.$store.state.currentUser)
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
        newRoom.channel = await this.client.create('ChatRoom', this.$store.state.currentUser)
        const response = await axios.post('/channel/create', {
          owner: `${this.$store.state.currentUser.id}`,
          Name: this.newChannel.name,
          RoomId: newRoom.channel.id,
        })
        newRoom.channelName = this.newChannel.name
        newRoom.id = response.data.id
        for (const user of response.data.Users)
        {
          const newUser = new User();
          newUser.avatar = user.Avatar
          newUser.nickname = user.Nickname
          newUser.id = user.id
          newRoom.members.push(newUser)
        }
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
        this.activeChannel = newRoom
        this.eventChannel(newRoom);
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
      try{
        if (this.editChannel.name !== '') {
        // changement de nom
        await axios.patch(
          `/channel/update/${this.dialogRoom.id}/${this.$store.state.currentUser.id}`,
          { name: this.editChannel.name }
        )
        this.dialogRoom.channelName = this.editChannel.name;
        this.dialogRoom.channel.send('ChanMAJ', this.dialogRoom.channelName);
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
      } catch(e) {
        console.warn('Cannot edit Channel! :', e);
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot edit channel, it seems that you don\'t have the right'
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
        await axios.post(
          `channel/${this.activeChannel.id}/sendMessage/${this.$store.state.currentUser.id}`,
          { Content: this.myMessage }
        )
      } catch (e) {
        console.warn('you are banned or muted:\n', e)
        this.snackbar.active = true
        this.snackbar.errorMessage = 'You have been muted'
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
      if (response.data.ChannelUser === undefined) return;
      for (const channel of response.data.ChannelUser) {
        const room = new OurRoom()
        try {
          room.channel = await this.client.joinById(channel.RoomId, this.$store.state.currentUser)
        } catch (e) {
          room.channel = await this.client.create('ChatRoom', this.$store.state.currentUser)
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
        for (const user of channel.Users)
        {
          const newUser = new User();
          newUser.avatar = user.Avatar
          newUser.nickname = user.Nickname
          newUser.id = user.id
          room.members.push(newUser)
        }
        this.rooms.push(room);
        this.eventChannel(room);
        this.addChannelDialog = false
        channel.active = false
      }
      if (this.rooms.length > 0) {
        this.activeChannel = this.rooms[0]
        this.inChannel = true
      }
    },
    async updateMember (member: any) {
      const responseBlocked = await axios.get(`/social/${this.$store.state.currentUser.id}/isBlocked/${member.id}`)
      this.isBlocked = responseBlocked.data
      const responseAdmin = await axios.get(`/channel/${this.activeChannel.id}/isAdmin/${member.id}`)
      this.isAdmin = responseAdmin.data
      const responseOwner = await axios.get(`/channel/${this.activeChannel.id}/isOwner/${this.$store.state.currentUser.id}`)
      this.amOwner = responseOwner.data
      this.sanction.reason = ''
      this.sanction.permanent = true
      this.sanction.duration = 0
      this.sanction.type = ''
    },
    async openPrivateChat(member: any) {
      const response = await axios.get(`channel/isPrivateCreated/${member.id}/${this.$store.state.currentUser.id}`)
      if (response.data) {
        this.activeChannel = this.rooms.find((channel: OurRoom) => channel.id === response.data.id)
        this.inChannel = true;
      }
      else {
        const newRoom = new OurRoom()
        try{
          newRoom.channel = await this.client.create('ChatRoom', this.$store.state.currentUser)
          const response2 = await axios.post('channel/createPriv', {
            user_1 : this.$store.state.currentUser.id,
            user_2 : member.id,
            Name : ( this.$store.state.currentUser.nickname + member.Nickname),
            RoomId: newRoom.channel.id,
          })
          newRoom.channelName = ( this.$store.state.currentUser.nickname + member.Nickname );
          newRoom.id = response2.data.id
          for (const user of response2.data.Users)
          {
            const newUser = new User();
            newUser.avatar = user.Avatar
            newUser.nickname = user.Nickname
            newUser.id = user.id
            newRoom.members.push(newUser)
          }
          this.rooms.push(newRoom);
          this.inChannel = true;
          this.activeChannel = newRoom;
          this.eventChannel(newRoom);
          } catch(e) {
            console.warn('Cannot create private channel', e);
          }
        }
    },
    inviteToPlay(member: User) {},
    async sendFriendRequest(member: User) {
      await axios.patch(
        `/social/${this.$store.state.currentUser.id}/friend/add/${member.id}`
      )
    },
    async switchBlock(member: any) {
      if (this.isBlocked === false) {
        await axios.patch(
          `/social/${this.$store.state.currentUser.id}/blocked/add/${member.id}`
        )
        this.isBlocked = true;
      } else {
        await axios.patch(
          `/social/${this.$store.state.currentUser.id}/blocked/remove/${member.id}`
        )
        this.isBlocked = false;
      }
    },
    async blockUser(member: any) {
        await axios.patch(
          `/social/${this.$store.state.currentUser.id}/blocked/add/${member.id}`
        )
        this.isBlocked = true;
    },
    async unblockUser(member: any) {
        await axios.patch(
          `/social/${this.$store.state.currentUser.id}/blocked/remove/${member.id}`
        )
        this.isBlocked = false;
    },
    async makeAdmin(member: any) {
      try{
          await axios.patch(`/channel/${this.activeChannel.id}/addAdmin/${member.id}/${this.$store.state.currentUser.id}`)
          this.isAdmin = true;
      } catch(e) {
        console.warn('Cannot make an admin:', e);
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot make an admin'
      }
    },
    async removeAdmin(member: any) {
      try{
        await axios.patch(`/channel/${this.activeChannel.id}/removeAdmin/${member.id}/${this.$store.state.currentUser.id}`)
        this.isAdmin = false;
      } catch(e) {
        console.warn('Cannot remove admin:', e);
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot remove admin'
      }
    },
    async updateSanction() {
      const response = await axios.get(`/channel/Sanction/${this.dialogRoom.id}`)
      for (let sanction of response.data)
      {
        if (sanction.Duration > 0)
        {
          let created = Date.parse(sanction.CreatedAt)
          sanction.Duration = Math.floor(((sanction.Duration * 60000) - (Date.now() - created)) / 60000)
        }
      }
      this.sanctions = response.data
    },
    async pardonUser(sanction: Sanction) {
      try {
        await axios.delete(`/channel/Sanction/${sanction.id}`)
        for (let i = 0; i < this.sanctions.length; i++)
        {
          if (this.sanctions[i].id === sanction.id) {
            this.sanctions.splice(i, 1)
            break; }
        }
      } catch(e) {
        console.warn(e)
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot pardon User'
      }
    }
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
        <v-list-item>
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
              class="memberCard"
            >
              <template #activator="{ on, attrs }">
                <v-btn class="wide" text color="white" v-bind="attrs" v-on="on" @click="updateMember(member)">
                  <v-avatar size="32"><img :src="member.avatar" /></v-avatar>
                  <v-list-item-content class="ml-2">
                    <v-list-item-title>{{ member.nickname }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      onlineStatus(member.status)
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-btn>
              </template>

              <!-- MEMBER CARD MENU -->
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-avatar size="64"><img :src="member.avatar" /></v-avatar>
                    <v-list-item-content class="ml-2">
                      <v-list-item-title>{{
                        onlineStatus(member.status)
                      }}</v-list-item-title>
                      <v-list-item-title>{{
                        member.nickname
                      }}  <v-icon v-if="isAdmin">mdi-crown</v-icon> </v-list-item-title>
                      <v-list-item-subtitle>{{
                        member.status
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                  <v-list-item
                    v-if="member.nickname !== $store.state.currentUser.nickname"
                  >
                    <v-btn @click.stop="openPrivateChat(member)"
                      >Private chat</v-btn
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="member.nickname !== $store.state.currentUser.nickname"
                  >
                    <v-btn @click.stop="inviteToPlay(member)"
                      >Invite to a match</v-btn
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="member.nickname !== $store.state.currentUser.nickname"
                  >
                    <v-btn @click.stop="sendFriendRequest(member)"
                      >Send friend request</v-btn
                    >
                  </v-list-item>
                  <v-list-item v-if="isAdmin === false && amAdmin === true">
                    <v-btn
                      dense
                      @click.stop="makeAdmin(member)"
                    >Make Admin</v-btn>
                  </v-list-item>
                  <v-list-item v-if="isAdmin === true && amOwner === true && member.id !== $store.state.currentUser.id">
                    <v-btn
                      dense
                      @click.stop="removeAdmin(member)"
                    >Remove Admin</v-btn>
                  </v-list-item>
                  <v-list-item
                    v-if=" amAdmin && member.nickname !== $store.state.currentUser.nickname"
                  >
                    <v-btn @click.stop="banUserPending(member)"
                      >Ban</v-btn
                    >
                  </v-list-item>
                  <v-list-item
                    v-if=" amAdmin && member.nickname !== $store.state.currentUser.nickname"
                  >
                    <v-btn @click.stop="muteUserPending(member)"
                      >Mute</v-btn
                    >
                  </v-list-item>
                  <v-list-item v-if="isBlocked === false">
                    <v-btn
                      dense
                      @click.stop="blockUser(member)"
                    >Block</v-btn>
                  </v-list-item>
                  <v-list-item v-else>
                    <v-btn
                      dense
                      @click.stop="unblockUser(member)"
                    >Unblock</v-btn>
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
            <div v-if="mode === 'settings'">
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
                <v-btn text color="orange" @click="mode = 'bans', updateSanction()">
                  SANCTIONS
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text color="grey" @click="editChannelDialog = false">
                  CANCEL
                </v-btn>
                <v-btn text color="green" @click="editChannelConfirmed()">
                  SAVE AND QUIT
                </v-btn>
            </v-card-actions>
          </div>
          <div v-else>
              <v-card-text class="text-center">
                <div class="white--text dialogTitle">CHANNEL CONTROL PANEL</div>
              </v-card-text>
              <v-card-text class="text-center">
                <div class="white--text dialogTitle">Channel Sanctions :</div>
              </v-card-text>
              <v-container >
                <v-list v-for="(punished, index) in sanctions" :key="index">
                  <div class="sanction">
                    <v-list-item>
                      <v-list-item-title>{{punished.User.Nickname}}</v-list-item-title>
                      <v-list-item-subtitle>{{punished.Type}}</v-list-item-subtitle>
                      <v-list-item-subtitle v-if="punished.Duration === -1">permanent</v-list-item-subtitle>
                      <v-list-item-subtitle v-else-if="punished.Duration === 1">{{punished.Duration}} minutes left</v-list-item-subtitle>
                      <v-list-item-subtitle v-else-if="punished.Duration === 0">{{punished.Duration}} less than a minute left</v-list-item-subtitle>
                      <v-list-item-subtitle v-else>{{punished.Duration}} minutes left</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-subtitle>reason: "{{punished.Reason}}"</v-list-item-subtitle>
                      <v-btn @click="pardonUser(punished)">PARDON</v-btn>
                    </v-list-item>
                  </div>
                </v-list>
              </v-container>
              <v-card-actions>
                <v-btn text color="orange" @click="mode = 'settings'">
                  SETTINGS
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text color="grey" @click="editChannelDialog = false">
                  CLOSE
                </v-btn>
            </v-card-actions>
          </div>
          </v-card>
        </v-dialog>
        <!-- BAN USER DIALOG -->
        <v-dialog v-model="banUserDialog" max-width="400px">
          <v-card>
            <v-card-text class="text-center">
              <div class="white--text dialogTitle">BAN USER</div>
            </v-card-text>
            <v-card-text class="text-center">
              <div class="white--text dialogTitle">Reason :</div>
            </v-card-text>
            <v-text-field
              v-model="sanction.reason"
              dense
              solo
              required
              type="text"
              placeholder="reason for the ban"
              clearable
              clear-icon="mdi-close-circle"
              @keydown.enter.prevent="banUserConfirmed()"
            ></v-text-field>
            <v-list-item>
              <v-list-item-title>Permanent</v-list-item-title>
              <v-checkbox v-model="sanction.permanent"></v-checkbox>
            </v-list-item>
            <v-card-text v-if="sanction.permanent === false" class="text-center">
              <div class="white--text dialogTitle">Duration :</div>
            </v-card-text>
            <v-slider
              v-if="sanction.permanent === false"
              v-model="sanction.duration"
              color="orange"
              label="Minutes"
              hint="Ban Duration in Minutes"
              min="1"
              max="300"
              thumb-label
              class="semiWide"
            ></v-slider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="grey" @click="banUserDialog = false">
                CANCEL
              </v-btn>
              <v-btn text color="red" @click="banUserConfirmed()">
                BAN
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- MUTE USER DIALOG -->
        <v-dialog v-model="muteUserDialog" max-width="400px">
          <v-card>
            <v-card-text class="text-center">
              <div class="white--text dialogTitle">MUTE USER</div>
            </v-card-text>
            <v-card-text class="text-center">
              <div class="white--text dialogTitle">Reason :</div>
            </v-card-text>
            <v-text-field
              v-model="sanction.reason"
              dense
              solo
              required
              type="text"
              placeholder="reason for the mute"
              clearable
              clear-icon="mdi-close-circle"
              @keydown.enter.prevent="muteUserConfirmed()"
            ></v-text-field>
            <v-list-item>
            <v-list-item-title>Permanent</v-list-item-title>
              <v-checkbox v-model="sanction.permanent"></v-checkbox>
            </v-list-item>
            <v-card-text v-if="sanction.permanent === false" class="text-center">
              <div class="white--text dialogTitle">Duration :</div>
            </v-card-text>
            <v-slider
              v-if="sanction.permanent === false"
              v-model="sanction.duration"
              color="orange"
              label="Minutes"
              hint="Mute Duration in Minutes"
              min="1"
              max="300"
              thumb-label
              class="semiWide"
            ></v-slider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="grey" @click="muteUserDialog = false">
                CANCEL
              </v-btn>
              <v-btn text color="red" @click="muteUserConfirmed()">
                Mute
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- CHANNEL MESSAGES -->
        <v-container v-if="inChannel">
          <v-list-item-content>
            <v-list-item-title>@{{
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
.semiWide {
  margin-left: 5%;
  width: 90%;
}
.sanction {
  border: solid;
  border-width: thin;
  border-color: grey;
}
.auto {
  width: auto;
}
.dialogTitle {
  padding-top: 10%;
  font-size: 1rem;
}
.memberCard {
  z-index: 129;
}
</style>
