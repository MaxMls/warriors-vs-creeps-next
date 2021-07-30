//

export enum ECardType {Fire, Computer, Metal, Electro, Defect}

export enum ETileType {Grass, Base, Runes, Target, _length}

export enum EUnitType {Hero, Creep, Bomb}

// {Rotate, Move, Attack, Hook}
export enum EHighlight {Rotate, Move, Attack, Hook}

// {Rotate, Move, Attack}
export enum ECardAction {Rotate, Move, Attack}

export enum EDirection {_0, _90, _180, _270, _length}

export type TUserId = any
export type TCardInd = number
// 0..5
export type TStackInd = number

export interface IVector {
	x: number,
	y: number
}

// const ramsType = {Hero: true, Creep: false, Bomb: true};
//
