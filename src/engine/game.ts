"use strict"
import {cardsJSON} from "./cards";
import {GameMap} from "./game-map";
import seedrandom from "seedrandom";
import {User} from "./user";
import {ECardType, EHighlight, IVector, TCardId, ETileType, TUserId, EUnitType} from "./types";
import {createArray, getNextCellFromAToB, getRandomInt, shakeArray, vectorRotate} from "./extension-functions";
import {Unit} from "./unit";
import {Cell} from "./cell";
import {AbstractRender} from "./renders/abstract-render";
import {AbstractAgent} from "./agents/abstract-agent";

/*private readonly map = new MapObject([ // Ландшафт
	[1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
	[1, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0],
	[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 0, 0, 0, 0, 2, 0, 3, 0, 2],
	[1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0],
	[1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
])*/

/*for (let i = 0; i < newUsers.length; i++) {
	const userId = newUsers[i]
	let user = new User(i);

	if (this.globalUserId === userId) {
		user.agent = new LocalAgent(userId, this)
		this.localUser = user

		/!*user.stacks[0] = [4,4,4]
		user.stacks[1] = [10,10,10]
		user.stacks[2] = [6,6]*!/
	} else if (userId[userId.length - 1] === 'b') {
		user.agent = new BotAgent(this)
	} else {
		user.agent = new NetworkAgent(userId, this)
	}
	this.users.push(user)
}*/

/*{ /// временная генерация пользователей
	let testUserAgent = new LocalAgent();
	let testUser = new User(false);
	testUser.agent = testUserAgent;
	testUser.index = 0;
	users.push(testUser);
}*/


export class Game {


	private readonly random: ReturnType<seedrandom>;

	//private constructor();
	constructor(
		private readonly render: AbstractRender,
		private readonly users: User[],
		private readonly gameMap: GameMap,
		private readonly seed: { toString(): string } | string,
		private readonly localUser: User
	) {
		/* 0.5297204857065221 */
		// Общее случайное число, получать его от хоста
		// this.seedRandom =  0.12800927790647165 // - рядом с бомбой
		this.random = seedrandom(seed.toString());
		this.render.renderMap(this.gameMap);
	}

	//private readonly users: User[] = []

	// Колода карт по 8 карт
	private readonly cardsDeck: TCardId[] = []
	private readonly cardsCount = 96
	private bombHP = 8
	private roundCounter = 0
	private killsCount = 0
	private readonly damageCardsDeck: TCardId[] = []
	private isStarted = false

	/*
	Инициализация
	newUsers - массив уникальных идентификаторов
	TODO: users: AbstractAgent[] array - инициализированные обьекты пользователей
	 */
	public start() {
		//console.log('start')
		if (this.isStarted) throw new Error('Game already started')
		this.isStarted = true

		this.render.updateBombCounter(this.bombHP);

		// Генерация колоды c командными картами
		for (let i = 0; i < 12; i++) {
			for (let j = 0; j < this.cardsCount / (cardsJSON.length - 2); j++) {
				this.cardsDeck.push(i);
			}
		}
		shakeArray(this.cardsDeck, this.random);

		// Генерация колоды с картами повреждений
		for (let i = 0; i < 13; i++) {
			for (let j = 12; j < 16; j++) {
				this.damageCardsDeck.push(j);
			}
		}
		shakeArray(this.damageCardsDeck, this.random);

		// Начальный спаун мобов на рунах
		this.creepsSpawn()

		// Спаун героев
		let baseFree = this.gameMap.getAllCellsByType(ETileType.Base).filter(cell => !cell.hasUnit());
		shakeArray(baseFree, this.random);

		for (let user of this.users) {
			const hero = new Unit(EUnitType.Hero)
			let heroCell = baseFree.pop();
			if (!heroCell) throw new Error('No place to unit')

			heroCell.unit = hero
			user.myHero = hero;
			hero.ownerUser = user;
			this.render.initUnit(heroCell);
			this.render.updateHeroDirection(heroCell, user.myHero.direction)
		}
		// Спаун бомбы
		const bombCell = baseFree.pop()
		if (!bombCell) throw new Error('No place for bomb')
		bombCell.unit = new Unit(EUnitType.Bomb)
		this.render.initUnit(bombCell);


		setTimeout(() => this.chooseCards(), 0)
	};

	private lose(message?: string) {
		this.render.stopSelect();
		this.render.stopTimer();
		this.render.defeat(message);
	}

	private win() {
		this.render.stopSelect();
		this.render.stopTimer();
		this.render.win();
	}


