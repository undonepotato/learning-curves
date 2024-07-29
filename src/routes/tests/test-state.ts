import { writable } from 'svelte/store';

export enum TestStates {
	NotStarted = 1,
	Running,
	Ended
}

export const testState = writable(TestStates.NotStarted);
