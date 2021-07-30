import {cardsJSON} from "./cards";
import {ECardType, EHighlight, EDirection, TCardInd} from "./types";
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
	private _stacks: TCardInd[][] = [[], [], [], [], [], []];
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
	async selectCard(cards: TCardInd[]) { // Запрос пользователю выбрать x карт
		const cardId = await this.agent.selectCard(cards)
		this.hand.push(cards[cardId]);
		this.agent.setHand(this.hand);
		return cardId
	}

	async chooseRotate(rotateArray: EDirection[]) {
		return await this.agent.chooseRotate(rotateArray)
	}

	async scrapRequest(type) {
		// Утилизация для ремонта. Утилизация огненных или металлических карт позволяет вам освободить слот от повреждения на выбор
		// Утилизация электрических или компьютерных карт для перепрограммирования - свап 2-х активных стеков на выбор

		if (type === ECardType.Fire || type === ECardType.Metal) {
			let disabledStacks: number[] = [];

			for (let i = 0; i < 6; i++) {
				if (this._stacks[i].length > 0 && cardsJSON[this._stacks[i][this._stacks[i].length - 1]].type === ECardType.Defect) {
					disabledStacks.push(i);
				}
			}

			if (disabledStacks.length > 0) {
				const selectedStacksIds = await this.agent.selectStacks(disabledStacks, 1);
				this._stacks[disabledStacks[selectedStacksIds[0]]].pop()
			}
		} else if (type === ECardType.Electro || type === ECardType.Computer) {
			let notDisabledStacks: number[] = [];

			for (let i = 0; i < 6; i++) {
				if (this._stacks[i].length === 0 || cardsJSON[this._stacks[i][this._stacks[i].length - 1]].type !== ECardType.Defect) {
					notDisabledStacks.push(i);
				}
			}
			if (notDisabledStacks.length >= 2) {
				const selectedStacksIds = await this.agent.selectStacks(notDisabledStacks, 2);
				let tmpStack = this._stacks[notDisabledStacks[selectedStacksIds[0]]];
				this._stacks[notDisabledStacks[selectedStacksIds[0]]] = this._stacks[notDisabledStacks[selectedStacksIds[1]]];
				this._stacks[notDisabledStacks[selectedStacksIds[1]]] = tmpStack;
			}
		}
	}

	async programming() {

		this.agent.setStacks(this._stacks);
		this.agent.setHand(this.hand);

		while (this.hand.length > 0) {
			const [cardPosInHand, stackId] = await this.agent.programming()

			if (stackId === -2) { // КАРТЫ если она УТИЛИЗИРУЕТСЯ БЕЗ ЭФФЕКТА
				this.hand.splice(cardPosInHand, 1);
			} else if (stackId === -1) {// Карты если она УТИЛИЗИРУЕТСЯ С ЭФФEКТОМ

				await this.scrapRequest(cardsJSON[this.hand[cardPosInHand]].type)
				this.hand.splice(cardPosInHand, 1);
			} else if (this._stacks[stackId].length > 0 && cardsJSON[this._stacks[stackId][this._stacks[stackId].length - 1]].type === ECardType.Defect) {

			} else if (this._stacks[stackId].length === 0 || cardsJSON[this._stacks[stackId][0]].type === cardsJSON[this.hand[cardPosInHand]].type) {
				if (this._stacks[stackId].length === 3) {
					for (let i = 1; i < 3; i++) {
						this._stacks[stackId][i - 1] = this._stacks[stackId][i];
					}
					this._stacks[stackId].pop();
				}
				this._stacks[stackId].push(this.hand[cardPosInHand]);
				this.hand.splice(cardPosInHand, 1);
			} else {
				this._stacks[stackId] = [this.hand[cardPosInHand]];
				this.hand.splice(cardPosInHand, 1);
			}

			this.agent.setStacks(this._stacks);
			this.agent.setHand(this.hand);
		}
	}

	/* count - количество индексов которые нужно вернуть default было 1 */
	async selectCells(cells: Cell[], highlight: EHighlight, count: number) {
		return this.agent.selectCells(cells, highlight, count)
	}

}
