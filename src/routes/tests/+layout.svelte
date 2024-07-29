<script lang="ts">
	import Timer from './timer.svelte';
	import { TestStates, testState } from './test-state';
</script>

{#if $testState == TestStates.NotStarted}
	<slot name="pre-start"></slot>
	<div id="pre-start-div">
		<p id="pre-instructions">
			Follow the instructions given when you click Start. You will have 30 seconds. Your accuracy
			and speed while completing the task will be measured. Be as fast and as accurate as possible.
		</p>
		<button
			id="start-button"
			on:click={(e) => {
				testState.set(TestStates.Running);
			}}>Start</button
		>
	</div>
{:else if $testState == TestStates.Running}
	<Timer
		time={2}
		on:time-ended={() => {
			testState.set(TestStates.Ended);
		}}
	></Timer>
	<slot name="test"></slot>
{:else}
	<slot name="finish"></slot>
{/if}

<style>
	#pre-start-div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;

		margin: 2rem;

		block-size: calc(100vh - 5rem);
	}
	#pre-instructions {
		text-align: center;
		font-size: 1.5rem;
	}

	#start-button {
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
</style>
