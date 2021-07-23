import {ETileType} from "./types";
import {Cell} from "./cell";

// Структура данных для работы с полем игры
export class GameMap {

	private declare readonly _size: { x: number, y: number }
	get size(): { x: number; y: number } {
		return this._size;
	}

	private map: Cell[][] = [];
	private typesCells: Cell[][] = [];

	constructor(private readonly inputMap) {
		this._size = {x: this.inputMap[0].length, y: this.inputMap.length};

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
		if (y < 0 || x < 0 || y >= this.map.length || x >= this.map[y].length)
			return null;
		return this.map[y][x];
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
	moveUnitFromCellToCoords(cellFrom, x, y) {
		let cellTo = this.getCell(x, y);
		if (cellTo === null) return null;
		if (cellTo.hasUnit()) return null;
		cellTo.unit = cellFrom.unit;
		cellFrom.unit = null;
		return cellTo;
	}
}
