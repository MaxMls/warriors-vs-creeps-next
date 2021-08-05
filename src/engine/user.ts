import {cardsJSON} from "./cards";
import {ECardType, EHighlight, EDirection, TCardId, TStackId, ERotation} from "./types";
import {AbstractAgent} from "./agents/abstract-agent";
import {Cell} from "./cell";
import {LocalAgent} from "./agents/local-agent";
import {Unit} from "./unit";

export class User {
	readonly current: boolean

	readonly setStacks: AbstractAgent['setStacks']

	constructor(private readonly agent: AbstractAgent) {
		this.current = agent instanceof LocalAgent
		this.setStacks = this.agent.setStacks.bind(this.agent)
	}

	// Карты в руке, int id типы карт
	private hand: any = [];

	// подмассивы - стеки, верхняя карта - последняя
	private _stacks: TCardId[][] = [[], [], [], [], [], []];
	get stacks() {
		return this._stacks;
	}

	private _myHero!: Unit;
	set myHero(value: Unit) {
		this._myHero = value;
	}

	get myHero(): Unit {
		return this._myHero;
	}

	// возвращает текущего пользователя закончившего ход
	async selectCard(cards: TCardId[]) { // Запрос пользователю выбрать x карт
		const cardId = await this.agent.selectCard(cards)
		this.hand.push(cards[cardId]);
		this.agent.setHand(this.hand);
		return cardId
	}


	private get stacksNoDefects() {
		let notDisabledStacks: TStackId[] = [];

		for (let i = 0; i < 6; i++) {
			if (this.stacks[i].length === 0 || cardsJSON[this.stacks[i][this.stacks[i].length - 1]].type !== ECardType.Defect) {
				notDisabledStacks.push(i as TStackId);
			}
		}
		return notDisabledStacks
	}

	private get stacksNoDefectsNoEmpty() {
		let notDisabledNoEmpty: TStackId[] = [];

		for (let i = 0; i < 6; i++) {
			if (this.stacks[i].length !== 0 && cardsJSON[this.stacks[i][this.stacks[i].length - 1]].type !== ECardType.Defect) {
				notDisabledNoEmpty.push(i as TStackId);
			}
		}
		return notDisabledNoEmpty
	}

	private get stacksDefects() {
		let disabledStacks: TStackId[] = []
		for (let i = 0; i < 6; i++) {
			if (this.stacks[i].length > 0 && cardsJSON[this.stacks[i][this.stacks[i].length - 1]].type === ECardType.Defect) {
				disabledStacks.push(i as TStackId);
			}
		}
		return disabledStacks
	}

	async scrapRequest(type) {
		// Утилизация для ремонта. Утилизация огненных или металлических карт позволяет вам освободить слот от повреждения на выбор
		if (type === ECardType.Fire || type === ECardType.Metal) {
			let disabledStacks = this.stacksDefects;

			if (disabledStacks.length > 0) {
				const defectId = disabledStacks[(await this.agent.selectStacks(disabledStacks, 1))[0]];
				this.stacks[defectId].pop()
			}
		}
		// Утилизация электрических или компьютерных карт для перепрограммирования - свап 2-х активных стеков на выбор
		else if (type === ECardType.Electro || type === ECardType.Computer) {
			const allowedStacksFrom = this.stacksNoDefectsNoEmpty

			if (allowedStacksFrom.length >= 2) {
				const allowedStacksTo = this.stacksNoDefects
				const fromId = allowedStacksFrom[(await this.agent.selectStacks(allowedStacksFrom, 1))[0]];
				const toId = allowedStacksTo[(await this.agent.selectStacks(allowedStacksTo, 1))[0]];

				let tmpStack = this.stacks[fromId];
				this.stacks[fromId] = this.stacks[toId];
				this.stacks[toId] = tmpStack;
			}
		}
	}

	async programming() {

		this.agent.setStacks(this.stacks);
		this.agent.setHand(this.hand);

		while (this.hand.length > 0) {
			const stacks: TStackId[] = [-2, -1, ...this.stacksNoDefects]

			const [cardPosInHand, stacksInd] = await this.agent.programming(stacks)
			const stackId: TStackId = stacks[stacksInd]

			if (stackId === -2) { // КАРТЫ если она УТИЛИЗИРУЕТСЯ БЕЗ ЭФФЕКТА
				this.hand.splice(cardPosInHand, 1);
			} else if (stackId === -1) {// Карты если она УТИЛИЗИРУЕТСЯ С ЭФФEКТОМ

				await this.scrapRequest(cardsJSON[this.hand[cardPosInHand]].type)
				this.hand.splice(cardPosInHand, 1);
			}/* else if (this.stacks[stackId].length > 0 && cardsJSON[this.stacks[stackId][this.stacks[stackId].length - 1]].type === ECardType.Defect) {

			} */
			// усилить стек картой того же типа
			else if (this.stacks[stackId].length === 0 || cardsJSON[this.stacks[stackId][0]].type === cardsJSON[this.hand[cardPosInHand]].type) {
				if (this.stacks[stackId].length === 3) {
					for (let i = 1; i < 3; i++) {
						this.stacks[stackId][i - 1] = this.stacks[stackId][i];
					}
					this.stacks[stackId].pop();
				}
				this.stacks[stackId].push(this.hand[cardPosInHand]);
				this.hand.splice(cardPosInHand, 1);
			} else {
				this.stacks[stackId] = [this.hand[cardPosInHand]];
				this.hand.splice(cardPosInHand, 1);
			}

			this.agent.setStacks(this.stacks);
			this.agent.setHand(this.hand);
		}
	}

	async chooseRotate(rotateArray: ERotation[], currentDirection: EDirection) {
		return await this.agent.chooseRotate(rotateArray, currentDirection)
	}
	/* count - количество индексов которые нужно вернуть default было 1 */
	async selectCells(cells: Cell[], highlight: EHighlight, count: number) {
		return this.agent.selectCells(cells, highlight, count)
	}

}
