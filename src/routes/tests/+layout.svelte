<script lang="ts">
	import { TestStates, testState } from './test-state';
</script>

{#if $testState == TestStates.NotStarted}
	<slot name="pre-start"></slot>
	<div id="pre-start-div">
		<p id="pre-instructions">
			Follow the instructions given when you click Start. Your accuracy and speed while completing
			the task will be measured. Be as fast and as accurate as possible.
		</p>
		<button
			id="start-button"
			on:click={(e) => {
				testState.set(TestStates.Running);
			}}>Start</button
		>
	</div>
{:else if $testState == TestStates.Running}
	<slot name="test"></slot>
{:else}
	<a href="/" id="home-button">Home</a>
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

	#home-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;

		background: var(--secondary);
		color: var(--text);

		border-radius: 5px;
		border: none;

		display: flex;
		justify-content: center;
		align-items: center;

		font-size: 0.75rem;
		padding: 0.5rem;
		text-decoration: none;
	}
</style>
