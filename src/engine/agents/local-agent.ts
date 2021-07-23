import {AbstractAgent} from "./abstract-agent";
import {Game} from "../game";
import {AbstractNetwork} from "../networks/abstract-network";
import {EHighlight, ERotation, TCardInd, TStackInd} from "../types";
import {Cell} from "../cell";
import {uuid} from "../extension-functions";
import {AbstractRender} from "../renders/abstract-render";
import seedrandom from "seedrandom";

/* get input from local user and send to others */
export class LocalAgent extends AbstractAgent {
	private readonly random: { (): number };

	constructor(
		private readonly seed: string,
		private readonly network: AbstractNetwork,
		private readonly render: AbstractRender,
	) {
		super();
		this.random = seedrandom(seed.toString());
	}

	setStacks(stacks: TCardInd[][]): void {
		this.render.setStacks(stacks)
	}

	setHand(cards: TCardInd[]) {
		this.render.setHand(cards)
	}

	async chooseRotate(rotateArray: ERotation[]): Promise<number> {
		const res = await this.render.chooseRotate(rotateArray)
		await this.network.sendAction(uuid(this.random), res)
		return res
	}

	async programming(): Promise<[number, number]> {
		const res = await this.render.programming()
		await this.network.sendAction(uuid(this.random), res)

		return res
	}

	async selectCard(cards: TCardInd[]): Promise<number> {
		const res = await this.render.selectCard(cards)
		await this.network.sendAction(uuid(this.random), res)
		return res
	}

	async selectCells(cells: Cell[], highlight: EHighlight, count: number): Promise<number[]> {
		const res = await this.render.selectCells(cells, highlight, count)
		await this.network.sendAction(uuid(this.random), res)
		return res
	}


	async selectStacks(stacks: TStackInd[], count: number): Promise<number[]> {
		const res = await this.render.selectStacks(stacks, count)
		await this.network.sendAction(uuid(this.random), res)
		return res
	}


}
