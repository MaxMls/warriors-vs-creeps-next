import {AbstractRender} from "./abstract-render";
import {Cell} from "../cell";
import {GameMap} from "../game-map";
import {EHighlight, EDirection, EUnitType, TCardInd, TStackInd} from "../types";
import EventEmitter from "events";
import {ref, shallowRef, triggerRef, unref} from "vue";
import {Unit} from "../unit";
import {getNextCellFromAToB} from "../extension-functions";

export class VueRenderMap {


	readonly size: number

	constructor(
		private readonly vueRender: VueRender,
		readonly height = 6,
		readonly width = 12,
	) {
		this.size = height * width

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

	}


	readonly gameMap = shallowRef<GameMap | null>(null);

	renderMap(inputMap: GameMap): void {
		console.log(inputMap)
		this.gameMap.value = inputMap
		triggerRef(this.gameMap)
	}

	readonly units = shallowRef<Map<Unit, Cell>>(new Map<Unit, Cell>())

	initUnit(cell: Cell): void {
		this.units.value.set(cell.unit, cell)
		triggerRef(this.units)
	}

	readonly onCellClick = ref<((cell: Cell) => void) | null>(null)
	readonly cellsToSelect = shallowRef<Map<Cell, { highlight: EHighlight, ind: number }>>(new Map())

	selectCells(cells: Cell[], highlight: number & EHighlight, count: number): Promise<number[]> {
		const m = this.vueRender.showMessage('Select ' + count + ' cells for ' + EHighlight[highlight])
		return new Promise((resolve, reject) => {
			for (let i = 0; i < cells.length; i++) {
				this.cellsToSelect.value.set(cells[i], {highlight, ind: i})
			}
			triggerRef(this.cellsToSelect)

			const clickedInds: number[] = []
			this.onCellClick.value = (cell) => {
				const v = this.cellsToSelect.value.get(cell)
				if (v) {
					this.cellsToSelect.value.delete(cell)
					const {ind, highlight} = v
					clickedInds.push(ind)
					if (clickedInds.length === count) {
						this.onCellClick.value = null
						this.vueRender.hideMessage(m)
						this.cellsToSelect.value.clear()
						resolve(clickedInds)
					}
					triggerRef(this.cellsToSelect)
				}
			}

		})
	}


	moveUnit(cellFrom: Cell, cellTo: Cell): Promise<void> {
		return new Promise<void>((resolve) => {
			const unit = cellFrom.unit
			this.units.value.set(unit, cellTo)
			triggerRef(this.units)
			setTimeout(resolve, 500)
		})
	}

	killUnit(cell: Cell): void {
		this.units.value.delete(cell.unit)
		triggerRef(this.units)
	}

	cellsDirection = shallowRef<Map<Unit, EDirection>>(new Map())

	updateCellRotate(cell: Cell, orientation: EDirection): void {
		this.cellsDirection.value.set(cell.unit, orientation)
		triggerRef(this.cellsDirection)
	}
}

export class VueRender extends AbstractRender {

	constructor() {
		super();
		/*setInterval(() => {
			this.showMessage(new Date().toLocaleString())
		}, 500)*/

		const map = unref(this.map)
		this.renderMap = map.renderMap.bind(this.map)
		this.initUnit = map.initUnit.bind(this.map)
		this.killUnit = map.killUnit.bind(this.map)
		this.selectCells = map.selectCells.bind(this.map)
		this.moveUnit = map.moveUnit.bind(this.map)
		this.updateHeroDirection = map.updateCellRotate.bind(this.map)

		this.setStacks([[], [3, 5], [6, 7, 8], [9, 10, 11], [9, 12], [6, 7, 8, 13]])
		this.setHand([2, 4, 8, 9])
		this.programming().then(programming => console.log({programming}))
	}

	public readonly map = new VueRenderMap(this);

	readonly renderMap: AbstractRender['renderMap']
	readonly initUnit: AbstractRender['initUnit']
	readonly killUnit: AbstractRender['killUnit']
	readonly selectCells: AbstractRender['selectCells']
	readonly moveUnit: AbstractRender['moveUnit']
	readonly updateHeroDirection: AbstractRender['updateHeroDirection']


	readonly selectsCards = ref<TCardInd[]>([])
	readonly onCardClick = ref<((card: TCardInd) => void) | null>(null)

	selectCard(cards: TCardInd[]): Promise<number> {
		return new Promise((resolve, reject) => {
			this.selectsCards.value = cards

			this.onCardClick.value = (card: TCardInd) => {
				this.onCardClick.value = null
				this.selectsCards.value = []
				resolve(card)
			}
		})
	}

	readonly handCards = ref<TCardInd[]>([])

	setHand(cards: TCardInd[]): void {
		this.handCards.value = cards
	}

	public readonly message = ref('')

	showMessage(text: string): number {
		this.message.value = text
		return 0
	}

	hideMessage(messageId = 0): void {
		this.message.value = ''
	}

	readonly stacks = shallowRef<TCardInd[][]>([[], [], [], [], [], []])

	setStacks(stacks: TCardInd[][]): void {
		this.stacks.value = stacks
		triggerRef(this.stacks)
	}

	readonly onStackClick = ref<((stack: TStackInd) => void) | null>(null)

	selectStacks(stacks: TStackInd[], count: number): Promise<TStackInd[]> {
		return new Promise<TStackInd[]>((resolve, reject) => {
			const res: TStackInd[] = []
			this.onStackClick.value = (num: TStackInd) => {
				res.push(num)
				if (res.length === count) {
					this.onStackClick.value = null
					resolve(res)
				}
			}
		})
	}

	readonly onHandClick = ref<((ind: number) => void) | null>(null)
	readonly handActiveCardInd = ref<number | null>(null)

	programming(): Promise<[number, number]> {
		return new Promise(async (resolve, reject) => {

			this.onHandClick.value = (ind: number) => {
				this.handActiveCardInd.value = ind === this.handActiveCardInd.value ? null : ind


				if (this.handActiveCardInd.value) {
					this.onStackClick.value = (stackInd: TStackInd) => {
						this.onStackClick.value = null
						this.onHandClick.value = null
						this.handActiveCardInd.value = null

						const handCardInd = this.handActiveCardInd.value!
						resolve([handCardInd, stackInd])
					}
				} else {
					this.onStackClick.value = null
				}
			}

		})
	}

	readonly onRotationClick = ref<((ind: number) => void) | null>()
	readonly rotationsSelect = ref<EDirection[]>()

	chooseRotate(rotateArray: EDirection[]): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.rotationsSelect.value = rotateArray
			this.onRotationClick.value = (ind: number) => {
				this.onRotationClick.value = null
				resolve(ind)
			}
		})
	}

	defeat(): void {
		throw new Error('Not listen')
	}

	readonly timer = ref<string>('0:00')
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
				this.timer.value = realSecond < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;
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
		this.timer.value = '0:00'
	}

	stopSelect(): void {
		this.onRotationClick.value = null
		this.onCardClick.value = null
		this.onStackClick.value = null
		this.map.onCellClick.value = null
		this.onHandClick.value = null
	}

	readonly healthMeter = ref<number>(0)

	updateBombCounter(newVal: number): void {
		this.healthMeter.value = newVal
	}

	readonly killsCounter = ref<number>(0)

	updateKillsCounter(newVal: number): void {
		this.killsCounter.value = newVal
	}

}
