<script lang="ts">
	// bad code, whatever
	// https://github.com/sveltejs/kit/issues/627#issuecomment-1476107937

	import Layout from '../+layout.svelte';
	import { TestStates, testState } from '../test-state';
	import { onDestroy, tick } from 'svelte';
	import Timer from '../timer.svelte';
	import { scale } from 'svelte/transition';

	let successfulClicks = 0;
	let failedClicks = 0;
	let historicalClicks: Map<number, boolean | null> = new Map(); // timestamp, whether click was successful

	let requestID: number;
	let mainCanvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let target: Target;
	let click: Coordinate | null;

	type Coordinate = {
		x: number;
		y: number;
	};

	type Range = {
		min: number;
		max: number;
	};

	const unsubscribe = testState.subscribe(async (value) => {
		if (value == TestStates.Running) {
			await tick(); // make sure mainCanvas
			if (mainCanvas) {
				ctx = mainCanvas.getContext('2d') as CanvasRenderingContext2D;

				scaleCanvas(mainCanvas, ctx);
				window.addEventListener('resize', () => {
					scaleCanvas(mainCanvas, ctx);
				});

				const targetRangeWidth: Range = {
					min: 40,
					max: mainCanvas.clientWidth - 40
				};

				const targetRangeHeight: Range = {
					min: 40,
					max: mainCanvas.clientHeight - 40
				};

				historicalClicks.set(performance.now(), null);

				draw(targetRangeWidth, targetRangeHeight);
			}
		} else if (value == TestStates.Ended) {
			cancelAnimationFrame(requestID);
			historicalClicks.set(performance.now(), null);
			localStorage.setItem('test-a-results', JSON.stringify(Object.fromEntries(historicalClicks)));
		}
	});

	onDestroy(unsubscribe);

	testState.set(TestStates.NotStarted);

	function degToRad(deg: number): number {
		return (deg * Math.PI) / 100;
	}

	function randomIntRange(range: Range) {
		return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
	}

	function handleClick(event: MouseEvent) {
		const rect = mainCanvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		click = { x, y };
	}

	function detectTarget(a: Coordinate, targetPos: Coordinate, radius: number) {
		const dx = Math.abs(a.x - targetPos.x);
		const dy = Math.abs(a.y - targetPos.y);
		const distance = Math.sqrt(dx * dx + dy * dy);

		return distance <= radius;
	}

	function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
		ctx.fillStyle = '#f0f1fb';
		ctx.fillRect(0, 0, width, height);
	}

	function scaleCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		canvas.width = canvas.clientWidth * window.devicePixelRatio;
		canvas.height = canvas.clientHeight * window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}

	class Target {
		position: Coordinate;
		redraw: boolean;
		constructor(position: Coordinate) {
			this.position = position;
			this.redraw = false;
		}

		draw(ctx: CanvasRenderingContext2D) {
			ctx.fillStyle = '#485bcd';
			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, 30, degToRad(0), degToRad(360));
			ctx.fill();
		}
	}

	function draw(targetRangeWidth: Range, targetRangeHeight: Range) {
		if (ctx) {
			drawBackground(ctx, targetRangeWidth.max + 40, targetRangeHeight.max + 40);

			if (click) {
				if (detectTarget(click, target.position, 30)) {
					target.redraw = true;
					successfulClicks++;
					historicalClicks.set(performance.now(), true);
				} else {
					failedClicks++;
					historicalClicks.set(performance.now(), false);
				}
				click = null;
			}
		}
		if (!target || target.redraw) {
			target = new Target({
				x: randomIntRange(targetRangeWidth),
				y: randomIntRange(targetRangeHeight)
			});
		}
		target.draw(ctx);
		requestID = requestAnimationFrame(() => {
			draw(targetRangeWidth, targetRangeHeight);
		});
	}
</script>

<Layout>
	<div slot="pre-start">
		<header id="pre-start-header"><h1 id="pre-start-heading">Test A (15s)</h1></header>
	</div>

	<div slot="test">
		<p id="test-instructions">
			Tap on the circles as they appear. Be as fast as possible. Do not miss any targets.
		</p>

		<p id="clicks-failed">Clicks failed: {failedClicks}</p>

		<div id="test-div-container">
			<div id="test-div">
				<canvas id="main-canvas" bind:this={mainCanvas} on:click={handleClick}
					>Your browser doesn't support this feature.</canvas
				>
				<Timer
					time={15}
					on:time-ended={() => {
						testState.set(TestStates.Ended);
					}}
				></Timer>
			</div>
		</div>
	</div>

	<div slot="finish">
		<div id="finish-div">
			<p id="finish-instructions">
				Thank you! Your results have been saved. Please continue to test B.
			</p>
			<a href="b" id="next-button">Next</a>
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

	#clicks-failed {
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

		touch-action: manipulation;
	}

	#main-canvas {
		inline-size: 100%;
		block-size: 100%;
		border: 3px solid var(--secondary);
		border-radius: 20px;
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
</style>
