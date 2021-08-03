import {AbstractRender} from "./abstract-render";
import {Cell} from "../cell";
import {GameMap} from "../game-map";
import {EHighlight, EDirection, EUnitType, TCardId, TStackId, ECardType} from "../types";
import EventEmitter from "events";
import {ref, shallowRef, triggerRef, unref} from "vue";
import {Unit} from "../unit";
import {getNextCellFromAToB} from "../extension-functions";
import {cardsJSON} from "../cards";

/*

export class VueRenderMap {


	readonly size: number

	constructor(
		private readonly vueRender: VueRender,
		readonly height = 6,
		readonly width = 12,
	) {
		this.size = height * width

		/!*this.renderMap(new GameMap([ // Ландшафт
			[1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
			[1, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0],
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 0, 0, 0, 0, 2, 0, 3, 0, 2],
			[1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0],
			[1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
		]))*!/
		/!*

				this.gameMap.value?.getAllCellsByType?.(1)?.forEach((a) => {
					a.unit = new Unit(EUnitType.Hero)
					console.log(a)
					setTimeout(() => {this.initUnit(a)}, 700)
					//setTimeout(()=>{this.killUnit(a)}, 3700)
				})

				this.gameMap.value?.getAllCellsByType?.(2)?.forEach((a) => {
					a.unit = new Unit(EUnitType.Creep)
					console.log(a)
					setTimeout(() => {this.initUnit(a)}, 700)
					//setTimeout(()=>{this.killUnit(a)}, 3700)
				})

				this.gameMap.value?.getAllCellsByType?.(3)?.forEach((a) => {
					a.unit = new Unit(EUnitType.Bomb)
					console.log(a)
					setTimeout(() => {this.initUnit(a)}, 700)
					//setTimeout(()=>{this.killUnit(a)}, 3700)
				})
				setTimeout(() => {


					// @ts-ignore
					this.selectCells(this.gameMap.value.getAllCellsByType(1), EHighlight.Move, 4)
						.then((selectCells) => console.log({selectCells}))
				}, 1000)*!/
	}


	public gameMap: GameMap | null = null

	renderMap(inputMap: GameMap): void {
		this.gameMap = inputMap
	}

	readonly units = new Map<Unit, Cell>()

	initUnit(cell: Cell): void {
		this.units.set(cell.unit, cell)
		// triggerRef(this.units)
	}

	public onCellClick: ((cell: Cell) => void) | null = null
	readonly cellsToSelect = new Map<Cell, { highlight: EHighlight, ind: number }>()

	selectCells(cells: Cell[], highlight: number & EHighlight, count: number): Promise<number[]> {
		//console.log({cells, highlight, count})
		//const m = this.vueRender.showMessage('Select ' + count + ' cells for ' + EHighlight[highlight])
		return new Promise((resolve, reject) => {
			for (let i = 0; i < cells.length; i++) {
				this.cellsToSelect.set(cells[i], {highlight, ind: i})
			}
			//	triggerRef(this.cellsToSelect)

			const clickedInds: number[] = []
			this.onCellClick = (cell) => {
				const v = this.cellsToSelect.get(cell)
				if (v) {
					this.cellsToSelect.delete(cell)
					const {ind, highlight} = v
					clickedInds.push(ind)
					if (clickedInds.length === count) {
						this.onCellClick = null
						this.vueRender.hideMessage()
						this.cellsToSelect.clear()
						resolve(clickedInds)
					}
					//triggerRef(this.cellsToSelect)
				}
			}

		})
	}


	moveUnit(cellFrom: Cell, cellTo: Cell): Promise<void> {
		return new Promise<void>((resolve) => {
			const unit = cellFrom.unit
			this.units.set(unit, cellTo)
			//	triggerRef(this.units)
			setTimeout(resolve, 500)
		})
	}

	killUnit(cell: Cell): void {
		this.units.delete(cell.unit)
		//triggerRef(this.units)
	}

	public cellsDirection = new Map<Unit, EDirection>()

	updateCellRotate(cell: Cell, orientation: EDirection): void {
		this.cellsDirection.set(cell.unit, orientation)
		//triggerRef(this.cellsDirection)
	}
}

export class VueRender extends AbstractRender {

	constructor() {
		super();
		/!*setInterval(() => {
			this.showMessage(new Date().toLocaleString())
		}, 500)*!/

		const map = unref(this.map)
		this.renderMap = map.renderMap.bind(this.map)
		this.initUnit = map.initUnit.bind(this.map)
		this.killUnit = map.killUnit.bind(this.map)
		this.selectCells = map.selectCells.bind(this.map)
		this.moveUnit = map.moveUnit.bind(this.map)
		this.updateHeroDirection = map.updateCellRotate.bind(this.map)

	}

	public readonly map = new VueRenderMap(this);

	readonly renderMap: AbstractRender['renderMap']
	readonly initUnit: AbstractRender['initUnit']
	readonly killUnit: AbstractRender['killUnit']
	readonly selectCells: AbstractRender['selectCells']
	readonly moveUnit: AbstractRender['moveUnit']
	readonly updateHeroDirection: AbstractRender['updateHeroDirection']


	public selectsCards: TCardInd[] = []
	public onCardClick: ((card: TCardInd) => void) | null = null

	selectCard(cards: TCardInd[]): Promise<number> {
		return new Promise((resolve, reject) => {
			this.selectsCards = cards

			this.onCardClick = (card: TCardInd) => {
				this.onCardClick = null
				this.selectsCards = []
				resolve(card)
			}
		})
	}

	public handCards: TCardInd[] = []

	setHand(cards: TCardInd[]): void {
		this.handCards = cards
	}

	public message = ''

	showMessage(text: string): number {
		console.log('message', text)
		this.message = text
		return 0
	}

	hideMessage(messageId = 0): void {
		this.message = ''
	}

	public stacks: TCardInd[][] = [[], [], [], [], [], []]

	setStacks(stacks: TCardInd[][]): void {
		// debugger
		this.stacks = stacks

	}

	public onStackClick: ((stack: TStackInd) => void) | null = null
	public stacksToClick: Set<TStackInd> = new Set<TStackInd>()

	selectStacks(stacks: TStackInd[], count: number): Promise<TStackInd[]> {
		return new Promise<TStackInd[]>((resolve, reject) => {
			stacks.forEach(v => this.stacksToClick.add(v))
			const res: TStackInd[] = []
			this.onStackClick = (num: TStackInd) => {
				res.push(num)
				if (res.length === count) {
					this.stacksToClick.clear()
					this.onStackClick = null
					resolve(res)
				}
			}
		})
	}

	public onHandClick: ((ind: number) => void) | null = null
	public handActiveCardInd: number | null = null
	public scrapType = ''


	programming(stacks: TStackInd[]): Promise<[number, number]> {
		return new Promise(async (resolve, reject) => {
			this.onHandClick = (ind: number) => {
				this.handActiveCardInd = ind === this.handActiveCardInd ? null : ind

				if (this.handActiveCardInd !== null) {
					this.scrapType = {
						[ECardType.Electro]: 'move',
						[ECardType.Computer]: 'move',
						[ECardType.Fire]: 'fix',
						[ECardType.Metal]: 'fix',
					}[cardsJSON[this.handCards[this.handActiveCardInd]].type]

					stacks.forEach(v => this.stacksToClick.add(v))
					this.onStackClick = (stackInd: TStackInd) => {
						this.onStackClick = null
						this.onHandClick = null
						const handCardInd = this.handActiveCardInd!
						this.stacksToClick.clear()
						this.handActiveCardInd = null
						this.scrapType = ''
						resolve([handCardInd, stackInd])
					}
				} else {
					this.scrapType = ''
					this.stacksToClick.clear()
					this.onStackClick = null
				}
			}

		})
	}

	public onRotationClick: ((ind: number) => void) | null = null
	public rotationsSelect: EDirection[] = []

	chooseRotate(rotateArray: EDirection[]): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.rotationsSelect = rotateArray
			this.onRotationClick = (ind: number) => {
				this.onRotationClick = null
				this.rotationsSelect = []
				resolve(ind)
			}
		})
	}

	defeat(): void {
		throw new Error('Not listen')
	}

	public time = '0:00'
	private timerInterval: NodeJS.Timer | null = null

	startTimer(secCount: number): void {
		let realSecond = secCount;

		const updateTimer = () => {
			let seconds = realSecond % 60;
			let minutes = (realSecond / 60) | 0;
			if (realSecond < 0) {
				if (this.timerInterval !== null) {
					clearInterval(this.timerInterval);
					this.timerInterval = null
				}
			} else {
				this.time = realSecond < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;
				realSecond--;
			}
		}
		updateTimer();
		this.timerInterval = setInterval(updateTimer, 1000);
	}

	stopTimer(): void {
		if (this.timerInterval !== null) {
			clearInterval(this.timerInterval);
			this.timerInterval = null
		}
		this.time = '0:00'
	}

	stopSelect(): void {
		this.onRotationClick = null
		this.onCardClick = null
		this.onStackClick = null
		this.map.onCellClick = null
		this.onHandClick = null
	}

	public heart = 0

	updateBombCounter(newVal: number): void {
		this.heart = newVal
	}

	public creep = 0

	updateKillsCounter(newVal: number): void {
		this.creep = newVal
	}

}
*/

export interface IRenderMap {
	onCellClick: ((cell: Cell) => void) | null
	cellsToSelect: Map<Cell, { highlight: EHighlight, ind: number }>
	gameMap: GameMap | null
	units: Map<Unit, { cell: Cell, key: number }>
	cellsDirection: Map<Unit, EDirection>
}
