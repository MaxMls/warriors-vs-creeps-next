import { GameMap } from "../game-map";
import { EDirection, EHighlight, ERotation, TCardId, TStackId } from "../types";
import { Cell } from "../cell";
import { Unit } from "../unit";

/* UI render */
export abstract class AbstractRender {
  abstract renderMap(inputMap: GameMap);

  abstract moveUnit(unit: Unit, cellTo: Cell): Promise<void>;

  abstract initUnit(cell: Cell): void;

  abstract killUnit(cell: Cell): void;

  abstract stopSelect(): void;

  /*	let timerId = null;*/
  abstract startTimer(secCount: number): void;

  abstract stopTimer(): void;

  abstract setHand(cards: TCardId[]): void;

  // cards - Массив 6x3 карт в стеках [ [down, center, top], ... ] int id типы карт
  abstract setStacks(stacks: TCardId[][]): void;

  // last message, defeat or win or error
  abstract error(message: string): void;

  abstract defeat(message?: string): void;

  abstract win(): void;

  abstract showMessage(text: string): void;

  abstract hideMessage(): void;

  abstract updateBombCounter(newVal: number): void;

  abstract updateKillsCounter(newVal: number): void;

  abstract updateHeroDirection(cell: Cell, orientation: EDirection): void;

  // wait for user input gui:

  abstract selectCard(cards: TCardId[]): Promise<number>;

  // callback принимает номер карты в руке и номер стека
  abstract programming(stacks: TStackId[]): Promise<[number, number]>;

  abstract chooseRotate(
    rotateArray: ERotation[],
    currentDirection: EDirection
  ): Promise<number>;

  // cellsArray[i] = {x:X, y:Y, higlight:/0, 1, 2/, isSelected}
  // callback Возвращает id ячеек в массиве cellsArray, на которые кликнули
  // count - количество ячеек
  abstract selectCells(
    cells: Cell[],
    highlight: EHighlight,
    count: number
  ): Promise<number[]>;

  abstract selectStacks(stacks: TStackId[], count: number): Promise<number[]>;
}
