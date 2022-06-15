<template>
<div class="fade">
    	<svg width="200"
		height="200"
		viewBox="0 0 100 100"
		fill="none"
		stroke="white"
		xmlns="http://www.w3.org/2000/svg"
		style="stroke-width: 0.25px; --darkreader-inline-stroke:#fff;">
			<g style="opacity: 1; transform-origin: 50% center; transform: rotate(-30deg);">
				<ellipse cx="12" cy="50" rx="6" ry="13"></ellipse>
				<ellipse cx="18" cy="50" rx="13" ry="27"></ellipse>
				<ellipse cx="23" cy="50" rx="17" ry="34"></ellipse>
				<ellipse cx="29" cy="50" rx="19" ry="39"></ellipse>
				<ellipse cx="34" cy="50" rx="21" ry="43"></ellipse>
				<ellipse cx="40" cy="50" rx="22" ry="45"></ellipse>
				<ellipse cx="46" cy="50" rx="23" ry="47"></ellipse>
				<ellipse cx="51" cy="50" rx="23" ry="47"></ellipse>
				<ellipse cx="57" cy="50" rx="23" ry="46"></ellipse>
				<ellipse cx="62" cy="50" rx="22" ry="44"></ellipse>
				<ellipse cx="68" cy="50" rx="20" ry="41"></ellipse>
				<ellipse cx="73" cy="50" rx="18" ry="36"></ellipse>
				<ellipse cx="79" cy="50" rx="15" ry="30"></ellipse>
				<ellipse cx="85" cy="50" rx="10" ry="20"></ellipse>
				<ellipse cx="87" cy="50" rx="3" ry="7"></ellipse>
			</g>
		</svg>
    </div>
</template>

<style scoped>

	@keyframes fade {
		/* 0% { opacity: 1; }
		25% { opacity: 0.2; }
		50% { opacity: 1; }
		100% { opacity: 0.2; } */
		from { opacity: 1; }
		to { opacity: 0.05; }
	}
	.fade {
		animation: fade 7s infinite;
	}

</style>

<script>

</script>