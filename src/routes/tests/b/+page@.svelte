<script lang="ts">
	import Layout from '../+layout.svelte';
	import { TestStates, testState } from '../test-state';
</script>

<Layout>
	<div slot="test"></div>

	<div slot="next-button"><a href="c" id="next-button">Next</a></div>
</Layout>

<style>
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
</style>
