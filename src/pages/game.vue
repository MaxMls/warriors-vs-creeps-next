<template>
	<div :class='[cs.ctn, style.ctn]' ref="ctn">
		<div :class="style.statsPanelCtn">
			<div :class="style.statsPanel">
				<div :class="[style.statCtn,  style.statCtnCounter]" v-for="i in ['creep', 'heart', 'time']">
					<SvgIcon :class="style.statIcon" :name="i"/>
					<div :class="[style.statValue]">
						{{ game[i] }}
					</div>
				</div>
				<div
					 :class="[style.statCtn, style.statCtnCrane, {[style.statCtn_selected]: game.stacksToClick.has(-1)}]"
					 @click="game.stacksToClick.has(-1) && game.onStackClick(-1)"
				>
					<SvgIcon v-if="game.scrapType === 'fix'" :class="style.statIcon" name="fix"/>
					<SvgIcon v-else-if="game.scrapType === 'move'" :class="style.statIcon" name="cranMove"/>
					<SvgIcon v-else :class="style.statIcon" name="cran"/>
				</div>
				<div
					 :class="[style.statCtn, style.statCtnTrash, {[style.statCtn_selected]: game.stacksToClick.has(-2)}]"
					 @click="game.stacksToClick.has(-2) && game.onStackClick(-2)"
				>
					<SvgIcon :class="style.statIcon" name="trash"/>
				</div>
				<div :class="[style.statCtn, style.statCtnDirection]">
					<SvgIcon :class="style.statIcon" name="direction"/>
				</div>
			</div>
		</div>

		<div :class="style.gamePanel">
			<GameMapComponent v-if=map.gameMap :renderMap="map"/>
		</div>
		<div :class="style.handPanelCtn">
			<div :class="style.handPanel">

				<div v-for="(idx, i) in game.handCards" :class="style.handPanelCard" @click="game.onHandClick?.(i)">
					<CardComponent :idx="idx" :select="!!game.onHandClick" :active="game.handActiveCardInd === i"/>
				</div>
			</div>
		</div>
		<div :class="style.termPanel" :ref="visual.setItemTermPanelRef">
			<div v-for="(stack, i) in game.stacks" :class="style.termSlot" :ref="visual.setItemTermSlotRef">
				<div :class="style.termCard" @click="game.stacksToClick.has(i) && game.onStackClick(i)">
					<CardComponent :stack="stack" :select="game.stacksToClick.has(i)"/>
					<div :class="[style.termGradient,
						 {[style.termGradient_select]: game.stacksToClick.has(i),
						  [style.termGradient_empty]: !stack.length}]"/>
				</div>
			</div>
		</div>
		<div v-show=game.message :class="style.message">
			{{ game.message }}
		</div>
		<div v-if=game.selectsCards.length v-horizontal-scroll :class="style.selectPopupCtn">
			<div :class="style.selectPopup">
				<div v-for="(idx, i) in game.selectsCards"
				     :class="style.selectPopupCard"
				     @click="game.onCardClick(i)"
				>
					<CardComponent :idx="idx" :select="true"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang=ts>
import style from "./game.module.scss";
import cs from "./common.module.scss";
import {
	computed, defineComponent,
	inject,
	isRef,
	onBeforeMount,
	onBeforeUnmount, onBeforeUpdate,
	onMounted, onUpdated, reactive,
	ref,
	shallowRef,
	triggerRef,
	unref
} from "vue";
import CardComponent from "../components/CardComponent.vue";
import GameMapComponent from "../components/GameMapComponent.vue";
import {IRenderMap} from "../engine/renders/vue-render";
import SvgIcon from "../components/SvgIcon.vue";
import {Game} from "../engine/game";
import {GameMap} from "../engine/game-map";
import {AbstractAgent} from "../engine/agents/abstract-agent";
import {LocalAgent} from "../engine/agents/local-agent";
import {BotAgent} from "../engine/agents/bot-agent";
import {AbstractRender} from "../engine/renders/abstract-render";
import {ECardType, EDirection, EHighlight, TCardId, TStackId} from "../engine/types";
import {Cell} from "../engine/cell";
import cloneDeep from "lodash/cloneDeep";
import {cardsJSON} from "../engine/cards";

