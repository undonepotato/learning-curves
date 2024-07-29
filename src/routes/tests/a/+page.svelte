<script lang="ts">
	// bad code, whatever

	import Timer from '../timer.svelte';
	import { afterUpdate } from 'svelte';

	let successfulClicks = 0;
	let failedClicks = 0;
	let historicalClicks: Map<number, boolean | null> = new Map(); // timestamp, whether click was successful

	let requestID: number;
	let mainCanvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let target: Target;
	let click: Coordinate | null;

	let started = false;
	let ended = false;

	type Coordinate = {
		x: number;
		y: number;
	};

	type Range = {
		min: number;
		max: number;
	};

	afterUpdate(() => {
		if (started && !ended) {
			if (mainCanvas) {
				ctx = mainCanvas.getContext('2d') as CanvasRenderingContext2D;

				mainCanvas.width = mainCanvas.clientWidth * window.devicePixelRatio;
				mainCanvas.height = mainCanvas.clientHeight * window.devicePixelRatio;
				ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

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
		} else if (started && ended) {
			cancelAnimationFrame(requestID);
			localStorage.setItem('test-a-results', JSON.stringify(Object.fromEntries(historicalClicks)));
		}
	});

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

{#if !started && !ended}
	<div id="pre-start-div">
		<p id="pre-instructions">
			Follow the instructions given when you click Start. You will have 30 seconds. Your accuracy
			and speed while completing the task will be measured. Be as fast and as accurate as possible.
		</p>
		<button
			id="start-button"
			on:click={(e) => {
				started = true;
			}}>Start</button
		>
	</div>
{:else if started && !ended}
	<Timer
		{started}
		time={30}
		on:time-ended={() => {
			ended = true;
		}}
	></Timer>
	<p id="test-instructions">
		Tap on the circles as they appear. Be as fast as possible. Do not miss any targets.
	</p>

	<p id="clicks-failed">Clicks failed: {failedClicks}</p>

	<div id="test-div-container">
		<div id="test-div">
			<canvas id="main-canvas" bind:this={mainCanvas} on:click={handleClick}
				>Your browser doesn't support this feature.</canvas
			>
		</div>
	</div>
{:else}
	<div id="finish-div">
		<p id="finish-instructions">
			Thank you! Your results have been saved. Please continue to the next test.
		</p>
		<a href="b" id="next-button">Next</a>
	</div>
{/if}

<style>
	#pre-start-div,
	#finish-div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;

		margin: 2rem;

		block-size: calc(100vh - 5rem);
	}
	#pre-instructions,
	#finish-instructions {
		text-align: center;
		font-size: 1.5rem;
	}

	#start-button,
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

	#test-instructions {
		text-align: center;
		font-size: 1.5rem;
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
	}

	#main-canvas {
		inline-size: 100%;
		block-size: 100%;
		border: 3px solid var(--secondary);
		border-radius: 20px;
	}
</style>
