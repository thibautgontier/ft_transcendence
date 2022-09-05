<script lang="ts">
import Vue from 'vue'
import * as Colyseus from "colyseus.js";
export default Vue.extend({
	data() : any {
		return {
			members: [
				{ name: "Ben", online: true, icon: "mdi-account", status: "ajoute des menus", menu: false, blocked: false},
				{ name: "Toto", online: true, icon: "mdi-account", status: "ajoute Colyseus", menu: false, blocked: true },
				{ name: "Luigi", online: false, icon: "mdi-account", status: "travaille au foodtruck", menu: false, blocked: false },
			],
			channels: [
				{ name: "Toto", icon: "mdi-account", id: 1 },
				{ name: "Transcendence Team", icon: "mdi-account-group", id: 2 },
				{ name: "Les Potos", icon: "mdi-account-group", id: 3 },
			],
			activeChannel: "Channel",
			admin: true,
			leaveDialog: false,
			createDialog: false,
			inChannel: false,
			client: Colyseus.Client,
			room: Colyseus.Room,
			leavingRoom: Colyseus.Room,
			newChannelName: '',
			myMessage: '',
			receivedMessage: '',
			messages: [],
			rooms: []
		};
	},
	head(): {} {
		const title = "Transcendence - Chat";
		return {
			title,
		};
	},
	computed: {
	},
	mounted() {
		this.createClient()
	},
	methods: {
		leaveChannelDialog(leaving : Colyseus.Room) : void{
			this.leaveDialog = !this.leaveDialog
			this.leavingRoom = leaving
		},
		leaveChannelConfirmed(leaving: Colyseus.Room) {
			this.leaveDialog = false
			leaving.leave();
			const index = this.rooms.indexOf(leaving)
			this.rooms.splice(index, 1)
			if (this.rooms.length === 0)
				this.inChannel = false
		},
		async newChannelConfirmed() {
			try {
				this.room = await this.client.create('ChatRoom');
				console.log('chan name:', this.newChannelName)
				console.log('room id:', this.room.id)
				console.log(this.room.sessionId, "joined", this.room.id)
				this.rooms.push(this.room)
				this.inChannel = true;
			}
			catch (e) {
				console.error("join error", e);
			}
			this.newChannelName = ''
			this.createDialog = false
			this.room.onMessage("Message", (message : any) => {
				this.messages.push(message)
			})
			this.room.onMessage("roomId", (message : any) => {
				// console.log(message)
			})
		},
		OnlineStatus(online: boolean) {
			if (online === true)
				return "🟢"
			return "🔴"
		},
		async createClient() {
			try {
				this.client = new Colyseus.Client('ws://localhost:3000')
				console.log(this.client)
			}
			catch(e){
				console.log("Create Client ERROR", e);
			}
		},
		sendMessage() : void {
			if (this.myMessage === '')
				return
			this.room.send("Message" , this.myMessage)
			this.myMessage=''
		},
		listenMessages() : void {

		},
		getChannel() {

		},
		openPrivateChat() {

		},
		inviteToPlay() {

		},
		sendFriendRequest() {

		},
		blockUser() {

		},
		unblockUser() {

		},
		banFromChannel() {

		}
	},
})
</script>

<template>
	<div>
		<!-- EXIT ARROW -->
		<!-- FRIENDS AND GROUP CHATS -->
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
				<v-btn text color="white" @click.stop="createDialog=true">New</v-btn>
			</v-list-item>
		</template>
		<v-divider></v-divider>
		<v-list dense>
			<v-list-item
			v-for="(activeRoom, index) in rooms"
			:key="index"
			@click.stop="room = activeRoom"
			>
				<!-- <v-list-item-icon>
					<v-icon>{{ channel.icon }}</v-icon>
				</v-list-item-icon> -->
				<v-list-item-content>
					<v-list-item-title>{{ activeRoom.name }}</v-list-item-title>
				</v-list-item-content>
				<v-btn text color="white" x-small @click.stop="leaveChannelDialog(activeRoom)">x</v-btn>
			</v-list-item>
		</v-list>
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
				:close-on-content-click="true"
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
							<v-list-item>
								<v-btn v-if="!member.blocked" @click.stop="blockUser()">Block user</v-btn>								
								<v-btn v-else @click.stop="unblockUser(member)">Unblock user</v-btn>
							</v-list-item>
							<v-list-item v-if="admin">
								<v-btn @click.stop="openPrivateChat(member)">Ban from channel</v-btn>
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
			<v-dialog
				v-model="leaveDialog"
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
						@click="leaveDialog = false"
					>
						CANCEL
					</v-btn>
					<v-btn
						text
						color="red"
						@click="leaveChannelConfirmed(room)"
					>
						LEAVE
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog
				v-model="createDialog"
				max-width="400px"
				>
				<v-card>
					<v-card-text class="text-center">
						<div class="white--text dialogTitle">Channel name :</div>
					</v-card-text>
						<v-text-field
							v-model="newChannelName"
							dense
							hide-details
							solo
							required
							type="text"
							placeholder="Channel name"
							clearable
							clear-icon="mdi-close-circle"
							clear-icon-color="black"
							@keydown.enter.prevent="newChannelConfirmed()"
							></v-text-field>
					<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn
						text
						color="grey"
						@click="createDialog = false"
					>
						CANCEL
					</v-btn>
					<v-btn
						text
						color="red"
						@click="newChannelConfirmed(room)"
					>
						CREATE
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-container v-if="inChannel">
			<v-list-item-content>
				<v-list-item-title>{{room.id}} - {{room.name}}</v-list-item-title>
			</v-list-item-content>
				<v-divider></v-divider>
				<v-row>
					<v-list-item v-for="(message, index) in messages" :key=index two-line app>
						<v-list-item-content>
							<v-list-item-title>{{room.sessionId}}</v-list-item-title>
							<v-list-item-subtitle>> {{message}}</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-row>
			</v-container>
		</v-main>
		<!-- INPUT ZONE -->
		<v-footer
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