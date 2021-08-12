//

export enum ECardType {Fire, Computer, Metal, Electro, Defect}

export enum ETileType {Grass, Base, Runes, Target, _length}

export enum EUnitType {Hero, Creep, Bomb}

// {Rotate, Move, Attack, Hook}
export enum EHighlight {Rotate, Move, Attack, Hook}

// {Rotate, Move, Attack}
export enum ECardAction {Rotate, Move, Attack}

export enum EDirection {_0, _90, _180, _270, _length}

export enum ERotation {_0, _90, _180, _270, _length}

export const directionToDeg = (d: EDirection | ERotation = EDirection._0) => {
	return [360, 90, 180, 270][d]
}
export const rotateDirection = (dir: EDirection, angle: ERotation) => {
	return (dir + angle) % ERotation._length;
}


export type TUserId = any
export type TCardId = number
// -2 trash <br>
// -1 effect <br>
// 0..5 terminal
export type TStackId = -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5

export interface IVector {
	x: number,
	y: number
}

// const ramsType = {Hero: true, Creep: false, Bomb: true};
//