	private async chooseCards() {
		//console.log('chooseCards')
		let isFirstRound = this.roundCounter === 0;
		let selectionCards: TCardId[] = [];
		let countCards = isFirstRound ? 10 : 5; // TODO: добавить еще условие для core карт

		for (let i = 0; i < countCards; i++) {
			const card = this.cardsDeck.pop()
			if (card === undefined) break
			selectionCards.push(card);
		}

		let countGiven = 0;
		let userId = 0

		while (isFirstRound && countGiven < (this.users.length * 2) || !isFirstRound && countGiven < 4) {
			if (selectionCards.length === 0) {
				this.lose("Карты в колоде закончились");
				return
			} else {
				this.render.showMessage(this.users[userId].current ?
					'Выберите карту' :
					'Сейчас карту выбирает другой игрок'
				)

				const selectCardId = await this.users[userId].selectCard(selectionCards)

				selectionCards.splice(selectCardId, 1);

				countGiven++
				userId = (userId + 1) % this.users.length
			}
		}

		setTimeout(() => this.programmingAct(), 0);
	}


	private async programmingAct() {

		await Promise.all(this.users.map(user =>
			user.programming().then(() => {
				this.render.showMessage(user.current ?
					'Другой пользователь ещё расставляет карты, пожалуйста подождите' :
					'Установите выбранные карты в терминал или утилизируйте'
				)
			})
		))
		// this.render.hideMessage()

		setTimeout(() => this.warriorsAct(), 0)
	}


	// Исполняется карта, верхняя в каждом стеке в порядке игроков
	private warriorsAct() {

		const go = async (userId = 0) => {

			for (let stack of this.users[userId].stacks) {
				if (stack.length === 0) continue;
				const user = this.users[userId]

				this.render.showMessage(user.current ?
					'Ваш ход' :
					'Ходит другой игрок, подождите'
				)

				await this.runStack(user, stack)
			}

			if (userId + 1 < this.users.length) {
				setTimeout(() => go(userId + 1), 0);
			} else {
				setTimeout(() => this.creepsMoveAct(), 0);
			}
		}
		setTimeout(() => go(), 0);
	}

	private async runStack(user: User, stack: TCardId[]) {
		let level = stack.length;

		let cardId = stack[level - 1];
		let card = cardsJSON[cardId].levels[level - 1];
		let heroCell = this.gameMap.getAllCellHasUnits(EUnitType.Hero).filter(cell => cell.unit === user.myHero)[0]

		if (card?.rotate?.length) {
			this.render.showMessage(user.current ?
				'Выберите, в какую сторону повернуться' :
				'Другой игрок выбирает куда повернуться'
			)
			const rotateAngleId = card.rotate[card.rotate.length > 1 ? await user.chooseRotate(card.rotate, user.myHero.direction) : 0]
			user.myHero.rotate(rotateAngleId);
			this.render.updateHeroDirection(heroCell, user.myHero.direction)
		}


		if (card.move.length !== 0) {
			let selVect: IVector | null = null;

			if (card.move.length === 1) { // card.move[i] - вектор в конец которого нужно дойти
				selVect = card.move[0]

			} else {
				// Выбор или запрос ячейки для передвижения
				let sellArray: Cell[] = []
				let sellVec: IVector[] = []
				for (let sel of card.move) {
					let v = vectorRotate(sel, user.myHero.direction)
					let temp = Math.max(Math.abs(v.x), Math.abs(v.y))
					let next = {x: heroCell.x + v.x, y: heroCell.y - v.y};

					while (true) {
						let nextCell = this.gameMap.getCell(next.x, next.y)

						if (next.x === heroCell.x && next.y === heroCell.y) break;
						if (nextCell !== null) {
							sellArray.push(nextCell);
							sellVec.push(sel);
							break;
						}
						next = {x: (next.x - v.x / temp) | 0, y: (next.y + v.y / temp) | 0};
					}
				}

				if (sellVec.length === 0) {
					selVect = null;
				} else if (sellVec.length === 1) {
					selVect = sellVec[0];
				} else {
					this.render.showMessage(user.current ?
						'Выберите клетку, в которую хотите перейти' :
						'Другой игрок выбирает куда идти'
					)
					let moveCellIds = await user.selectCells(sellArray, EHighlight.Move, 1);
					selVect = sellVec[moveCellIds[0]];
				}
			}


			if (selVect !== null) {
				let v = vectorRotate(selVect, user.myHero.direction)
				await this.goRamming(user, heroCell, v.x, -v.y);
			}

		}

		heroCell = this.gameMap.getAllCellHasUnits(EUnitType.Hero).filter(cell => cell.unit === user.myHero)[0]
		if (card.attack.length !== 0) {
			await this.goAttack(user, heroCell, card.attack, card.targetCount);
		}
		//TODO: Вызвать спец функцию карты
	}


