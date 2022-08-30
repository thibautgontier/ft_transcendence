<template>
	  <v-menu
		v-model="menu"
		open-on-hover
		:close-on-content-click="true"
		left
		offset-x
		transition="slide-x-reverse-transition"
	  >
		<template #activator="{ on, attrs }">
			<v-btn color="black" v-bind="attrs" v-on="on">
				<v-list-item-icon>
					<v-icon>{{ icon }}</v-icon>
					<v-list-item-title>{{ OnlineStatus(online) }}</v-list-item-title>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ name }}</v-list-item-title>
				</v-list-item-content>
			</v-btn>
		</template>
  
		<v-card>
		  <v-list>
			<v-list-item>
				<v-list-item-icon>
					<v-icon>{{ icon }}</v-icon>
					<v-list-item-title>{{ OnlineStatus(online) }}</v-list-item-title>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ name }}</v-list-item-title>
					<v-list-item-subtitle>{{status }}</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		  </v-list>
  
		  <v-divider></v-divider>
  
		  <v-list>
			<v-list-item>
				<v-btn>Private chat</v-btn>
			</v-list-item>
			<v-list-item>
				<v-btn>Invite to a match</v-btn>
			</v-list-item>
			<v-list-item>
				<v-btn>Send friend request</v-btn>
			</v-list-item>
		  </v-list>
		</v-card>
	  </v-menu>
  </template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
	},
	data () {
		return {
			menu: false,
			name: 'name',
			online: true,
			icon: 'mdi-account',
			status: "status-placeholder"
		}
	},
	methods: {
		OnlineStatus (online:boolean) {
			if (online === true)
				return "🟢";
			return "🔴";
		},
	}
})
</script>

<style>
	wide {
		width: 1px
	}
</style>