<script>
export default {
	data() {
		return {
			url: "",
		}
	},
	mounted () {
		this.loadImg();
	},
	methods: {
		loadImg() {
			this.url = this.$store.state.currentUser.photo;
		}
	},
}
</script>

<template>
	<nav>
		<v-app-bar flat color="transparent" app style="margin-top: 1%;">
		<v-btn fab right>
			<v-avatar size="58">
				<img :src=this.url alt="UserAvatar">
			</v-avatar>
		</v-btn>
			<v-spacer></v-spacer>
		<v-toolbar-title>
			</v-toolbar-title>
		</v-app-bar>
	</nav>
</template
