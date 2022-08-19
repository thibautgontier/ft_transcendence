<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data() {
		return {
			members: [
				{ name: 'Ben', online: true, icon: 'mdi-account' },
				{ name: 'Toto', online: true, icon: 'mdi-account' },
				{ name: 'Luigi', online: false, icon: 'mdi-account' },
			],
			channels: [
				{ name: 'Toto', icon: 'mdi-account', id: 1 },
				{ name: 'Transcendence-Team', icon: 'mdi-account-group', id: 2 },
				{ name: 'Les Potos', icon: 'mdi-account-group', id: 3 },
			],
			activeChannel: "Channel"
		};
	},
	methods: {
		status: function (online:boolean) {
			if (online === true)
				return "🟢";
			return "🔴";
		},
		getChannel: function (id:number) {
			this.activeChannel = ""
		}
	},
})
</script>

<template>
	<v-app>
		<!-- EXIT ARROW -->
		<!-- FRIENDS AND GROUP CHATS -->
		<v-navigation-drawer
		permanent
		clipped
		app
		>
		<template v-slot:prepend>
			<v-list-item-content>
				<v-list-item-title>Conversations</v-list-item-title>
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
			</v-list-item>
		</v-list>
		</v-navigation-drawer>
		<!-- TOOLBAR -->
		<!-- CHANNEL -->
		<v-main>
			<v-list-item two-line>
				<v-list-item-content>
					<v-list-item-title>Sender</v-list-item-title>
					<v-list-item-subtitle>Message</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</v-main>
		<!-- MEMBERS -->
		<v-navigation-drawer
		clipped
		permanent
		right
		app
		>
		<template v-slot:prepend>
			<v-list-item-content>
				<v-list-item-title>Members</v-list-item-title>
			</v-list-item-content>
		</template>
		<v-divider></v-divider>
		<v-list dense>
			<v-list-item
			v-for="member in members"
			:key="member.name"
			@click.stop="redirection_vers_conv_perso"
			>
				<v-list-item-icon>
					<v-icon>{{ member.icon }}</v-icon>
					<v-list-item-title>{{ status(member.online) }}</v-list-item-title>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ member.name }}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
		</v-navigation-drawer>
		<!-- INPUT ZONE -->
		<v-footer
		app
		color="transparent"
		inset>
			<v-text-field
			dense
			hide-details
			solo
			placeholder="Type here"
			></v-text-field>
			<v-btn> <v-icon>mdi-chevron-right</v-icon></v-btn>
		</v-footer>
	</v-app>
</template>

<style>

</style>