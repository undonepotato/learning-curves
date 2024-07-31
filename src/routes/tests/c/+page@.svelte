<script lang="ts">
	// https://github.com/sveltejs/kit/issues/627#issuecomment-1476107937

	import Layout from '../+layout.svelte';
	import { TestStates, testState } from '../test-state';
	import { onDestroy } from 'svelte';
	import Timer from '../timer.svelte';

	let successfulSequences = 0;
	let failedSequences = 0;
	let historicalSequences: Map<number, boolean | null> = new Map();

	let currentSequence: number[] = [];
	let inputtedSequence: number[] = [];

	let isAcceptingInput = false;

	let boxes: boolean[] = new Array(9).fill(false);

	type Range = {
		min: number;
		max: number;
	};

	function randomIntRange(range: Range) {
		return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
	}

	function activateBox(idx: number, timeout: number) {
		boxes[idx] = true;
		setTimeout(() => {
			boxes[idx] = false;
		}, timeout);
	}

	function activateRandomBoxesSuccession(num: number, timeout: number): Promise<number[]> {
		// inefficient and very weird but I don't care honestly
		return new Promise((resolve) => {
			let randInt: number;

			let boxesLog: number[] = [];

			let count = 0;

			for (let i = 0; i < num; i++) {
				setTimeout(
					() => {
						randInt = randomIntRange({ min: 0, max: 8 });
						boxesLog.push(randInt);
						activateBox(randInt, timeout);
						count++;
						if (count === num) {
							resolve(boxesLog);
						}
					},
					(timeout + 100) * i
				);
			}
		});
	}

	const unsubscribe = testState.subscribe(async (value) => {
		if (value == TestStates.Running) {
			historicalSequences.set(performance.now(), null);
			setTimeout(() => {
				activateRandomBoxesSuccession(4, 150).then((value) => {
					currentSequence = value;
					isAcceptingInput = true;
				});
			}, 1000);
		}

		if (value == TestStates.Ended) {
			historicalSequences.set(performance.now(), null);
			localStorage.setItem(
				'test-c-results',
				JSON.stringify(Object.fromEntries(historicalSequences))
			);
		}
	});

	function testInputtedSequence(): boolean {
		if (currentSequence.toString() == inputtedSequence.toString()) {
			return true;
		}
		return false;
	}

	function switchToDisplay() {
		currentSequence = [];
		inputtedSequence = [];
		isAcceptingInput = false;

		activateRandomBoxesSuccession(4, 150).then((value) => {
			currentSequence = value;
			isAcceptingInput = true;
		});
	}

	onDestroy(unsubscribe);

	testState.set(TestStates.NotStarted);
</script>

<Layout>
	<div slot="pre-start">
		<header id="pre-start-header"><h1 id="pre-start-heading">Test C (60s)</h1></header>
	</div>

	<div slot="test">
		<Timer
			time={60}
			on:time-ended={() => {
				testState.set(TestStates.Ended);
			}}
		></Timer>
		<p id="test-instructions">
			Memorize the sequence and repeat it. Be as fast as possible. Do not input an incorrect
			sequence.
		</p>
		<p id="sequences-failed">Sequences failed: {failedSequences}</p>
		<div id="test-div-container">
			<div id="test-div">
				<div id="boxes-grid">
					{#each boxes as box, i}
						<button
							id="box-{i}"
							class="box"
							class:active={boxes[i]}
							on:click={() => {
								if (isAcceptingInput && currentSequence.length) inputtedSequence.push(i);
							}}
						></button>
					{/each}
				</div>
				<p id="sequence-state" style:color={isAcceptingInput ? '#485bcd' : '#7e7e7e'}>
					{isAcceptingInput ? 'Input Sequence Now' : 'Displaying Sequence'}
				</p>
				<button
					id="test-submit-button"
					on:click={() => {
						if (testInputtedSequence()) {
							successfulSequences++;
							historicalSequences.set(performance.now(), true);
						} else {
							failedSequences++;
							historicalSequences.set(performance.now(), false);
						}
						switchToDisplay();
					}}>Enter</button
				>
			</div>
		</div>
	</div>

	<div slot="finish">
		<div id="finish-div">
			<p id="finish-instructions">
				Thank you! Your results have been saved. When ready, view your results for all three tests.
			</p>
			<a href="../results" id="next-button">View Results</a>
		</div>
	</div>
</Layout>

<style>
	#pre-start-header {
		display: flex;
		inline-size: 100%;

		justify-content: center;
	}
	#pre-start-heading {
		position: absolute;
		text-align: center;
		margin-block-start: 0;
	}

	#test-instructions,
	#sequence-state,
	#finish-instructions {
		text-align: center;
		font-size: 1.5rem;
	}

	#finish-div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;

		margin: 2rem;

		block-size: calc(100vh - 5rem);
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

	#finish-instructions {
		text-align: center;
		font-size: 1.5rem;
	}

	#sequences-failed {
		text-align: center;
		font-size: 1.5rem;
		color: var(--accent);
	}
	.box {
		size: 100% / 100%;
		background: var(--secondary);

		border: none;
		border-radius: 10px;
	}

	.active,
	.box:active {
		transition: 0.1s;
		background: var(--primary);
	}

	#test-div-container {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 2rem 1rem;
	}
	#test-div {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		touch-action: manipulation;
	}
	#boxes-grid {
		flex: 1;

		min-block-size: 40vh;
		max-block-size: 70vh;
		max-inline-size: 70vh;

		display: grid;
		grid-template: 1fr 1fr 1fr / 1fr 1fr 1fr;
		aspect-ratio: 1/1;

		gap: 0.5rem;
	}

	#test-submit-button {
		flex: 1;
		font-family: 'Inter', Arial, Helvetica, sans-serif;
		font-size: 1.5rem;
		padding-inline: 2rem;
		color: var(--background);
		background: var(--primary);

		min-block-size: 5rem;

		border: none;
		border-radius: 10px;

		cursor: pointer;

		margin: 1rem 0;
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
