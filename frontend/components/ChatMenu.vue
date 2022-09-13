<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import * as Colyseus from "colyseus.js";
import { ourRoom, Message, Channel } from "../types/room"

export default Vue.extend({
	data() : any {
		return {
			members: [
				{ name: "Ben", online: true, icon: "mdi-account", status: "ajoute des menus", menu: false, blockedSwitch: false, adminSwitch: true },
				{ name: "Toto", online: true, icon: "mdi-account", status: "ajoute Colyseus", menu: false, blockedSwitch: true, adminSwitch: true },
				{ name: "Luigi", online: false, icon: "mdi-account", status: "travaille au foodtruck", menu: false, blockedSwitch: false, adminSwitch: false },
			],
			newChannel:{ name:'', private:false, password:'', confirmPassword:'', maxPeople:64 },
			editChannel:{ name:'', private:false, password:'', confirmPassword:''},
			userIcon: "",
			userName: "Ben",
			userStatus: "Busy",
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
			channelNameRules: [
				(value: string) => (value && value.length >= 3 && value.length <= 12) || 'bewteen 3 and 12 characters'
			],
			showPassword: false
		};
	},
	head(): {} {
		const title = "Transcendence - Chat";
		return {
			title,
		};
	},
	watch: {
		createChannelDialog(newValue) {
			if (!newValue) {
				this.newChannel.name = '';
				this.newChannel.password = '';
				this.newChannel.private = false;
				this.newChannel.maxPeople = 64;
				this.showPassword = false
			}
		},
		editChannelDialog(newValue) {
			if (!newValue) {
				this.editChannel.name = '';
				this.editChannel.password = '';
				this.editChannel.private = false;
				this.showPassword = false
			}
		}
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
		leaveChannelPending(current : ourRoom) : void{
			this.leaveChannelDialog = !this.leaveChannelDialog
			this.dialogRoom = current
		},
		editChannelPending(current : ourRoom) : void{
			this.editChannelDialog = !this.editChannelDialog
			this.dialogRoom = current
		},
		leaveChannelConfirmed() {
			this.leaveChannelDialog = false
			this.dialogRoom.channel.leave();
			const index = this.rooms.indexOf(this.dialogRoom)
			this.rooms.splice(index, 1)
			this.activeChannel = this.rooms[0]
			if (this.rooms.length === 0)
				this.inChannel = false
		},
		async newChannelConfirmed() {
			if (this.newChannel.name.length < 3 || this.newChannel.name.length > 12)
				return;
			const newRoom = new ourRoom();
			try {
				newRoom.channel = await this.client.create('ChatRoom');
				const response = axios.post('/channel/create', {"owner" : "1" ,
					"Name" : this.newChannel.name, "RoomId" : newRoom.channel.id})
				newRoom.channelName = this.newChannel.name;
				this.rooms.push(newRoom);
				this.inChannel = true;
				this.newChannel.name = '';
				this.createChannelDialog = false;
				newRoom.channel.onMessage("Message", (message : string) => { // listening message from socket
					const newMsg = new Message();
					newMsg.Content = message;
					newRoom.messages.push(newMsg);
				})
				this.activeChannel = newRoom;
			}
			catch (e) {
				console.error("join error", e);
			}
		},
		editChannelConfirmed() {
			this.editChannelDialog = false;
		},
		OnlineStatus(online: boolean) {
			if (online === true)
				return "🟢"
			return "🔴"
		},
		updateUserStatus(status: string) {
			this.userStatus = status;
		},
		async createClient() {
			try {
				this.client = await new Colyseus.Client('ws://localhost:3000')
				console.log(this.client)
			}
			catch(e){
				console.log("Create Client ERROR", e);
			}
		},
		sendMessage() : void {
			if (this.myMessage === '')
				return
			this.activeChannel.channel.send("Message" , this.myMessage)
			axios.post(`channel/${this.activeChannel.id}/sendMessage/1`, { "Content" : this.myMessage})
			this.myMessage=''
		},
		async getChannel() {
			const response = await axios.get('/channel/');
			console.log(response.data);
			for (const channel of response.data as Channel[]) {
				const room = new ourRoom();
				try {
					room.channel = await this.client.joinById(channel.RoomId);
				}
				catch(e)
				{
					room.channel = await this.client.create('ChatRoom');
					await axios.patch(`/channel/update/${channel.id}/1`, {"RoomId" : room.channel.id})
				}
				room.channelName = channel.Name;
				room.id = channel.id;
				room.messages = channel.Messages
				this.rooms.push(room);
				room.channel.onMessage("Message", (message : string) => { // listening message from socket
					const newMsg = new Message();
					newMsg.Content = message;
					room.messages.push(newMsg);
				})
			}
			if (this.rooms.length > 0)
			{
				this.activeChannel = this.rooms[0];
				this.inChannel = true;
			}
		},
		openPrivateChat() {

		},
		inviteToPlay() {

		},
		async sendFriendRequest() {
			/**
			 * const response = await axios.patch('/socialProfile/{userID}/friend/add/{blockedID}')
			 */
		},
		switchBlock(member : any) {
			// if (this.blocked === false)
				// const response = await axios.patch('/socialProfile/{userID}/blocked/add/{blockedID}')
			// else
				// const response = await axios.patch('/socialProfile/{userID}/blocked/remove/{blockedID}')
			console.log("blocked: " + member.blockSwitch)
		},
		switchAdmin(member : any) {
			console.log("admin: " + member.adminSwitch)
		},
		async banFromChannel() {
			/**
			 * const response = await axios.patch('/channel/{channelid}/banUser/{idAdmin}/{idUser}')
			 */
		}
	},
})
</script>

