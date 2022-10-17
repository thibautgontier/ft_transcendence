<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  data() {
    return {
		accept2fa: 0,
		code: '',
    }
  },
  mounted() {
  },
  methods: {
		get2fa() {
			this.accept2fa = 1;
		},

		send2fa() {
			this.code = '';
		}
  }
})
</script>

<template>
	<v-container fill-height>
		<v-col>
			<v-row justify="center" align="center">
				<PongLogo />
			</v-row>
			<v-row justify="center" align="center" style="margin-top: 10%">
			<h1 v-if="accept2fa">
				<v-text-field
            		label="Enter code"
					v-model="code"
            		filled
					counter
					maxlength="10"
					:append-outer-icon="code.length == 10 ? 'mdi-send' : ''"
					@click:append-outer="send2fa"
          		></v-text-field>
			</h1>
			<h1 v-else>
				<v-btn x-larg color="black" @click.stop="get2fa()">Get 2FA</v-btn>
			</h1>
			</v-row>
		</v-col>
	</v-container>
</template>