<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	layout: 'DefaultLayout',
})
</script>

<!-- eslint-disable vue/multi-word-component-names -->
<style>
	body {
		overflow: hidden;
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.2s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
</style>