	// Возвращает bool удалось перейти или нет
	private async goRamming(user: User, thisCell: Cell, vecX, vecY) {
		let hookArray: Cell[] = []
		let hookVectors = [
			vectorRotate({x: -1, y: 0}, thisCell.unit.direction),
			vectorRotate({x: 0, y: -1}, thisCell.unit.direction),
			vectorRotate({x: 1, y: 0}, thisCell.unit.direction)
		]
		let hookSelect: Cell | null = null

		for (const hook of hookVectors) {
			const hookTemp = this.gameMap.getCell(thisCell.x + hook.x, thisCell.y - hook.y)
			if (hookTemp !== null && hookTemp.hasUnit() && (hookTemp.unit.type === EUnitType.Hero || hookTemp.unit.type === EUnitType.Bomb)) {
				hookArray.push(hookTemp)
			}
		}
		hookArray.push(thisCell)
		let unit = thisCell.unit;

		if (hookArray.length > 1) {
			this.render.showMessage(user.current ?
				'Выберите игрока или предмет который хотите тащить за собой' :
				'Другой игрок выбирает цель для перемещения'
			)
			hookSelect = hookArray[(await user.selectCells(hookArray, EHighlight.Hook, 1))[0]]
			if (hookSelect !== thisCell)
				unit.attachedCell = hookSelect
		}

		let toX = thisCell.x + vecX;
		let toY = thisCell.y + vecY;
		let temp = Math.max(Math.abs(vecX), Math.abs(vecY))

		// Развернутая рекурсия
		let recStack: Cell[] = []
		recStack.push(thisCell) // клетка которую двигаем
		let stopMatrix = createArray(this.gameMap.size.x, this.gameMap.size.y)
		while (recStack.length) {
			const curCell = recStack.pop() as Cell;
			let next = this.gameMap.getCell((curCell.x + vecX / temp) | 0, (curCell.y + vecY / temp) | 0)

			// Можно ли двигать дальше
			if (next === null || (curCell.x === toX && curCell.y === toY) || stopMatrix[next.x][next.y] == true) {
				stopMatrix[curCell.x][curCell.y] = true
				continue;
			}

			// Следующую можно толкать, положить в стек
			if (next.unit !== null && (next.unit.type === EUnitType.Hero || next.unit.type === EUnitType.Bomb)) {
				recStack.push(curCell)
				recStack.push(next)
				continue;
			}

			if (next.unit !== null && next.unit.type === EUnitType.Creep) this.creepKill(next)

			const movements: Promise<void>[] = []

			movements.push(this.render.moveUnit(curCell, next))
			this.gameMap.moveUnitFromCellToCoords(curCell, next.x, next.y)

			// Если юнит кого-то тащит, то тот занимает ячейку юнита
			if (next.unit.attachedCell !== null) {
				let atCell = next.unit.attachedCell;
				movements.push(this.render.moveUnit(atCell, curCell))
				this.gameMap.moveUnitFromCellToCoords(atCell, curCell.x, curCell.y);
				next.unit.attachedCell = curCell
			}
			this.render.showMessage('Перемещение юнитов')
			await Promise.all(movements)

			recStack.push(next)
		}

		unit.attachedCell = null
	}

	private async goAttack(user, thisCell, attackVecs, count) {
		let attArray: Cell[] = []

		for (let vec of attackVecs) {
			let dirVec = vectorRotate(vec, thisCell.unit.rotation);
			let tempCell = this.gameMap.getCell(dirVec.x + thisCell.x, thisCell.y - dirVec.y);
			if (tempCell !== null && tempCell.unit !== null && tempCell.unit.type === EUnitType.Creep) {
				attArray.push(tempCell)
			}
		}

		let attCells: Cell[] = []
		if (attArray.length > count) {
			//если найдено больше юнитов чем нужно, спросить каких нужно бить
			this.render.showMessage(user.current ?
				'Выберите цель для атаки' :
				'Другой игрок выбирает цель для атаки'
			)
			let atIds = await user.selectCells(attArray, EHighlight.Attack, count)
			for (let atId of atIds) {
				attCells.push(attArray[atId]);
			}
		} else {
			attCells = attArray
		}

		for (let cell of attCells) {
			this.creepKill(cell);
		}

	}