const useVisualGame = () => {
	const termPanelRef = ref<HTMLElement | null>(null);
	const termSlotRefs: HTMLElement[] = []

	const recalculateTermCardsBottomOffset = () => {
		const termPanel = unref(termPanelRef) as HTMLElement
		const ctnHeight = termPanel.getBoundingClientRect().height
		for (const slot of termSlotRefs) {
			const card = slot.querySelector('.' + style.termCard) as HTMLElement
			const v = Math.min(0, (ctnHeight - card.getBoundingClientRect().height)) + 'px'
			if (card.style.top !== v) card.style.top = v
		}
	}
	/*onBeforeUpdate(() => {
	})
	onUpdated(()=>{
	})
*/
	onMounted(() => {
		recalculateTermCardsBottomOffset()
		window.addEventListener("resize", recalculateTermCardsBottomOffset);
	})

	onBeforeUnmount(() => {
		window.removeEventListener("resize", recalculateTermCardsBottomOffset);
	})

	return {
		setItemTermSlotRef(v: any) {
			termSlotRefs.push(v)
		},
		setItemTermPanelRef(v: any) {
			termPanelRef.value = v
		},

	}
}
/*const useRenderGame = () => {
	let render = new VueRender()
	const lobby = unref(inject(LOBBY_PROVIDER) as AbstractLobby)
	const router = useRouter()

	let game: Game

	onBeforeMount(async () => {
		if (!lobby.game) {
			await router.push('/')
		} else {
			const seed = lobby.players.map(p => p.seed ?? '').join('.')

			const singlePlayer = !lobby.players.filter(p => !p.bot && p.name !== lobby.playerName).length
			//debugger
			let network = singlePlayer ? null : new ServerEventsNetwork(lobby.roomId as string)

			const gameMap = new GameMap([
				[1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
				[1, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0],
				[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 1, 1, 0, 0, 0, 0, 2, 0, 3, 0, 2],
				[1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0],
				[1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
			])

			const agents: AbstractAgent[] = []
			for (const player of lobby.players) {
				if (player.name == lobby.playerName) {
					agents.push(new LocalAgent(network, player.name, render))
				} else if (player.bot) {
					agents.push(new BotAgent(seed))
				} else {
					agents.push(new NetworkAgent(network!, player.name))
				}
			}

			game = new Game(render, agents, gameMap, seed)

		}
	})
	onMounted(() => {
		game.start()
	})

	return render
}*/

