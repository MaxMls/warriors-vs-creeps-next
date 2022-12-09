import { EDirection, EHighlight, ERotation, TCardId, TStackId } from "../types";
import { Cell } from "../cell";

/* users input agent */
export abstract class AbstractAgent {
  abstract setHand(cards: TCardId[]): void;
  abstract setStacks(stacks: TCardId[][]): void;

  abstract selectCard(cards: TCardId[]): Promise<number>;

  abstract programming(stacks: TStackId[]): Promise<[number, number]>;

  abstract chooseRotate(
    rotateArray: ERotation[],
    currentDirection: EDirection
  ): Promise<number>;

  abstract selectCells(
    cells: Cell[],
    highlight: EHighlight,
    count: number
  ): Promise<number[]>;

  abstract selectStacks(stacks: TStackId[], count: number): Promise<number[]>;
}
