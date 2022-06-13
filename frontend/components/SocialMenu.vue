<!-- <template>
	<div>
		<h1> Friends list</h1>
		<ul>
			<li v-for="friend in friends" :key="friend">{{ friend.name }} {{ online(friend.online) }}</li>
		</ul>
	</div>
</template> -->

<template>
  <v-sheet
    height="100%"
    class="overflow-hidden"
    style="position: relative;"
  >
    <v-container class="fill-height">
      <v-row
        align="center"
        justify="center"
      >
        <v-btn
          color="primary"
          dark
          @click.stop="drawer = !drawer"
        >
          Social Menu
        </v-btn>
      </v-row>
    </v-container>

	<v-navigation-drawer
	v-model="drawer"
	absolute
	width="20%"
	>

      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img> 
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
		  @click.stop="submenu = !submenu"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-content>
			  	<v-navigation-drawer
				v-model="submenu"
				absolute
				temporary
				width="100%"
				height="100%"
				margin-left="20%"
				>
					{{ item.link }}
			    </v-navigation-drawer>

          </v-list-item-content>

        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-sheet>
</template>

<script>
	export default {
		data () {
			return {
				friends: [
					{name: 'Thomas', online: true},
					{name: 'Luigi', online: true},
					{name: 'Thibaut', online: false},
				],
				user: 'Jacquet Benjamin',
				drawer: null,
				submenu: null,
				items: [
					{ title: 'Friends', link: '<FriendsMenu />', icon: 'mdi-account-multiple' },
					{ title: 'Chats',  link: '<ChatMenu />', icon: 'mdi-forum' },
					{ title: 'Settings', link: '<SettingsMenu />', icon: 'mdi-cog' },
				],
				links: ['Home', 'Contacts', 'Settings'],
			}
		},
		methods: {
			online: function (status) {
				if (status === true)
					return "🟢";
				return "🔴";
			}
		},
		computed: {

		}
	}
</script>