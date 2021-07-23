// Straight - Убивать по прямой   пока не достигнута координата
//const attackType = {Straight, Coordinates}
import {ECardType, ERotation, IVector} from "./types";

export interface ICardLevel {
	// количество возможных целей
	targetCount: number,
	// варианты вектора движения от текущей позиции и поворота
	move: IVector[],
	// Атака пока только после движения
	attack: IVector[],
	// Варианты поворота на выбор, можно выбрать только 1
	rotate: ERotation[]
}

export interface ICard {
	name: string,
	// Элемент карты
	type: ECardType,
	// Эффект накладывается при взятии карты
	// Сложные эффекты обрабатываются отдельно
	effects: string[],
	// Возможности карты зависят от её уровня
	levels: ICardLevel[],
}


export const cardsJSON: ICard[] = [
	{
		name: "Fuel Tank",
		// Эффект накладывается при взятии карты
		type: ECardType.Fire,
		effects: ["FuelTank"], // при желании. функция Сброс карты и атаковать всех в радиусе 1 при получении урона
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move: [],
				attack: [],
				rotate: [
					ERotation._90,
					ERotation._270,
				]
			},
			{// 2 Уровень
				targetCount: 0,
				move: [],
				attack: [],
				rotate: [
					ERotation._90,
					ERotation._180,
					ERotation._270,
				]
			},
			{// 3 Уровень
				targetCount: 0,
				move: [],
				attack: [],
				rotate: [
					ERotation._0,
					ERotation._90,
					ERotation._180,
					ERotation._270,
				]
			}
		]
	},
	{
		name: "Blaze",
		type: ECardType.Fire,
		effects: [],
		levels: [
			{
				targetCount: 2,
				move: [{x: 0, y: 1}],
				attack: [{x: -1, y: 0}, {x: 1, y: 0}],
				rotate: []
			},
			{
				targetCount: 2,
				move: [{x: 0, y: 2}],
				attack: [{x: -1, y: 0}, {x: 1, y: 0}], // Атака в конце хода
				rotate: []
			},
			{
				targetCount: 2,
				move: [{x: 0, y: 3}],
				attack: [{x: -1, y: 0}, {x: 1, y: 0}], // Атака в конце хода
				rotate: []
			}
		]
	},
	{
		name: "Flamespitter",
		type: ECardType.Fire,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 999,
				move: [],
				attack: [{x: 0, y: 1}, {x: 0, y: 2}], // Атака в конце хода
				rotate: []
			},
			{// 2 Уровень
				targetCount: 999,
				move: [],
				attack: [{x: 0, y: 1}, {x: 0, y: 2}, {x: -1, y: 2}, {x: 1, y: 2}], // Атака в конце хода
				rotate: []
			},
			{// 3 Уровень
				targetCount: 999,
				move: [],
				attack: [{x: 0, y: 1}, {x: 0, y: 2}, {x: -1, y: 2}, {x: 1, y: 2}, {x: -1, y: 3}, {x: 0, y: 3}, {
					x: 1,
					y: 3
				}], // Аттака в конце хода
				rotate: []
			}
		]
	},
	{
		name: "Memory Core",
		// +1 карта в раздачу, если ты первый игрок
		type: ECardType.Computer,
		effects: ["FuelTank"],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move: [],
				attack: [],
				rotate: [
					ERotation._90,
					ERotation._270,
				]
			},
			{// 2 Уровень +2 cards
				targetCount: 0,
				move: [],
				attack: [],
				rotate: [
					ERotation._90,
					ERotation._180,
					ERotation._270,
				]
			},
			{// 3 Уровень +3 cards
				targetCount: 0,
				move: [],
				attack: [],
				rotate: [ // 1: 90,  2: 180, 3: 270(-90), 4:360
					ERotation._0,
					ERotation._90,
					ERotation._180,
					ERotation._270,
				]
			}
		]
	},
	{
		name: "Omni Stomp",
		type: ECardType.Computer,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move: [{x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}],
				attack: [],
				rotate: []
			},
			{// 2 Уровень
				targetCount: 0,
				move: [{x: 0, y: 2}, {x: -2, y: 0}, {x: 2, y: 0}],
				attack: [],
				rotate: []
			},
			{// 3 Уровень
				targetCount: 0,
				move: [{x: 0, y: 3}, {x: -3, y: 0}, {x: 3, y: 0}],
				attack: [],
				rotate: []
			}
		]
	},
	{
		name: "Hexmatic Aimbot",
		type: ECardType.Computer,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 1,
				move: [],
				attack: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}, {
					x: -1,
					y: 0
				}, {x: -1, y: 1}],
				rotate: []
			},
			{// 2 Уровень
				targetCount: 1,
				move: [],
				attack: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1},
					{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 2, y: 1}, {x: 2, y: 0}, {x: 2, y: -1}, {x: 2, y: -2}, {x: 1, y: -2},
					{x: 0, y: -2}, {x: -1, y: -2}, {x: -2, y: -2}, {x: -2, y: -1}, {x: -2, y: 0}, {x: -2, y: 1}, {x: -2, y: 2}, {x: -1, y: 2}],
				rotate: []
			},
			{// 3 Уровень
				targetCount: 1,
				move: [],
				attack: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}, {
					x: -1,
					y: 0
				}, {x: -1, y: 1},
					{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 2, y: 1}, {x: 2, y: 0}, {x: 2, y: -1}, {
						x: 2,
						y: -2
					}, {x: 1, y: -2},
					{x: 0, y: -2}, {x: -1, y: -2}, {x: -2, y: -2}, {x: -2, y: -1}, {x: -2, y: 0}, {x: -2, y: 1}, {
						x: -2,
						y: 2
					}, {x: -1, y: 2},
					{x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 3, y: 2}, {x: 3, y: 1}, {x: 3, y: 0}, {
						x: 3,
						y: -1
					},
					{x: 3, y: -2}, {x: 3, y: -3}, {x: 2, y: -3}, {x: 1, y: -3}, {x: 0, y: -3}, {x: -1, y: -3}, {
						x: -2,
						y: -3
					}, {x: -3, y: -3},
					{x: -3, y: -2}, {x: -3, y: -1}, {x: -3, y: 0}, {x: -3, y: 1}, {x: -3, y: 2}, {x: -3, y: 3}, {
						x: -2,
						y: 3
					}, {x: -1, y: 3}],
				rotate: []
			}
		]
	},
	{
		name: "Scythe",
		// Эффект накладывается при взятии карты
		type: ECardType.Metal,
		effects: [], // при желании. функция Сброс карты и аттаковать всех в радиусе 1 при получении урона
		levels: [
			{// 1 Уровень
				targetCount: 1,
				move: [],
				attack: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}, {
					x: -1,
					y: 0
				}, {x: -1, y: 1}],
				rotate: [
					ERotation._90,
					ERotation._270,
				]
			},
			{// 2 Уровень
				targetCount: 2,
				move: [],
				attack: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}, {
					x: -1,
					y: 0
				}, {x: -1, y: 1}],
				rotate: [
					ERotation._90,
					ERotation._180,
					ERotation._270,
				]
			},
			{// 3 Уровень
				targetCount: 3,
				move: [],
				attack: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}, {x: -1, y: -1}, {
					x: -1,
					y: 0
				}, {x: -1, y: 1}],
				rotate: [
					ERotation._0,
					ERotation._90,
					ERotation._180,
					ERotation._270,
				]
			}
		]
	},// do
	{
		name: "Skewer",
		type: ECardType.Metal,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 2,
				move: [{x: 0, y: 1}],
				attack: [], // Аттака в конце хода
				rotate: []
			},
			{// 2 Уровень
				targetCount: 2,
				move: [{x: 0, y: 2}],
				attack: [], // Аттака в конце хода
				rotate: []
			},
			{// 3 Уровень
				targetCount: 2,
				move: [{x: 0, y: 3}],
				attack: [], // Аттака в конце хода
				rotate: []
			}
		]
	},
	{
		name: "Ripsaw",
		type: ECardType.Metal,
		effects: ["Ripsaw"],
		levels: [
			{// 1 Уровень
				targetCount: 1,
				move: [],
				attack: [{x: 0, y: 1}], // Аттака в конце хода
				rotate: []
			},
			{// 2 Уровень
				targetCount: 2,
				move: [],
				attack: [{x: 0, y: 1}, {x: 0, y: 2}], // Аттака в конце хода
				rotate: []
			},
			{// 3 Уровень
				targetCount: 3,
				move: [],
				attack: [{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}], // Аттака в конце хода
				rotate: []
			}
		]
	},
	{
		name: "Cyclotron",
		type: ECardType.Electro,
		// +1 карта в раздачу, если ты первый игрок
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 999,
				move: [],
				attack: [{x: 1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 1}],
				rotate: [ // 1: 90,  2: 180, 3: 270(-90), 4:360
					ERotation._90,
					ERotation._270,
				]
			},
			{// 2 Уровень +2 cards
				targetCount: 999,
				move: [],
				attack: [{x: 1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 1},/**/{x: 2, y: 2}, {x: -2, y: -2}, {
					x: 2,
					y: -2
				}, {x: -2, y: 2}],
				rotate: [
					ERotation._90,
					ERotation._180,
					ERotation._270,
				]
			},
			{// 3 Уровень +3 cards
				targetCount: 999,
				move: [],
				attack: [{x: 1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 1},/**/{x: 2, y: 2}, {x: -2, y: -2}, {
					x: 2,
					y: -2
				}, {x: -2, y: 2},/**/{x: 3, y: 3}, {x: -3, y: -3}, {x: 3, y: -3}, {x: -3, y: 3}],
				rotate: [
					ERotation._0,
					ERotation._90,
					ERotation._180,
					ERotation._270,
				]
			}
		]
	},
	{
		name: "Speed",
		type: ECardType.Electro,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move: [{x: 0, y: 1}, {x: 0, y: 2}],
				attack: [],
				rotate: []
			},
			{// 2 Уровень
				targetCount: 0,
				move: [{x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}],
				attack: [],
				rotate: []
			},
			{// 3 Уровень
				targetCount: 0,
				move: [{x: 0, y: 3}, {x: 0, y: 4}, {x: 0, y: 5}, {x: 0, y: 6}],
				attack: [],
				rotate: []
			}
		]
	},
	{
		name: "Chain Lightning",
		type: ECardType.Electro,
		effects: ["ChainLightning"],
		levels: [
			{// 1 Уровень
				targetCount: 1,
				move: [],
				attack: [{x: 0, y: 1}],
				rotate: []
			},
			{// 2 Уровень
				targetCount: 3,
				move: [],
				attack: [{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}],
				rotate: []
			},
			{// 3 Уровень
				targetCount: 5,
				move: [],
				attack: [{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}, {x: 0, y: 5}],
				rotate: []
			}
		]
	},
	{
		name: "Move left disable",
		type: ECardType.Deffect,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move: [{x: -1, y: 0}],
				attack: [],
				rotate: []
			},
			{// 2 Уровень
				targetCount: 0,
				move: [{x: -1, y: 0}],
				attack: [],
				rotate: []
			},
			{// 3 Уровень
				targetCount: 0,
				move: [{x: -1, y: 0}],
				attack: [],
				rotate: []
			},
			{// 4 Уровень
				targetCount: 0,
				move: [{x: -1, y: 0}],
				attack: [],
				rotate: []
			},
		]
	},
	{
		name: "Move backward disable",
		type: ECardType.Deffect,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move: [{x: 0, y: -1}],
				attack: [],
				rotate: []
			},
			{// 2 Уровень
				targetCount: 0,
				move: [{x: 0, y: -1}],
				attack: [],
				rotate: []
			},
			{// 3 Уровень
				targetCount: 0,
				move: [{x: 0, y: -1}],
				attack: [],
				rotate: []
			},
			{// 4 Уровень
				targetCount: 0,
				move: [{x: 0, y: -1}],
				attack: [],
				rotate: []
			},
		]
	},
	{
		name: "Move forward disable",
		type: ECardType.Deffect,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move: [{x: 0, y: 1}],
				attack: [],
				rotate: []
			},
			{// 2 Уровень
				targetCount: 0,
				move: [{x: 0, y: 1}],
				attack: [],
				rotate: []
			},
			{// 3 Уровень
				targetCount: 0,
				move: [{x: 0, y: 1}],
				attack: [],
				rotate: []
			},
			{// 4 Уровень
				targetCount: 0,
				move: [{x: 0, y: 1}],
				attack: [],
				rotate: []
			},
		]
	},
	{
		name: "Move right disable",
		type: ECardType.Deffect,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move: [{x: 1, y: 0}],
				attack: [],
				rotate: []
			},
			{// 2 Уровень
				targetCount: 0,
				move: [{x: 1, y: 0}],
				attack: [],
				rotate: []
			},
			{// 3 Уровень
				targetCount: 0,
				move: [{x: 1, y: 0}],
				attack: [],
				rotate: []
			},
			{// 4 Уровень
				targetCount: 0,
				move: [{x: 1, y: 0}],
				attack: [],
				rotate: []
			},
		]
	},
]
