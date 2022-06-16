<template>
	<div>
		<h1 class="terminal">ft_pong</h1>
	</div>
</template>

<script>

</script>

<style>
	.terminal, h1 {
		color: #fff;
		font-family: monospace;
		font-size: 5rem;
		overflow: hidden; /* Ensures the content is not revealed until the animation */
		border-right: .15rem solid #fff; /* The typwriter cursor */
		white-space: nowrap; /* Keeps the content on a single line */
		letter-spacing: .15rem; /* Adjust as needed */
		animation: 
			typing 1s steps(7, end),
			blink-caret 0.5s step-end infinite;
	}

	/* The typing effect */
	@keyframes typing {
		from { width: 0% }
		to { width: 100% }
	}

	/* The typewriter cursor effect */
	@keyframes blink-caret {
		from, to { border-color: transparent }
		50% { border-color: #fff }
	}
</style>