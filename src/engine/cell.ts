import {Unit} from "./unit";

export class Cell {

	constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly type: any,
	) {}

	private _unit: Unit | null = null;
	public stop = false; // Проверка, можно ли продвинуть юнита вперед

	set unit(value: Unit) {
		if (this._unit !== null) throw "unit has been planted";
		this._unit = value;
	}

	public hasUnit() {
		return this._unit !== null;
	};

}
