<script lang="ts">
	let valid = true;
	let results: Map<string, string | null> = new Map();

	let dataParagraph: HTMLParagraphElement;

	let rawDataStr = '';
	let downloadDataStr = '';

	let rawResults: Map<string, string | null> = new Map();
	rawResults.set('a', localStorage.getItem('test-a-results'));
	rawResults.set('b', localStorage.getItem('test-b-results'));
	rawResults.set('c', localStorage.getItem('test-c-results'));

	for (let pair of rawResults.entries()) {
		if (pair[1] == null || pair[1] == '{}') {
			valid = false;
			results.set(pair[0], null);
			continue;
		} else {
			results.set(pair[0], JSON.parse(pair[1]));
		}
	}
	rawDataStr = JSON.stringify(Object.fromEntries(results)).replace(/\n/g, '');
	downloadDataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(rawDataStr);
</script>

<header id="results-header">
	<h1 id="results-heading">Results</h1>
</header>

{#if valid}
	<div id="results-div">
		<p id="results-instructions">
			You can either download the JSON file or copy the text below to communicate your results.
		</p>
		<a id="download-button" class="button-like" href={downloadDataStr} download="test-results.json"
			>Download</a
		>
		<div id="results-text-div">
			<div id="results-text-button-bar">
				<button
					id="results-text-button-copy"
					on:click={(e) => {
						navigator.clipboard.writeText(rawDataStr);
						e.currentTarget.textContent = 'Copied!';

						let target = e.currentTarget;

						setTimeout(() => {
							target.textContent = 'Copy';
						}, 1000);
					}}>Copy</button
				>
			</div>
			<p id="results-text" bind:this={dataParagraph}>{rawDataStr}</p>
		</div>
	</div>
{:else}
	<div id="error-div">
		<p id="error-text">
			You're missing results in one or more tests. Go back and complete the test(s) below.
		</p>
		{#each results as pair}
			{#if pair[1] == null}
				<a id="test-button-{pair[0]}" class="button-like" href="tests/{pair[0]}"
					>Test {pair[0].toUpperCase()}</a
				>
			{/if}
		{/each}
	</div>
{/if}

<style>
	#results-header {
		display: flex;
		inline-size: 100%;

		justify-content: center;
	}
	#results-heading {
		text-align: center;
		margin: 0;
	}

	#results-div,
	#error-div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;

		margin: 2rem;
	}
	#results-instructions {
		text-align: center;
		font-size: 1.5rem;
	}

	.button-like {
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

	#download-button:hover {
		color: var(--text);
		cursor: pointer;
	}

	#results-text-div > * {
		margin: 0;
	}

	#results-text {
		text-align: left;
		font-size: 1.5rem;
		font-family: 'Inconsolata', monospace;
		overflow-wrap: anywhere;

		background: #bebfc6;
		color: var(--text);

		border-radius: 10px 0px 10px 10px;

		padding: 1rem;
	}

	#results-text-button-bar {
		display: flex;
		justify-content: right;
	}

	#results-text-button-bar > button {
		font-size: 1.5rem;

		padding: 0.5rem 1rem;

		border: none;
	}

	#results-text-button-copy {
		border-radius: 10px 10px 0px 0px;

		background: var(--primary);
		color: var(--background);
	}

	#results-text-button-copy:hover {
		color: var(--text);
		cursor: pointer;
	}

	#results-text-button-copy:active {
		color: var(--text);
		background: #3043b0;
	}

	#test-button-a {
		background: var(--primary);
		color: var(--background);
	}

	#test-button-b {
		background: var(--secondary);
		color: var(--text);
	}

	#test-button-c {
		background: var(--accent);
		color: var(--text);
	}
</style>
