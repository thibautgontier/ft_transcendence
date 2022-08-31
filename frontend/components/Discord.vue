<template>
  <v-app id="inspire">
    <v-app-bar
      app
      clipped-right
      flat
      height="72"
    >
      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field
          dense
          flat
          hide-details
          rounded
          solo-inverted
        ></v-text-field>
      </v-responsive>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      width="300"
    >
      <v-navigation-drawer
        v-model="drawer"
        absolute
        color="grey lighten-3"
        mini-variant
      >
        <v-img
          class="d-block text-center mx-auto mt-4"
		  style="border-radius: 100%"
          size="36"
		  src="https://randomuser.me/api/portraits/men/78.jpg"
        ></v-img>

        <v-divider class="mx-3 my-5"></v-divider>

        <v-icon
          v-for="Menu in Menus"
          :key="Menu"
          class="d-block text-center mx-auto mb-9"
          color="grey darken-3"
          size="28"
		  v-on:click="displaySubMenu()"
        >
		{{ Menu.icon }}
		</v-icon>
      </v-navigation-drawer>

      <v-sheet
        color="grey lighten-5"
        width="100%"
      >
	  </v-sheet>

      <v-list
		style="padding-left: 20%"
        shaped
      >
        <v-list-item
          v-for="Menu in Menus"
          :key="Menu"
		       v-if="Menu.submenu"
          link
        >
          <v-list-item-content>
            <v-list-item-title>Item {{ Menu }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      app
      clipped
      right
    >
      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          link
        >
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <!--  -->
    </v-main>

    <v-footer
      app
      color="transparent"
      height="72"
      inset
    >
      <v-text-field
        background-color="grey lighten-1"
        dense
        flat
        hide-details
        rounded
        solo
      ></v-text-field>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
		return {
			Menus: [
				{ title: 'Friends', submenu:null, link: '<FriendsMenu />', icon: 'mdi-account-multiple' },
				{ title: 'Chats', submenu:null, link: '<ChatMenu />', icon: 'mdi-forum' },
				{ title: 'Settings', submenu:null, link: '<SettingsMenu />', icon: 'mdi-cog' },
			],
		}
	},
	methods: {
		displaySubMenu: function (activated) {
			for (Menu in Menus) {
				Menu.submenu = null;
			}
			activated.submenu = !activated.submenu;
		}
	}
  }
</script>