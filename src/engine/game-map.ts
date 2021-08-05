import {ETileType} from "./types";
import {Cell} from "./cell";

// Структура данных для работы с полем игры
export class GameMap {

	readonly size: { x: number, y: number }

	private map: Cell[][] = [];
	private typesCells: Cell[][] = [];

	constructor(private readonly inputMap) {
		this.size = {x: this.inputMap[0].length, y: this.inputMap.length};

		for (let i = 0; i < ETileType._length; i++) {
			this.typesCells.push([]);
		}


		for (let i = 0; i < inputMap.length; i++) {
			this.map.push([]);
			for (let j = 0; j < inputMap[i].length; j++) {
				let cell = new Cell(j, i, inputMap[i][j]);

				this.map[i][j] = cell;
				this.typesCells[cell.type].push(cell);
			}
		}
	}

	// инициализация


	// Возвращает объект клетки(Cell) по координатам (x, y)
	getCell(x, y) {
		return this.map?.[y]?.[x] ?? null;
	};

	// Возвращает все объекты клетки типа tileType (new Cell[])
	getAllCellsByType(type) {
		return this.typesCells[type];
	};

	// Возвращает все объекты клетки типа unitType (new Unit[])
	getAllCellHasUnits(type) {
		let retArray: Cell[] = [];
		for (let row of this.map) {
			for (let cell of row) {
				if (cell.hasUnit() && cell?.unit?.type === type) {
					retArray.push(cell);
				}
			}
		}
		return retArray;
	};

	// Перемещает, если не может, возвращает null иначе клетку в которую переместил
	moveUnitFromCellToCoords(cellFrom: Cell, x: number, y: number) {

		//console.trace()
		let cellTo = this.getCell(x, y);
		if (cellTo === null) return null;
		if (cellTo.hasUnit()) return null;
		cellTo.unit = cellFrom.unit;
		cellFrom.killUnit();
		return cellTo;
	}
}