	private creepKill(cell: Cell) {
		this.render.killUnit(cell)
		this.render.updateKillsCounter(++this.killsCount);
		cell.killUnit();
	}


	private async creepsMoveAct() { // TODO: таранят бомбу или героя если они на пути
		this.render.showMessage('Ход противников')

		let creepsCells = this.gameMap.getAllCellHasUnits(EUnitType.Creep);
		let bombCells = this.gameMap.getAllCellHasUnits(EUnitType.Bomb);

		const movements: Promise<void>[] = []
		for (let cellFrom of creepsCells) {
			let next = getNextCellFromAToB(cellFrom, bombCells[0]);
			let to = this.gameMap.moveUnitFromCellToCoords(cellFrom, next.x, next.y);

			if (to !== null) movements.push(this.render.moveUnit(cellFrom, to));
		}

		await Promise.all(movements)

		setTimeout(() => this.creepsSpawnAct(), 0);
	}

	// Spawn creeps on runes
	private creepsSpawn() {
		let runesFree = this.gameMap.getAllCellsByType(ETileType.Runes).filter(cell => !cell.hasUnit());
		for (let spawnCell of runesFree) {
			if (!spawnCell.hasUnit()) {
				spawnCell.unit = new Unit(EUnitType.Creep)
				this.render.initUnit(spawnCell);
			}
		}
	}

	private creepsSpawnAct() {
		this.creepsSpawn()
		setTimeout(() => this.creepsAttackAct(), 500);
	}


	private creepsAttackAct() {
		let bombs = this.gameMap.getAllCellHasUnits(EUnitType.Bomb);
		let heroCells = this.gameMap.getAllCellHasUnits(EUnitType.Hero);

		let sortHeroCells: Cell[] = [];
		for (let user of this.users) {
			const heroCell = heroCells.find(cell => cell.unit === user.myHero)
			if (!heroCell) throw new Error('Impossible error')
			sortHeroCells.push(heroCell);
		}
		let attackedCells = bombs.concat(sortHeroCells);

		let attackEvent: { attacking: Cell, attacked: Cell }[] = [];
		const crossVectorsZone = [[-1, 0], [1, 0], [0, -1], [0, 1]];

		for (let cell of attackedCells) {
			for (let vec of crossVectorsZone) {
				let creepCell = this.gameMap.getCell(cell.x + vec[0], cell.y + vec[1]);
				if (creepCell !== null && creepCell.unit !== null && creepCell.unit.type === EUnitType.Creep) {
					attackEvent.push({attacking: creepCell, attacked: cell});
				}
			}
		}


		const attack = (eventId = 0) => {
			let atEv = attackEvent[eventId];

			if (atEv.attacked.unit.type === EUnitType.Hero) {
				this.getDisable(atEv.attacked.unit.ownerUser);
			} else if (atEv.attacked.unit.type === EUnitType.Bomb) {
				this.render.updateBombCounter(--this.bombHP);
				if (this.bombHP === 0) {
					this.lose("Тортик уничтожен");
					return;
				}
			}

			if (eventId + 1 < attackEvent.length) {
				setTimeout(() => attack(eventId + 1), 0)
			} else {
				this.finalAct();
			}

		}

		if (attackEvent.length > 0) {
			setTimeout(() => attack(), 0)
		} else {
			setTimeout(() => this.finalAct(), 0)
		}
	}

	private getDisable(user: User) {
		//console.log('getDisable', user)

		if (this.damageCardsDeck.length !== 0) {
			let ranId = getRandomInt(this.random, 0, 6);
			const damageCard = this.damageCardsDeck.pop() as TCardId // because check length on top
			if (user.stacks[ranId].length > 0 && cardsJSON[user.stacks[ranId][user.stacks[ranId].length - 1]].type === ECardType.Defect) {
				user.stacks[ranId].pop();
				user.stacks[ranId].push(damageCard);
			} else {
				user.stacks[ranId].push(damageCard);
			}
		}
		user.setStacks(user.stacks);
	}


	private finalAct() {
		this.render.showMessage('Конец хода')
		let bombCell = this.gameMap.getAllCellHasUnits(EUnitType.Bomb)[0];
		let target = this.gameMap.getAllCellsByType(ETileType.Target)[0];
		if (bombCell === target) {
			this.win();
		} else {
			const lastUser = this.users.pop()
			if (lastUser === undefined) throw new Error('Impossible error')
			this.users.unshift(lastUser);

			this.roundCounter++;
			setTimeout(() => this.chooseCards(), 500);
		}

	}


}


