
import {EHighlight, EDirection, TCardInd, TStackInd} from "../types";
import {Cell} from "../cell";

/* users input agent */
export abstract class AbstractAgent {

	abstract setHand(cards: TCardInd[]): void
	abstract setStacks(stacks: TCardInd[][]): void

	abstract selectCard(cards: TCardInd[]): Promise<number>

	abstract programming(): Promise<[number, number]>

	abstract chooseRotate(rotateArray: EDirection[]): Promise<number>

	abstract selectCells(cells: Cell[], highlight: EHighlight, count: number): Promise<number[]>

	abstract selectStacks(stacks: TStackInd[], count: number): Promise<number[]>

}
