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
				{ name: 'Transcendence Team', icon: 'mdi-account-group', id: 2 },
				{ name: 'Les Potos', icon: 'mdi-account-group', id: 3 },
			],
			activeChannel: "Channel"
		};
	},
	methods: {
		status (online:boolean) {
			if (online === true)
				return "🟢";
			return "🔴";
		},
		getChannel (id:number) {
			this.activeChannel = ""
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
		<!-- TOOLBAR -->
		<!-- CHANNEL -->
		<v-main>
			<v-container>
				<v-row>
					<v-list-item two-line app>
						<v-list-item-content>
							<v-list-item-title>Sender</v-list-item-title>
							<v-list-item-subtitle>> Hello</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
					<v-list-item two-line app>
						<v-list-item-content>
							<v-list-item-title>Ben</v-list-item-title>
							<v-list-item-subtitle>> Stylé non ?</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
					<v-list-item two-line app>
						<v-list-item-content>
							<v-list-item-title>Toto</v-list-item-title>
							<v-list-item-subtitle>> À mort gros !</v-list-item-subtitle>
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
			dense
			hide-details
			solo
			type="text"
			placeholder="Type here"
			clearable
			clear-icon="mdi-close-circle"
			append-outer-icon="mdi-send"
			></v-text-field>
		</v-footer>
	</div>
</template>

<style>
	.messages {
		width: 100%;
	}
</style>