export default defineComponent({
	components: {SvgIcon, GameMapComponent, CardComponent},
	data: () => ({style, cs,}),
	setup() {

		const onRotationClick = ref<((ind: number) => void) | null>(null)
		const rotationsSelect = ref<EDirection[]>([])

		const chooseRotate: AbstractRender["chooseRotate"] = (rotateArray: EDirection[]): Promise<number> =>
			 new Promise<number>((resolve, reject) => {
				 rotationsSelect.value = rotateArray
				 onRotationClick.value = (ind: number) => {
					 onRotationClick.value = null
					 rotationsSelect.value = []
					 resolve(ind)
				 }
			 })

		const defeat: AbstractRender["defeat"] = () => {

		}

		const message = ref('')
		const hideMessage: AbstractRender["hideMessage"] = () => {
			message.value = ''
		}
		const showMessage: AbstractRender["showMessage"] = (text: string) => {
			message.value = text
		}

		const units = ref<IRenderMap['units']>(new Map())
		let keyGen = 0
		const initUnit: AbstractRender["initUnit"] = (cell: Cell) => {
			units.value.set(cell.unit, {cell, key: keyGen++})
		}
		const killUnit: AbstractRender["killUnit"] = (cell: Cell) => {
			console.log('killUnit', cell)
			units.value.delete(cell.unit)
		}
		const moveUnit: AbstractRender["moveUnit"] = (cellFrom: Cell, cellTo: Cell) =>
			 new Promise<void>((resolve) => {
				 const unit = cellFrom.unit || cellTo.unit
				 const {key} = units.value.get(unit)!
				 units.value.set(unit, {cell: cellTo, key})
				 setTimeout(resolve, 500)
			 })

		const cellsDirection = ref<IRenderMap['cellsDirection']>(new Map())

		const updateHeroDirection: AbstractRender["updateHeroDirection"] = (cell: Cell, orientation: EDirection) => {
			cellsDirection.value.set(cell.unit, orientation)
		}

		const selectsCards = ref<TCardId[]>([])
		const onCardClick = ref<((card: TCardId) => void) | null>(null)

		const selectCard = (cards: TCardId[]): Promise<number> => {
			return new Promise((resolve, reject) => {
				selectsCards.value = cards

				onCardClick.value = (card: TCardId) => {
					onCardClick.value = null
					selectsCards.value = []
					resolve(card)
				}
			})
		}

		const handCards = ref<TCardId[]>([])
		const setHand = (cards: TCardId[]) => {
			handCards.value = cards
		}

		const stacks = ref<TCardId[][]>([[], [], [], [], [], []])
		const setStacks = (value: TCardId[][]) => {
			stacks.value = cloneDeep(value)
		}

		const onStackClick = ref<((stack: TStackId) => void) | null>(null)
		const stacksToClick = ref<Map<TStackId, number>>(new Map())

		const selectStacks: AbstractAgent["selectStacks"] = (stacks: TStackId[], count: number) =>
			 new Promise<number[]>((resolve, reject) => {
				 stacks.forEach((v, i) => stacksToClick.value.set(v, i))
				 const res: number[] = []
				 onStackClick.value = (num: TStackId) => {
					 const ind = stacksToClick.value.get(num)!
					 res.push(ind)
					 if (res.length === count) {
						 stacksToClick.value.clear()
						 onStackClick.value = null
						 resolve(res)
					 }
				 }
			 })

		const onHandClick = ref<((ind: number) => void) | null>(null)
		const handActiveCardInd = ref<number | null>(null)
		const scrapType = ref('')
		const programming = (stacks: TStackId[]): Promise<[number, number]> => {
			return new Promise(async (resolve, reject) => {
				onHandClick.value = (ind: number) => {
					handActiveCardInd.value = ind === handActiveCardInd.value ? null : ind

					if (handActiveCardInd.value !== null) {
						scrapType.value = {
							[ECardType.Electro]: 'move',
							[ECardType.Computer]: 'move',
							[ECardType.Fire]: 'fix',
							[ECardType.Metal]: 'fix',
						}[cardsJSON[handCards.value[handActiveCardInd.value]].type]

						stacks.forEach((v, i) => stacksToClick.value.set(v, i))
						onStackClick.value = (stackId: TStackId) => {
							const stackInd = stacksToClick.value.get(stackId)!
							onStackClick.value = null
							onHandClick.value = null
							const handCardInd = handActiveCardInd.value!
							stacksToClick.value.clear()
							handActiveCardInd.value = null
							scrapType.value = ''
							resolve([handCardInd, stackInd])
						}
					} else {
						scrapType.value = ''
						stacksToClick.value.clear()
						onStackClick.value = null
					}
				}

			})
		}

		const onCellClick = ref<IRenderMap['onCellClick']>(null)
		const cellsToSelect = ref<IRenderMap['cellsToSelect']>(new Map())

		const selectCells = (cells: Cell[], highlight: number & EHighlight, count: number): Promise<number[]> => {
			//console.log({cells, highlight, count})
			//const m = this.vueRender.showMessage('Select ' + count + ' cells for ' + EHighlight[highlight])
			return new Promise((resolve, reject) => {
				for (let i = 0; i < cells.length; i++) {
					cellsToSelect.value.set(cells[i], {highlight, ind: i})
				}
				//	triggerRef(cellsToSelect.value)

				const clickedInds: number[] = []
				onCellClick.value = (cell) => {
					const v = cellsToSelect.value.get(cell)
					if (v) {
						cellsToSelect.value.delete(cell)
						const {ind, highlight} = v
						clickedInds.push(ind)
						if (clickedInds.length === count) {
							onCellClick.value = null
							hideMessage()
							cellsToSelect.value.clear()
							resolve(clickedInds)
						}
						//triggerRef(cellsToSelect.value)
					}
				}

			})
		}

		const gameMap = ref<IRenderMap['gameMap']>(null)
		const renderMap = (inputMap: GameMap) => {
			gameMap.value = inputMap
		}

		const time = ref('0:00')
		let timerInterval: NodeJS.Timer | null = null

		const startTimer = (secCount: number): void => {
			let realSecond = secCount;

			const updateTimer = () => {
				let seconds = realSecond % 60;
				let minutes = (realSecond / 60) | 0;
				if (realSecond < 0) {
					if (timerInterval !== null) {
						clearInterval(timerInterval);
						timerInterval = null
					}
				} else {
					time.value = realSecond < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;
					realSecond--;
				}
			}
			updateTimer();
			timerInterval = setInterval(updateTimer, 1000);
		}

		const stopTimer = () => {
			if (timerInterval !== null) {
				clearInterval(timerInterval);
				timerInterval = null
			}
			time.value = '0:00'
		}
		const stopSelect = () => {
			onRotationClick.value = null
			onCardClick.value = null
			onStackClick.value = null
			onCellClick.value = null
			onHandClick.value = null
		}

		const heart = ref(0)
		const updateBombCounter = (value: number) => {
			heart.value = value
		}

		const creep = ref(0)
		const updateKillsCounter = (value: number) => {
			creep.value = value
		}

		const render: AbstractRender = {
			chooseRotate, defeat, hideMessage, initUnit, killUnit,
			moveUnit, updateHeroDirection, selectCard, setHand,
			showMessage, setStacks, selectStacks,
			programming, renderMap, selectCells,
			startTimer, stopTimer, stopSelect,
			updateBombCounter, updateKillsCounter
		}

		onMounted(() => {
			const seed = 'test'

			const gameMap = new GameMap([
				[1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
				[1, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0],
				[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 1, 1, 0, 0, 0, 0, 2, 0, 3, 0, 2],
				[1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0],
				[1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
			])

			const agents: AbstractAgent[] = []

			agents.push(new LocalAgent(null, null, unref(render)))
			agents.push(new BotAgent(seed))
			agents.push(new BotAgent(seed))
			agents.push(new BotAgent(seed))

			const game = new Game(unref(render), agents, gameMap, seed)

			game.start()

			// render.setStacks([[15], [], [], [], [], []])
		})

		return {
			game: reactive({
				onRotationClick, rotationsSelect,
				message,
				selectsCards, onCardClick,
				handCards,
				stacks,
				onStackClick, stacksToClick,
				onHandClick, handActiveCardInd, scrapType,
				time,
				heart,
				creep
			}),
			map: reactive({
				onCellClick, cellsToSelect,
				gameMap,
				units,
				cellsDirection,
			}),
			visual: useVisualGame(),
		}
	}
})

</script>
