<div id="title-div">
	<h1 id="title-heading">Learning Curve Experiment</h1>
</div>

<div id="tests-div">
	<a href="tests/a" class="test-button button-like" id="test-button-a">Test A</a>
	<a href="tests/b" class="test-button button-like" id="test-button-b">Test B</a>
	<a href="tests/c" class="test-button button-like" id="test-button-c">Test C</a>
</div>

<style>
	:root {
		overflow: hidden;
	}

	#title-div {
		display: flex;
		justify-content: center;
		align-items: center;
		block-size: calc(100vh - 5rem);
	}

	#title-heading {
		font-size: 3rem;
		text-align: center;
		padding-inline: 2rem;
	}

	#tests-div {
		display: flex;
		justify-content: center;
		gap: 10px;
	}

	.test-button {
		flex: 1;

		block-size: 4rem;
		border-radius: 10px;
		border: none;

		display: flex;
		justify-content: center;
		align-items: center;

		text-decoration: none;
	}

	#test-button-a {
		color: var(--background);
		background: var(--primary);
	}

	#test-button-b {
		color: var(--text);
		background: var(--secondary);
	}

	#test-button-c {
		color: var(--text);
		background: var(--accent);
	}
</style>
