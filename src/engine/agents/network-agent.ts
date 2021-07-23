import {AbstractAgent} from "./abstract-agent";
import {EHighlight, ERotation, TCardInd, TStackInd, TUserId} from "../types";

import {AbstractNetwork} from "../networks/abstract-network";
import {Cell} from "../cell";
import {uuid} from "../extension-functions";
import seedrandom from "seedrandom";

/* Агент получающий события через интернет.<br/>
 * Связан с local agents на других пк.<br/>
 * Не отправляет никакие данные.
 * Игнорирует любые аргументы */
export class NetworkAgent extends AbstractAgent {

	private readonly random: { (): number };

	constructor(
		private readonly seed: string,
		private readonly network: AbstractNetwork,
	) {
		super()
		this.random = seedrandom(seed.toString());
	}

	setHand(cards: TCardInd[]) {}

	setStacks(stacks: TCardInd[][]) {}

	async chooseRotate(rotateArray: ERotation[]): Promise<number> {
		return await this.network.waitAction(uuid(this.random))
	}

	async programming(): Promise<[number, number]> {
		return await this.network.waitAction(uuid(this.random))
	}

	async selectCard(cards: TCardInd[]): Promise<number> {
		return await this.network.waitAction(uuid(this.random))
	}

	async selectCells(cells: Cell[], highlight: EHighlight, count: number): Promise<number[]> {
		return await this.network.waitAction(uuid(this.random))
	}

	async selectStacks(stacks: TStackInd[], count: number): Promise<number[]> {
		return await this.network.waitAction(uuid(this.random))
	}

}
