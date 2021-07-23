// бот, автоматически действующий как игрок
import {AbstractAgent} from "./abstract-agent";
import {getRandomInt, shakeArray} from "../extension-functions";
import {Game} from "../game";
import {TCardInd} from "../types";
import seedrandom from "seedrandom";

export class BotAgent extends AbstractAgent {
	private readonly random: { (): number };

	constructor(
		private readonly seed: string
	) {
		super();
		this.random = seedrandom(seed.toString());
	}

	setHand(cards: TCardInd[]) {}

	setStacks(stacks: TCardInd[][]) {}

	async selectCard(cards) {
		return 0
	}

	async programming(): Promise<[0, number]> {
		return [0, getRandomInt(this.random, -2, 6)];
	}

	async chooseRotate(rotateArray) {
		return 0
	}

	async selectCells(arr, highlight, count) {
		return this.botAI(arr, count)
	}

	async selectStacks(arr, count) {
		return this.botAI(arr, count)
	}

	// todo улучшить интеллект бота
	private botAI(arr, count) {
		let selectIndexes: number[] = []
		for (let i = 0; i < arr.length; i++) {
			selectIndexes.push(i);
		}
		shakeArray(selectIndexes, this.random);
		let res: number[] = []
		for (let i = 0; i < count; i++) {
			res[i] = selectIndexes[i];
		}
		return res;
	}
}
