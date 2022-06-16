<template>
<div class="fade absolute mx-auto">
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
	.fade {
		animation: fade 7s ease-out infinite;
	}

	.pong {
		position: absolute;
		animation: pong 30s infinite linear;
	}

	@keyframes fade {
		0% { opacity: 1; }
		50% { opacity: 0.05; }
		100% { opacity: 1; }
	}

	@keyframes pong {
		0% {
			top: 34%;
			left: 52%;
		}
		8.3% {
			top: 52%;
			left: 90%;
		}
		24.9% {
			top: 85%;
			left: 0%;
		}
		30% {
			top: 70%;
			left: 27%;
		}
		41.5% {
			top: 70%;
			left: 80%;
		}
		58.1% {
			top: 55%;
			left: 0%;
		}
		74.7% {
			top: 13%;
			left: 100%;
		}
		79% {
			top: 1%;
			left: 70%;
		}
		91.3% {
			top: 22%;
			left: 8%;
		}
		100% {
			top: 34%;
			left: 52%;
		}
	}
</style>

<script>

</script>