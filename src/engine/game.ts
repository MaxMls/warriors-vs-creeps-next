"use strict"
import {cardsJSON} from "./cards";
import {GameMap} from "./game-map";
import seedrandom from "seedrandom";
import {User} from "./user";
import {ECardType, EHighlight, ETileType, EUnitType, IVector, TCardId} from "./types";
import {createArray, getNextCellFromAToB, getRandomInt, shakeArray, vectorRotate} from "./extension-functions";
import {Unit} from "./unit";
import {Cell} from "./cell";
import {AbstractRender} from "./renders/abstract-render";

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


let i = 0

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
	private readonly cardsDefectCount = 96
	//private readonly cardsCount = 3000
	private bombHP = 8
	//private bombHP = 800
	private roundCounter = 0
	private killsCount = 0
	private readonly damageCardsDeck: TCardId[] = []
	private isStarted = false

	/*
	Инициализация
	newUsers - массив уникальных идентификаторов
	TODO: users: AbstractAgent[] array - инициализированные обьекты пользователей
	 */

	private fillDeck(deck, cards, count) {
		for (let i = 0; i < count; i++) {
			deck.push(cards[i % cards.length].i)
		}
		shakeArray(this.cardsDeck, this.random);
	}

	public start() {
		if (this.isStarted) throw new Error('Game already started')
		this.isStarted = true

		this.render.updateBombCounter(this.bombHP);

		// Генерация колоды c командными картами
		const cards = cardsJSON.map((c, i) => ({c, i}))

		const noDefectCards = cards.filter((v) => v.c.type !== ECardType.Defect)
		this.fillDeck(this.cardsDeck, noDefectCards, this.cardsCount)


		const defectCards = cards.filter((v) => v.c.type === ECardType.Defect)
		this.fillDeck(this.damageCardsDeck, defectCards, this.cardsDefectCount)

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

		// let countCards = isFirstRound ? 10 : 5; // TODO: добавить еще условие для core карт
		let countCards = this.users.length * (this.roundCounter === 0 ? 2 : 1);
		const selectionCardsCount = countCards + 1

		if (this.cardsDeck.length < selectionCardsCount) {
			this.lose("lose.0");
		} else {
			const selectionCards = this.cardsDeck.splice(0, selectionCardsCount);

			for (let i = 0; i < countCards; i++) {
				if (selectionCards.length === 0) {
					this.lose("lose.0");
					return
				} else {
					const userId = i % this.users.length
					this.render.showMessage(this.users[userId].current ? 'message.0' : 'message.1')

					const selectCardInd = await this.users[userId].selectCard(selectionCards)
					selectionCards.splice(selectCardInd, 1);
				}
			}
			setTimeout(() => this.programmingAct(), 0);
		}
	}


	private async programmingAct() {
		this.render.showMessage('message.2')

		await Promise.all(this.users.map(user =>
			user.programming().then(() => {
				if (user.current)
					this.render.showMessage('message.3')
			})
		))

		setTimeout(() => this.warriorsAct(), 0)
	}


	// Исполняется карта, верхняя в каждом стеке в порядке игроков
	private async warriorsAct() {

		for (let user of this.users) {
			this.render.showMessage(user.current ?
				'message.4' :
				'message.5'
			)

			for (let stack of user.stacks) {
				await this.runStack(user, stack)
			}
		}

		setTimeout(() => this.creepsMoveAct(), 0);

	}

	private async runStack(user: User, stack: TCardId[]) {
		let level = stack.length;
		if (level === 0) return

		let cardId = stack[level - 1];
		let card = cardsJSON[cardId].levels[level - 1];
		let heroCell = this.gameMap.getAllCellHasUnits(EUnitType.Hero).filter(cell => cell.unit === user.myHero)[0]

		if (card?.rotate?.length) {
			this.render.showMessage(user.current ? 'message.6' : 'message.7')
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
					this.render.showMessage(user.current ? 'message.8' : 'message.9')
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
				'message.10' : 'message.11'
			)
			hookSelect = hookArray[(await user.selectCells(hookArray, EHighlight.Hook, 1))[0]]
			if (hookSelect !== thisCell) {
				thisCell.unit.attachedCell = hookSelect
			}
		}

		let toX = thisCell.x + vecX;
		let toY = thisCell.y + vecY;
		let temp = Math.max(Math.abs(vecX), Math.abs(vecY))

		// Развернутая рекурсия
		let recStack: Cell[] = []
		recStack.push(thisCell) // клетка которую двигаем
		let stopMatrix = createArray(this.gameMap.size.x, this.gameMap.size.y)

		const movements: Promise<void>[] = []
		while (recStack.length) {
			i++
			/*if (i === 982) {
				debugger
			}*/
			//console.log(i)
			const curCell = recStack.pop() as Cell;
			if (!curCell) throw new Error('error')
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


			movements.push(this.render.moveUnit(curCell.unit, next))
			this.gameMap.moveUnitFromCellToCoords(curCell, next.x, next.y)

			// Если юнит кого-то тащит, то тот занимает ячейку юнита
			if (next.unit.attachedCell !== null) {
				let atCell = next.unit.attachedCell;
				if (next.unit.attachedCell !== next && atCell.unit) { // todo bug: it should be impossible, but not
					movements.push(this.render.moveUnit(atCell.unit, curCell))
					this.gameMap.moveUnitFromCellToCoords(atCell, curCell.x, curCell.y);
					next.unit.attachedCell = curCell
				}
			}
			this.render.showMessage('message.12')

			recStack.push(next)
		}
		await Promise.all(movements)
		await Promise.all(movements)

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
				'message.13' :
				'message.14'
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


	private async creepsMoveAct() { // TODO: damage unit hero if on path
		this.render.showMessage('message.15')

		let creepsCells = this.gameMap.getAllCellHasUnits(EUnitType.Creep);
		let bombCells = this.gameMap.getAllCellHasUnits(EUnitType.Bomb);

		const movements: Promise<void>[] = []
		for (let cellFrom of creepsCells) {
			let next = getNextCellFromAToB(cellFrom, bombCells[0]);

			let to = this.gameMap.moveUnitFromCellToCoords(cellFrom, next.x, next.y);

			if (to !== null) movements.push(this.render.moveUnit(to.unit, to));
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
		setTimeout(() => this.creepsAttackAct(), 0);
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
					this.lose("lose.1");
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
		console.count('finalAct')
		this.render.showMessage('message.16')
		if (!this.gameMap.getAllCellHasUnits(EUnitType.Bomb).find(cell => cell.type !== ETileType.Target)) {
			this.win();
		} else {
			const lastUser = this.users.pop()
			if (lastUser !== undefined) {
				this.users.unshift(lastUser);
			}

			this.roundCounter++;
			setTimeout(() => this.chooseCards(), 0);
		}

	}


}


