import {User} from "./user";
import {ERotation} from "./types";
import {Cell} from "./cell";

export class Unit {

	constructor(public type) {}

	rotation = ERotation._90;
	private _ownerUser: User | null = null;
	set ownerUser(value: User) {
		this._ownerUser = value;
	}

	private _attachedCell: Cell | null = null; // тот кого тащит Unit
	set attachedCell(value: Cell | null) {
		this._attachedCell = value;
	}

	rotate(angle: ERotation) {  // 1: 90, 2: 180, 3: -90(270)
		this.rotation += angle;
		this.rotation %= ERotation._length;
	}
}
