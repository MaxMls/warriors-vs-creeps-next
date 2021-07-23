import {AbstractRender} from "./abstract-render";
import {Cell} from "../cell";
import {GameMap} from "../game-map";
import {EHighlight, ERotation, TCardInd, TStackInd} from "../types";

export class VueRender extends AbstractRender{
	chooseRotate(rotateArray: ERotation[]): Promise<number> {
		return Promise.resolve(0);
	}

	defeat(): void {
	}

	hideMessage(): void {
	}

	initUnit(cell: Cell): void {
	}

	killUnit(cell: Cell): void {
	}

	moveUnit(cellFrom: Cell, cellTo: Cell): Promise<void> {
		return Promise.resolve(undefined);
	}

	programming(): Promise<[number, number]> {
		return Promise.resolve([0, 0]);
	}

	renderMap(inputMap: GameMap) {
	}

	selectCard(cards: TCardInd[]): Promise<number> {
		return Promise.resolve(0);
	}

	selectCells(cells: Cell[], highlight: EHighlight, count: number): Promise<number[]> {
		return Promise.resolve([]);
	}

	selectStacks(stacks: TStackInd[], count: number): Promise<number[]> {
		return Promise.resolve([]);
	}

	setHand(cards: TCardInd[]): void {
	}

	setStacks(stacks: TCardInd[][]): void {
	}

	showMessage(text: string): void {
	}

	startTimer(secCount: number): void {
	}

	stopSelect(): void {
	}

	stopTimer(): void {
	}

	updateBombCounter(newVal: number): void {
	}

	updateCellRotate(cell: Cell, orientation: ERotation[]): void {
	}

	updateKillsCounter(newVal: number): void {
	}

}
