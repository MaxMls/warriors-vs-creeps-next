import {User} from "./user";
import {EDirection, ERotation, EUnitType, rotateDirection} from "./types";
import {Cell} from "./cell";

/*const getLength = (vector) => case (vector) {
	when { x, y, z } -> Math.sqrt(x ** 2 + y ** 2 + z ** 2)
	when { x, y } -> Math.sqrt(x ** 2 + y ** 2)
	when [...etc] -> vector.length
}*/
export class Unit {

	constructor(public type: EUnitType) {}

	direction = EDirection._90;

	private _ownerUser!: User;
	set ownerUser(value) {
		this._ownerUser = value;
	}

	get ownerUser() {
		return this._ownerUser
	}

	private _attachedCell: Cell | null = null; // тот кого тащит Unit
	set attachedCell(value: Cell | null) {
		this._attachedCell = value;
	}

	get attachedCell() {
		return this._attachedCell;
	}

	rotate(angle: ERotation) {
		this.direction = rotateDirection(this.direction, angle);
	}
}
