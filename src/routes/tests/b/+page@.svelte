<script lang="ts">
	import Layout from '../+layout.svelte';
	import { TestStates, testState } from '../test-state';
	import { onDestroy } from 'svelte';

	const randomClickTarget: Range = { min: 2, max: 9 };

	let successfulEntries = 0;
	let failedEntries = 0;
	let historicalEntries: Map<number, boolean | null> = new Map();

	let currentClicked = 0;
	let currentTarget = randomIntRange(randomClickTarget);

	type Range = {
		min: number;
		max: number;
	};

	function randomIntRange(range: Range) {
		return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
	}

	const unsubscribe = testState.subscribe(async (value) => {
		if (value == TestStates.Running) {
			historicalEntries.set(performance.now(), null);
		}

		if (value == TestStates.Ended) {
			localStorage.setItem('test-b-results', JSON.stringify(Object.fromEntries(historicalEntries)));
		}
	});

	onDestroy(unsubscribe);

	testState.set(TestStates.NotStarted);
</script>

<Layout>
	<div slot="test">
		<p id="test-instructions">
			Click the button the specified number of times (exactly) as fast as possible and then click
			Enter.
		</p>
		<p id="entries-failed">Entries failed: {failedEntries}</p>
		<div id="test-div-container">
			<div id="test-div">
				<button
					id="test-button"
					on:click={(e) => {
						currentClicked++;
					}}>{currentTarget}</button
				>
				<button
					id="test-submit-button"
					on:click={(e) => {
						if (currentClicked === currentTarget) {
							successfulEntries++;
							historicalEntries.set(performance.now(), true);
						} else {
							failedEntries++;
							historicalEntries.set(performance.now(), false);
						}
						currentTarget = randomIntRange(randomClickTarget);
						currentClicked = 0;
					}}>Enter</button
				>
			</div>
		</div>
	</div>

	<div slot="next-button"><a href="c" id="next-button">Next</a></div>
</Layout>

<style>
	#test-instructions {
		text-align: center;
		font-size: 1.5rem;
	}

	#next-button {
		border-radius: 10px;
		border: none;

		padding: 1.5rem 3rem;

		font-size: 1.5rem;
		font-family: 'Inter', Arial, Helvetica, sans-serif;
		color: var(--background);
		background: var(--primary);
		text-decoration: none;

		cursor: pointer;
	}

	#entries-failed {
		text-align: center;
		font-size: 1.5rem;
		color: var(--accent);
	}

	#test-div-container {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 2rem 1rem;
	}
	#test-div {
		flex: 1;
		block-size: 60vh;

		display: flex;
		flex-direction: column;
	}

	#test-button {
		block-size: 100%;
		inline-size: 100%;
		font-family: 'Inter', Arial, Helvetica, sans-serif;
		font-size: 6em;
		color: var(--text);
		background: var(--secondary);

		border: none;
		border-radius: 20px;

		cursor: pointer;
		touch-action: manipulation;
	}

	#test-button:hover {
		color: var(--background);
	}

	#test-button:active {
		transition: 0.1s;
		color: var(--background);
		background: #d973bc;
	}

	#test-submit-button {
		flex: 1;
		font-family: 'Inter', Arial, Helvetica, sans-serif;
		font-size: 1.5rem;
		color: var(--background);
		background: var(--primary);

		min-block-size: 5rem;

		border: none;
		border-radius: 10px;

		cursor: pointer;

		margin: 2rem 0 1rem 0;
		touch-action: manipulation;
	}

	#test-submit-button:hover {
		color: var(--text);
	}

	#test-submit-button:active {
		color: var(--text);
		background: #3043b0;
	}
</style>