<template>
	<div>
		<!-- EXIT ARROW -->
		<!-- CONVERSATIONS -->
		<v-navigation-drawer
		permanent
		clipped
		app
		>
		<template #prepend>
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title>Conversations</v-list-item-title>
				</v-list-item-content>
				<v-btn text color="white" @click.stop="createChannelDialog=true">New</v-btn>
				<v-btn v-if="admin" text color="white" @click.stop="editChannelDialog=true">Edit</v-btn>
			</v-list-item>
		</template>
		<v-divider></v-divider>
		<v-list dense>
			<v-list-item
			v-for="(room, index) in rooms"
			:key="index"
			@click.stop="activeChannel = room"
			>
				<v-list-item-content>
					<v-list-item-title>{{ room.channelName }}</v-list-item-title>
				</v-list-item-content>
				<v-btn v-if="admin" fab x-small text @click.stop="editChannelPending(room)"><v-icon>mdi-cog</v-icon></v-btn>
				<v-btn text fab x-small @click.stop="leaveChannelPending(room)"><v-icon>mdi-close</v-icon></v-btn>
			</v-list-item>
		</v-list>
		<v-footer absolute pad outlined>
			<v-menu
				:close-on-content-click="true"
				top
				offset-y
				transition="slide-y-reverse-transition"
				>
				<template #activator="{ on, attrs }">
					<v-btn class="wide" text color="white" v-bind="attrs" v-on="on">
						<v-list-item-icon>
							<v-icon>{{ userIcon }}</v-icon>
							<v-list-item-title>{{ userStatus }}</v-list-item-title>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>{{ userName }}</v-list-item-title>
						</v-list-item-content>
					</v-btn>
				</template>

					<!-- USER STATUS MENU -->
					<v-card>
						<v-list>
							<v-list-item>
								<v-list-item-icon>
									<v-icon>{{ userIcon }}</v-icon>
									<v-list-item-title>{{ userStatus }}</v-list-item-title>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>{{ userName }}</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>

						<v-divider></v-divider>

						<v-list>
							<v-list-item>
								<v-btn @click.stop="updateUserStatus('Online')">Online</v-btn>
							</v-list-item>
							<v-list-item>
								<v-btn @click.stop="updateUserStatus('Away')">Away</v-btn>
							</v-list-item>
							<v-list-item>
								<v-btn @click.stop="updateUserStatus('Busy')">Busy</v-btn>
							</v-list-item>
						</v-list>
					</v-card>
				</v-menu>
		</v-footer>
		</v-navigation-drawer>
		<!-- MEMBERS -->
		<v-navigation-drawer
		clipped
		permanent
		right
		app
		>
		<template #prepend>
			<v-list-item-content>
				<v-list-item-title>Members</v-list-item-title>
			</v-list-item-content>
		</template>
		<v-divider></v-divider>
		<v-list dense>
			<v-list-item
			v-for="member in members"
			:key="member.name"
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
						<v-list-item-icon>
							<v-icon>{{ member.icon }}</v-icon>
							<v-list-item-title>{{ OnlineStatus(member.online) }}</v-list-item-title>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>{{ member.name }}</v-list-item-title>
						</v-list-item-content>
					</v-btn>
				</template>

					<!-- MEMBER CARD MENU -->
					<v-card>
						<v-list>
							<v-list-item>
								<v-list-item-icon>
									<v-icon>{{ member.icon }}</v-icon>
									<v-list-item-title>{{ OnlineStatus(member.online) }}</v-list-item-title>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>{{ member.name }}</v-list-item-title>
									<v-list-item-subtitle>{{member.status }}</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-list>

						<v-divider></v-divider>

						<v-list>
							<v-list-item>
								<v-btn @click.stop="openPrivateChat(member)">Private chat</v-btn>
							</v-list-item>
							<v-list-item>
								<v-btn @click.stop="inviteToPlay(member)">Invite to a match</v-btn>
							</v-list-item>
							<v-list-item>
								<v-btn @click.stop="sendFriendRequest(member)">Send friend request</v-btn>
							</v-list-item>
							<v-list-item v-if="admin && member.name != userName">
								<v-btn @click.stop="banFromChannel(member)">Remove from channel</v-btn>
							</v-list-item>
							<v-list-item v-if="member.name !== userName">
								<v-list-item-title>Blocked</v-list-item-title>
								<v-checkbox v-model="member.blockSwitch" dense @change="switchBlock(member)"></v-checkbox>
							</v-list-item>
							<v-list-item v-if="admin">
								<v-list-item-title>Admin</v-list-item-title>
								<v-checkbox v-model="member.adminSwitch" dense @change="switchAdmin(member)"></v-checkbox>
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
			<v-dialog
				v-model="leaveChannelDialog"
				max-width="400px"
				>
				<v-card>
					<v-card-text class="text-center">
						<div class="white--text dialogTitle">Do you really want to leave this channel ?</div>
					</v-card-text>

					<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn
						text
						color="grey"
						@click="leaveChannelDialog = false"
					>
						CANCEL
					</v-btn>
					<v-btn
						text
						color="red"
						@click="leaveChannelConfirmed()"
					>
						LEAVE
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- CHANNEL CREATION DIALOG -->
			<v-dialog
				v-model="createChannelDialog"
				max-width="400px"
				>
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
							:rules="channelNameRules"
							@keydown.enter.prevent="newChannelConfirmed()"
							></v-text-field>
						<v-card-text class="text-center">
							<div class="white--text dialogTitle">Password :</div>
						</v-card-text>
						<v-text-field
							v-model="newChannel.password"
							dense
							hide-details
							solo
							placeholder="leave blank for open channel"
							clearable
							clear-icon="mdi-close-circle"
							:append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
							:type="!showPassword ? 'password' : 'text'"
							@click:append="showPassword = !showPassword"
							></v-text-field>
						<v-spacer></v-spacer>
						<v-list-item>
							<v-list-item-title>Private channel</v-list-item-title>
							<v-checkbox v-model="editChannel.private"></v-checkbox>
						</v-list-item>
					<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn
						text
						color="grey"
						@click="createChannelDialog = false"
					>
						CANCEL
					</v-btn>
					<v-btn
						text
						color="red"
						@click="newChannelConfirmed()"
					>
						CREATE
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- CHANNEL CONTROL PANEL DIALOG -->
			<v-dialog
				v-model="editChannelDialog"
				max-width="400px"
				>
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
							:rules="channelNameRules"
							></v-text-field>
					<v-card-text class="text-center">
						<div class="white--text dialogTitle">Password :</div>
					</v-card-text>
						<v-text-field
							v-model="newChannel.password"
							dense
							hide-details
							solo
							placeholder="leave blank for open channel"
							clearable
							clear-icon="mdi-close-circle"
							:append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
							:type="!showPassword ? 'password' : 'text'"
							@click:append="showPassword = !showPassword"
							></v-text-field>
						<v-spacer></v-spacer>
						<v-list-item>
							<v-list-item-title>Private channel</v-list-item-title>
							<v-checkbox v-model="editChannel.private"></v-checkbox>
						</v-list-item>
					<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						text
						color="grey"
						@click="editChannelDialog = false"
					>
						CANCEL
					</v-btn>
					<v-btn
						text
						color="green"
						@click="editChannelConfirmed()"
					>
						SAVE AND QUIT
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-container v-if="inChannel">
			<v-list-item-content>
				<v-list-item-title>{{activeChannel.channel.id}} - {{activeChannel.channelName}}</v-list-item-title>
			</v-list-item-content>
				<v-divider></v-divider>
				<v-row>
					<v-list-item v-for="(message, index) in activeChannel.messages" :key=index two-line app>
						<v-list-item-content>
							<v-list-item-title>{{activeChannel.channel.sessionId}}</v-list-item-title>
							<v-list-item-subtitle>> {{message.Content}}</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-row>
			</v-container>
		</v-main>
		<!-- INPUT ZONE -->
		<v-footer
		v-if="inChannel"
		app
		inset>
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