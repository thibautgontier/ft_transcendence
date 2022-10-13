<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import * as Colyseus from 'colyseus.js'
import {
  OurRoom,
  Message,
  chanStatus,
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
      blocked: [] as number[],
      friends: [] as User[],
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
      isFriend: false,
      amAdmin: false,
      amOwner: false,
      editMode: 'settings',
      drawerMode: 'conversations'
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
        this.editMode = 'settings'
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
  beforeCreate() {
    if (!this.$store.state.currentUser.nickname)
      this.$router.push('/');
  },
  async mounted() {
    const user = await axios.get("/user?id=" + this.$store.state.currentUser.id);
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
    await this.createClient()
    await this.getBlockedUsers()
    await this.getChannel()
    this.$store.commit('changeNoBall', true)
  },
  destroyed() {
    for(const channel of this.rooms)
    {
      channel.channel.leave()
    }
  },
    methods: {
    eventChannel(room: OurRoom) {
          room.channel.onMessage('Message', (message: any) => {
          const newMsg = new Message()
          newMsg.Content = message.Content
          newMsg.Nickname = message.Nickname
          if (this.activeChannel.id !== room.id)
            room.newMessage++;
          if (this.blocked.find(element => element === message.idSender) === undefined)
          {
            room.messages.push(newMsg)
          }
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
		    room.channel.onMessage('PrivateCreating', async (message: any) => {
			  if (message.id === this.$store.state.currentUser.id)
        {
          const newRoom = new OurRoom();
          newRoom.channel = await this.client.joinById(message.session, this.$store.state.currentUser)
          const response = await axios.get(`/channel/${message.idChan}`)
          newRoom.channelName = response.data.Name
          newRoom.id = message.idChan
          newRoom.Type = response.data.Type
          for (const user of response.data.Users)
            {
              const newUser = new User();
              newUser.avatar = user.Avatar
              newUser.nickname = user.Nickname
              newUser.id = user.id
              newUser.status = user.Status
              newRoom.members.push(newUser)
            }
          this.rooms.push(newRoom);
          this.eventChannel(newRoom)
          this.activeChannel = newRoom;
          this.inChannel = true;
          }
      })
    },
    async getBlockedUsers() {
      const response = await axios.get(`/social/${this.$store.state.currentUser.id}/blocked`)
      for (let i = 0; i < response.data.length; i++)
      {
        this.blocked.push(response.data[i].id)
      }
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
        this.snackbar.errorMessage = 'Incorrect password'
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
      room.Type = channel.Type
      for (let i = 0; i < channel.Messages.length; i++) {
        if (this.blocked.find(element => element === channel.Messages[i].UserID) === undefined){
          room.messages.push(channel.Messages[i])
          room.messages[room.messages.length - 1].Nickname = channel.Messages[i].User.Nickname
        }
      }
      const response = await axios.get(`channel/${channel.id}`)
      for (const user of response.data.Users)
        {
          const newUser = new User();
          newUser.avatar = user.Avatar
          newUser.nickname = user.Nickname
          newUser.id = user.id
          newUser.status = user.Status
          room.members.push(newUser)
        }
      this.rooms.push(room)
      this.eventChannel(room);
      this.addChannelDialog = false
      this.activeChannel = room
      this.inChannel = true
    },
    async editChannelPending(current: OurRoom) {
      const response = await axios.get(`/channel/${current.id}/isAdmin/${this.$store.state.currentUser.id}`)
      if (response.data === true)
      {
        this.editChannelDialog = !this.editChannelDialog
        this.dialogRoom = current
      }
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
        newRoom.Type = response.data.Type
        for (const user of response.data.Users)
        {
          const newUser = new User();
          newUser.avatar = user.Avatar
          newUser.nickname = user.Nickname
          newUser.id = user.id
          newUser.status = user.Status
          newRoom.members.push(newUser)
        }
        this.newChannel.name = ''
        this.createChannelDialog = false
        if (this.newChannel.protected === true) {
          await axios.patch(
            `/channel/${newRoom.id}/switchToPrivate/${this.$store.state.currentUser.id}`,
            { Password: this.newChannel.password }
          )
          newRoom.Type = chanStatus.PROTECTED
        }
        this.rooms.push(newRoom)
        this.activeChannel = newRoom
        this.inChannel = true
        this.eventChannel(newRoom);
      } catch (e) {
        console.warn('create error', e)
        this.snackbar.active = true
        this.snackbar.errorMessage = 'Cannot create channel, channel name must be already taken'
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
      ) {
          this.snackbar.active = true
          this.snackbar.errorMessage = 'Invalid input or "protected channel" is checked without password'
          return
      }
      try{
        if (this.editChannel.name !== '' && this.editChannel.name !== this.dialogRoom.channelName) {
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
          this.dialogRoom.Type = chanStatus.PROTECTED
        }
      } // if channel is protected by a pw
      else if (this.editChannel.protected === false) {
        // channel protected devient public
        await axios.patch(
          `/channel/${this.dialogRoom.id}/switchToPublic/${this.$store.state.currentUser.id}`
        )
        this.dialogRoom.Type = chanStatus.PUBLIC
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
    onlineStatus(status: string) {
      if (status === 'online') return '🟢'
      else if (status === 'AFK') return '🌙'
      return '🔴'
    },
    async createClient() {
      try {
        this.client = await new Colyseus.Client('ws://localhost:3000')
      } catch (e) {
        console.warn('Create Client ERROR', e)
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
        {Content : this.myMessage,
		    Nickname: this.$store.state.currentUser.nickname,
        idSender: this.$store.state.currentUser.id}
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
        room.Type = channel.Type
        for (let i = 0; i < channel.Messages.length; i++) {
          if (this.blocked.find(element => element === channel.Messages[i].UserID) === undefined){
            room.messages.push(channel.Messages[i])
            room.messages[room.messages.length - 1].Nickname = channel.Messages[i].User.Nickname
          }
        }
        for (const user of channel.Users)
        {
          const newUser = new User();
          newUser.avatar = user.Avatar
          newUser.nickname = user.Nickname
          newUser.id = user.id
          newUser.status = user.Status
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
      const responseIsAdmin = await axios.get(`/channel/${this.activeChannel.id}/isAdmin/${member.id}`)
      this.isAdmin = responseIsAdmin.data
      const responseIsFriend = await axios.get(`/social/${this.$store.state.currentUser.id}/isFriend/${member.id}`)
      this.isFriend = responseIsFriend.data
      const responseAmAdmin = await axios.get(`/channel/${this.activeChannel.id}/isAdmin/${this.$store.state.currentUser.id}`)
      this.amAdmin = responseAmAdmin.data
      const responseAmOwner = await axios.get(`/channel/${this.activeChannel.id}/isOwner/${this.$store.state.currentUser.id}`)
      this.amOwner = responseAmOwner.data
      this.sanction.reason = ''
      this.sanction.permanent = true
      this.sanction.duration = 0
      this.sanction.type = ''
    },
    async openPrivateChat(member: User) {
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
            Name : ( this.$store.state.currentUser.nickname + member.nickname),
            RoomId: newRoom.channel.id,
          })
          newRoom.channelName = ( this.$store.state.currentUser.nickname + member.nickname );
          newRoom.id = response2.data.id
          newRoom.Type = response2.data.Type
          for (const user of response2.data.Users)
          {
            const newUser = new User();
            newUser.avatar = user.Avatar
            newUser.nickname = user.Nickname
            newUser.id = user.id
            newUser.status = user.Status
            newRoom.members.push(newUser)
          }
          this.rooms.push(newRoom);
          this.eventChannel(newRoom);
		      this.activeChannel.channel.send('PrivateCreating', {session: newRoom.channel.id, id: member.id, idChan: newRoom.id})
          this.activeChannel = newRoom;
          this.inChannel = true;
          } catch(e) {
            newRoom.channel.leave()
            console.warn('Cannot create private channel', e);
            this.snackbar.active = true
            this.snackbar.errorMessage = 'the user has blocked you or you have blocked him'
          }
        }
    },
    openPrivateChatAdapter(friend : any) {
      const user = new User();
      user.avatar = friend.Avatar;
      user.nickname = friend.Nickname
      user.status = friend.Status
      user.id = friend.id
      this.openPrivateChat(user)
    },
    inviteToPlay(member: User) {},
    async addFriend(member: User) {
      await axios.patch(
        `/social/${this.$store.state.currentUser.id}/friend/add/${member.id}`
      )
    this.isFriend = true;
    this.updateFriends();
    },
    async removeFriend(friend) {
      await axios.patch(
        `/social/${this.$store.state.currentUser.id}/friend/remove/${friend.id}`
      )
    this.isFriend = false;
    this.friends.splice(this.friends.indexOf(friend), 1);
    },
    async blockUser(member: User) {
        await axios.patch(
          `/social/${this.$store.state.currentUser.id}/blocked/add/${member.id}`
        )
        this.isBlocked = true;
        this.blocked.push(member.id);
    },
    async unblockUser(member: User) {
        await axios.patch(
          `/social/${this.$store.state.currentUser.id}/blocked/remove/${member.id}`
        )
        this.isBlocked = false;
        const index = this.blocked.indexOf(member.id)
        this.blocked.splice(index, 1)
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
      for (const sanction of response.data)
      {
        if (sanction.Duration > 0)
        {
          const created = Date.parse(sanction.CreatedAt)
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
    },
    async updateFriends() {
      const response = await axios.get("/social/" + this.$store.state.currentUser.id + "/friend")
      this.friends = response.data
    },
    // updateUserStatus(status : string) {
    //   this.$store.commit('changeStatus', status)
    // }
  }
})
</script>

<template>
  <div>
    <v-app dark>
      <!-- CONVERSATIONS -->
      <v-navigation-drawer
        v-if="drawerMode === 'conversations'"
        app
        permanent
        :expand-on-hover="$vuetify.breakpoint.smAndDown"
      >
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-chat</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Channels</v-list-item-title>
          <v-btn small @click.stop="updateFriends(), drawerMode='friends'">FRIENDS</v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <v-list v-if="inChannel" dense>
          <v-list-item-group>
            <v-list-item
              v-for="(room, index) in rooms"
              :key="index"
              @click.stop="activeChannel = room, activeChannel.newMessage = 0"
            >
              <v-list-item-content>
                <v-list-item-title>{{ room.channelName }}</v-list-item-title>
              </v-list-item-content>
                <v-badge
                  v-if="room.newMessage >= 1"
                  :content="room.newMessage"
                  left
                  overlap
                  color="orange"
                  offset-x="-15"
                ></v-badge>
              <v-btn
                v-if="room.Type !== 'private'"
                fab
                x-small
                text
                @click.stop="editChannelPending(room)"
                ><v-icon>mdi-cog</v-icon></v-btn>
              <v-btn v-if="room.Type !== 'private'" text fab x-small @click.stop="leaveChannelPending(room)"
                ><v-icon>mdi-close</v-icon></v-btn>
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
      <!-- FRIENDS -->
      <v-navigation-drawer
        v-else
        app
        permanent
        :expand-on-hover="$vuetify.breakpoint.smAndDown"
      >
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-human-greeting-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Friends</v-list-item-title>
          <v-btn small @click.stop="drawerMode = 'conversations'">CHANNELS</v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item
            v-for="(friend, index) in friends"
            :key="index"
          >
            <v-menu
              v-model="friend.menu"
              :close-on-content-click="false"
              right
              offset-x
              transition="slide-x-transition"
              class="memberCard"
            >
              <template #activator="{ on, attrs }">
                <v-btn class="wide" text color="white" v-bind="attrs" v-on="on" @click.stop="">
                  <v-avatar size="32"><img :src="friend.Avatar" /></v-avatar>
                  <v-list-item-content class="ml-2">
                    <v-list-item-title>{{ friend.Nickname }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      onlineStatus(friend.Status)
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-btn>
              </template>
              <!-- FRIEND CARD MENU -->
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-avatar size="64"><img :src="friend.Avatar" /></v-avatar>
                    <v-list-item-content class="ml-2">
                      <v-list-item-title>{{
                        onlineStatus(friend.Status)
                      }}</v-list-item-title>
                      <v-list-item-title>{{
                        friend.Nickname
                      }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        friend.status
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item>
                    <v-btn @click.stop="openPrivateChatAdapter(friend)">Private chat</v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn @click.stop="inviteToPlay(friend)">Invite to a match</v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn @click.stop="removeFriend(friend)">Remove Friend</v-btn>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-list-item>
        </v-list>
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
                      }}  <v-icon v-if="isAdmin === true && activeChannel.Type !== 'private'">mdi-crown</v-icon> </v-list-item-title>
                      <v-list-item-subtitle>{{
                        member.status
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item
                    v-if="member.nickname !== $store.state.currentUser.nickname && activeChannel.Type !== 'private'"
                  >
                    <v-btn @click.stop="openPrivateChat(member)"
                      >Private chat</v-btn>
                  </v-list-item>
                  <v-list-item
                    v-if="member.nickname !== $store.state.currentUser.nickname"
                  >
                    <v-btn @click.stop="inviteToPlay(member)"
                      >Invite to a match</v-btn
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="member.nickname !== $store.state.currentUser.nickname && isFriend === false"
                  >
                    <v-btn @click.stop="addFriend(member)"
                      >Add to friends</v-btn
                    >
                  </v-list-item>
                  <v-list-item v-if="isAdmin === false && amAdmin === true && activeChannel.Type !== 'private'">
                    <v-btn
                      dense
                      @click.stop="makeAdmin(member)"
                    >Make Admin</v-btn>
                  </v-list-item>
                  <v-list-item v-if="isAdmin === true && amOwner === true && member.id !== $store.state.currentUser.id  && activeChannel.Type !== 'private'">
                    <v-btn
                      dense
                      @click.stop="removeAdmin(member)"
                    >Remove Admin</v-btn>
                  </v-list-item>
                  <v-list-item
                    v-if=" amAdmin && member.id !== $store.state.currentUser.id  && activeChannel.Type !== 'private'"
                  >
                    <v-btn @click.stop="banUserPending(member)"
                      >Ban</v-btn
                    >
                  </v-list-item>
                  <v-list-item
                    v-if=" amAdmin && member.id !== $store.state.currentUser.id  && activeChannel.Type !== 'private'"
                  >
                    <v-btn @click.stop="muteUserPending(member)">Mute</v-btn>
                  </v-list-item>
                  <v-list-item v-if="isBlocked === false && member.id !== $store.state.currentUser.id">
                    <v-btn
                      dense
                      @click.stop="blockUser(member)"
                    >Block</v-btn>
                  </v-list-item>
                  <v-list-item v-else-if="isBlocked === true && member.id !== $store.state.currentUser.id">
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
        <!-- USER STATUS -->
        <!-- <v-footer absolute pad outlined>
          <v-menu
            :close-on-content-click="true"
            top
            offset-y
            transition="slide-y-reverse-transition"
            >
            <template #activator="{ on, attrs }">
              <v-btn class="wide" text color="white" v-bind="attrs" v-on="on">
                <v-list-item-avatar>
                  <v-img absolute :src="$store.state.currentUser.avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ $store.state.currentUser.nickname }}</v-list-item-title>
                  <v-list-item-action-text>{{ $store.state.currentUser.status }}</v-list-item-action-text>
                </v-list-item-content>
              </v-btn>
            </template> -->

              <!-- USER STATUS MENU -->
              <!-- <v-card>
                <v-list>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-img absolute :src="$store.state.currentUser.avatar"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ $store.state.currentUser.nickname }}</v-list-item-title>
                      <v-spacer></v-spacer>
                      <v-list-item-subtitle>{{ $store.state.currentUser.status }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                  <v-list-item>
                    <v-btn @click="updateUserStatus('online')">Online</v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn @click="updateUserStatus('AFK')">Away</v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn @click="updateUserStatus('invisible')">Invisible</v-btn>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
        </v-footer> -->
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
              @keydown.enter.prevent="newChannelConfirmed()"
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
            <div v-if="editMode === 'settings'">
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
                @keydown.enter.prevent="editChannelConfirmed()"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-card-actions>
                <v-btn text color="orange" @click="editMode = 'bans', updateSanction()">
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
                <v-btn text color="orange" @click="editMmode = 'settings'">
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
              <v-list-item-subtitle class="text-wrap">
                <p> {{ message.Content }} </p>
                </v-list-item-subtitle>
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
