<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();

	export let time: number;

	let timer = setInterval(() => {
		time--;
	}, 1000);

	setTimeout(() => {
		clearInterval(timer);
		dispatcher('time-ended');
	}, time * 1000);
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
</svelte:head>

<div id="timer-section">
	<div class="material-symbols-outlined">timer</div>
	<span id="time-remaining">{time}s</span>
</div>

<style>
	.material-symbols-outlined {
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 20;
	}

	#timer-section {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.5rem;
	}

	#timer-section > .material-symbols-outlined {
		font-size: 2rem;
	}
</style>
