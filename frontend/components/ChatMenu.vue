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
			client: Colyseus.Client as any,
			room: Colyseus.Room as any,
			myMessage: '',
			receivedMessage: '',
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
		leaveChannelDialog() : void{
			this.leaveDialog = !this.leaveDialog
		},
		leaveChannelConfirmed() {
			this.leaveDialog = false
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
				this.room = await this.client.joinOrCreate("ChatRoom")
				console.log(this.room.sessionId, "joined", this.room.name)
			}
			catch(e){
				console.log("JOIN ERROR", e); }
		},
		sendMessage() : void {
			if (this.myMessage === '')
				return
			this.room.send("Message" , this.myMessage)
			this.myMessage=''
			this.room.onMessage("Message", (message : any) => {
				this.receivedMessage = message
			})
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
			<v-list-item-content>
				<v-list-item-title>Conversations</v-list-item-title>
				<!-- <v-btn @click.stop="createClient()">Create Client</v-btn> -->
			</v-list-item-content>
		</template>
		<v-divider></v-divider>
		<v-list dense>
			<v-list-item
			v-for="channel in channels"
			:key="channel.name"
			@click.stop="getChannel()"
			>
				<v-list-item-icon>
					<v-icon>{{ channel.icon }}</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ channel.name }}</v-list-item-title>
				</v-list-item-content>
				<v-btn text color="white" x-small @click.stop="leaveChannelDialog()">x</v-btn>
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
						<div class="white--text leaveTitle">Do you really want to leave this channel ?</div>
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
						@click="leaveChannelConfirmed()"
					>
						LEAVE
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-container>
				<v-row>
					<v-list-item two-line app>
						<v-list-item-content>
							<v-list-item-title>Sender</v-list-item-title>
							<v-list-item-subtitle>> Message</v-list-item-subtitle>
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
	.leaveTitle {
		padding-top: 10%;
		font-size: 1rem;
	}
</style>