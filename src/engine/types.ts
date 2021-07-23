//

export enum ECardType {Fire, Computer, Metal, Electro, Deffect}

export enum ETileType {Grass, Base, Runes, Target, _length}

export enum EUnitType {Hero, Creep, Bomb}

// const ramsType = {Hero: true, Creep: false, Bomb: true};
export enum EHighlight {Rotate, Move, Attack, Hook}

export enum ERotation {_0, _90, _180, _270, _length}

export type TUserId = any
export type TCardInd = number
// 0..5
export type TStackInd = number

export interface IVector {
	x: number,
	y: number
}
