<template>
	<div :class='[cs.ctn, style.ctn]' ref="ctn">

		<div :class="style.header">
			<div :class="style.headerLinks">

			</div>
			<div :class="style.headerMessage">
				<div :class="style.headerMessageText">
					<div :class="style.headerMessageTextCtn">
						<span style="visibility: hidden">{{ $t(game.message) }}</span>
						<span v-typer="$t(game.message)" :class="style.headerMessageTextRepeat"/>
					</div>
				</div>
			</div>
			<div :class="style.headerLinks">
				<router-link target='_blank' to="/rules" :class="style.headerLink">{{ $t('pages.game.7310') }}</router-link>
				<router-link target='_blank' to="/" :class="style.headerLink">{{ $t('pages.game.8708') }}</router-link>
			</div>

		</div>
		<div :class="style.statsPanelCtn">
			<div :class="style.statsPanel">
				<div :class="[style.statCtn,  style.statCtnCounter]" v-for="i in ['creep', 'heart', 'time']">
					<SvgIcon :class="style.statIcon" :name="i"/>
					<div :class="[style.statValue]">
						{{ game[i] }}
					</div>
				</div>
				<button
					 type=button
					 :disabled="!visual.stackIsClickable(-1)"
					 :class="[style.statCtn, style.statCtnCrane]"
					 @click="visual.stackIsClickable(-1) && visual.onStackClick(-1)"
				>
					<SvgIcon v-if="game.scrapType === 'fix'" :class="style.statIcon" name="fix"/>
					<SvgIcon v-else-if="game.scrapType === 'move'" :class="style.statIcon" name="cranMove"/>
					<SvgIcon v-else :class="style.statIcon" name="cran"/>
				</button>
				<button
					 type=button
					 :disabled="!visual.stackIsClickable(-1)"
					 :class="[style.statCtn, style.statCtnTrash]"
					 @click="visual.stackIsClickable(-2) && visual.onStackClick(-2)"
				>
					<SvgIcon :class="style.statIcon" name="trash"/>
				</button>
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
				<button
					 type=button
					 :disabled="!game.onHandClick"
					 v-for="(idx, i) in game.handCards"
					 :class="style.handPanelCard"
					 @click="game.onHandClick?.(i)"
				>
					<CardComponent :idx="idx" :select="!!game.onHandClick" :active="game.handActiveCardInd === i"/>
				</button>
			</div>
		</div>
		<div :class="style.termPanel" :ref="visual.setItemTermPanelRef">
			<div v-for="(stack, i) in game.stacks" :class="style.termSlot" :ref="visual.setItemTermSlotRef">
				<button
					 type=button
					 :disabled="!visual.stackIsClickable(i)"
					 :class="style.termCard"
					 @click="visual.onStackClick(i)">
					<CardComponent :stack="stack" :select="visual.stackIsClickable(i)"/>
					<div :class="[style.termGradient,
						 {[style.termGradient_select]: visual.stackIsClickable(i),
						  [style.termGradient_empty]: !stack.length}]"/>
				</button>
			</div>
		</div>

		<div v-click-outside v-opacity-delay v-if=game.selectsCards.length v-horizontal-scroll
		     :class="style.selectPopupCtn">
			<div :class="style.selectPopup">
				<button
					 type=button
					 :disabled="false"
					 v-for="(idx, i) in game.selectsCards"
					 :class="style.selectPopupCard"
					 @click="game?.onCardClick?.(i)"
				>
					<CardComponent :idx="idx" :select="true"/>
				</button>
			</div>
		</div>
		<div v-click-outside v-opacity-delay v-if=game.rotationsSelect.length :class="style.directionPopupCtn">

			<div :class="style.directionPopup">
				<div :class="style.directionPopupTitle">{{ $t('pages.game.7101') }}</div>
				<div :class="style.directionPopupChoose">
					<button
						 type=button
						 v-for="(rot, i) in game.rotationsSelect"
						 :class="style.directionPopupDirection"
						 @click="game?.onRotationClick?.(i)"
					>
						<SvgIcon
							 :style="visual.rotateDirectionStyle(game.rotationsSelectCurrentDirection, rot)"
							 name="direction"
							 :class="style.directionPopupIcon"/>
					</button>
				</div>
			</div>
		</div>
		<div v-if=game.popupMessage :class="style.messagePopupCtn">
			<div :class="style.messagePopup">
				<div :class="style.messagePopupTitle">
					{{ $t(game.popupMessage?.title) }}
				</div>
				<div :class="style.messagePopupText">
					{{ $t(game.popupMessage?.text) }}
				</div>
				<button
					 type=button
					 :class="style.messagePopupButton"
					 v-for="({text, handler}) in game.popupMessage?.buttons"
					 @click="handler"
				>{{ $t(text) }}
				</button>
			</div>
		</div>
	</div>
</template>

<script lang=ts>
import style from "./game.module.scss";
import cs from "./common.module.scss";

import {defineComponent, inject, onBeforeUnmount, onMounted, reactive, ref, unref} from "vue";
import CardComponent from "../components/CardComponent.vue";
import GameMapComponent from "../components/GameMapComponent.vue";
import {IRenderMap, TUnitSkin, TUnitState} from "../engine/renders/vue-render";
import SvgIcon from "../components/SvgIcon.vue";
import {Game} from "../engine/game";
import {GameMap} from "../engine/game-map";
import {AbstractAgent} from "../engine/agents/abstract-agent";
import {LocalAgent} from "../engine/agents/local-agent";
import {BotAgent} from "../engine/agents/bot-agent";
import {AbstractRender} from "../engine/renders/abstract-render";
import {
	directionToDeg,
	ECardType,
	EDirection,
	EHighlight,
	ERotation,
	EUnitType,
	rotateDirection,
	TCardId,
	TStackId
} from "../engine/types";
import {Cell} from "../engine/cell";
import cloneDeep from "lodash/cloneDeep";
import {cardsJSON} from "../engine/cards";
import {horizontalScrollDirective} from "../plugins/horizontal-scroll-directive";
import {typerDirective} from "../plugins/typer-directive";
import {opacityDelayDirective} from "../plugins/opacity-delay-directive";
import {clickOutsideDirective} from "../plugins/click-outside-directive";
import {useRoute, useRouter} from "vue-router";
import {User} from "../engine/user";
import {Unit} from "../engine/unit";
import {APP_PROVIDER} from "../context/network.context";
import {eventsServerUrl, Room} from "../engine/lobby/server-events-lobby";
import {dynamicSort, GlobalEventEmitter} from "../common";
import {NetworkAgent} from "../engine/agents/network-agent";
import {ServerEventsNetwork} from "../engine/networks/server-events-network";
import {AbstractNetwork} from "../engine/networks/abstract-network";

const useVisualGame = (game) => {
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
		rotateDirectionStyle(dir, rot){
			return `transform: rotate(${directionToDeg(rotateDirection(dir, rot))}deg)`
		},
		stackIsClickable(stackInd){
			return game.stacksToClick.value?.has(stackInd)
		},
		onStackClick(i){
			game.onStackClick.value?.(i)
		}

	}
}

const useRenderGameMap = () => {


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
						//hideMessage()
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
	//const skins = ref<Map<User, TUnitSkin>>(new Map())
	const skins = new Map<User, TUnitSkin>()

	const units = ref<IRenderMap['units']>(new Map())
	let keyGen = 0
	const initUnit: AbstractRender["initUnit"] = (cell: Cell) => {
		const tts = {
			[EUnitType.Creep]: 'greenSlime' as TUnitSkin,
			[EUnitType.Bomb]: 'cake' as TUnitSkin,
			[EUnitType.Hero]: skins.get(cell.unit?.ownerUser) as TUnitSkin,
		}
		const instance = {
			cell,
			key: keyGen++,
			skin: tts[cell.unit.type],
			state: 'idle' as TUnitState
		}
		units.value.set(cell.unit, instance)

		/*setInterval(() => {
			units.value.get(cell.unit)!.state = instance.state === 'idle' ? 'walk' : 'idle'
		}, 2000)*/
	}
	const killUnit: AbstractRender["killUnit"] = (cell: Cell) => {
		//console.log('killUnit', cell)
		units.value.delete(cell.unit)
	}
	const moveUnitMs = 500
	const moveUnit: AbstractRender["moveUnit"] = (unit: Unit, cellTo: Cell) =>
		 new Promise<void>((resolve) => {
			 // const unit = cellFrom.unit || cellTo.unit
			 const unitInstance = units.value.get(unit)!
			 unitInstance.cell = cellTo
			 unitInstance.state = 'walk'

			 setTimeout(() => {
				 unitInstance.state = 'idle'
				 resolve()
			 }, moveUnitMs)
		 })

	const cellsDirection = ref<IRenderMap['cellsDirection']>(new Map())

	const updateHeroDirection: AbstractRender["updateHeroDirection"] = (cell: Cell, orientation: EDirection) => {
		cellsDirection.value.set(cell.unit, orientation)
	}

	const render = {
		initUnit, killUnit,
		moveUnit, updateHeroDirection,
		renderMap, selectCells,
	}

	return {
		skins,
		render,
		onCellClick, cellsToSelect,
		gameMap,
		units,
		cellsDirection,
		moveUnitMs
	}

}


const useRenderGame = () => {

	const onRotationClick = ref<((ind: number) => void) | null>(null)
	const rotationsSelect = ref<ERotation[]>([])
	const rotationsSelectCurrentDirection = ref<EDirection | null>(null)

	const chooseRotate: AbstractRender["chooseRotate"] = (rotateArray: ERotation[], currentDirection: EDirection): Promise<number> =>
		 new Promise<number>((resolve, reject) => {
			 rotationsSelect.value = rotateArray
			 rotationsSelectCurrentDirection.value = currentDirection
			 onRotationClick.value = (ind: number) => {
				 onRotationClick.value = null
				 rotationsSelectCurrentDirection.value = null
				 rotationsSelect.value = []
				 resolve(ind)
			 }
		 })

	const popupMessage = ref<null | {
		title: string, text: string,
		buttons: { text: string, handler: () => void }[]
	}>(null)

	const router = useRouter()
	//const {t} = useI18n()
	const defeat: AbstractRender["defeat"] = (text) => {
		message.value = 'game.0'
		popupMessage.value = {
			title: 'game.1',
			text: text || 'game.2',
			buttons: [
				{
					text: 'game.3',
					handler: () => router.push('/')
				}
			]
		}
	}
	const win: AbstractRender["win"] = () => {
		message.value = 'game.0'
		popupMessage.value = {
			title: 'game.4',
			text: 'game.5',
			buttons: [
				{
					text: 'game.3',
					handler: () => router.push('/')
				}
			]
		}
	}

	const error: AbstractRender["error"] = (text) => {
		message.value = 'game.0'
		popupMessage.value = {
			title: 'game.6',
			text,
			buttons: [
				{
					text: 'game.3',
					handler: () => router.push('/')
				}
			]
		}
	}

	const message = ref('')
	const hideMessage: AbstractRender["hideMessage"] = () => {
		message.value = ''
	}
	const showMessage: AbstractRender["showMessage"] = (text: string) => {
		message.value = text
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


	const time = ref('0:00')
	let timerInterval: any | null = null

	const startTimer = (secCount: number): void => {
		//console.log('startTimer')
		let date = new Date(0, 0, 0, 0, 0, 0)

		const updateTimer = () => {
			date = new Date(date.getTime() + 1000)
			time.value = date.toLocaleTimeString(undefined, {minute: 'numeric', second: '2-digit'})
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
		//onCellClick.value = null
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

	const render = {
		chooseRotate,
		defeat, win, error,
		hideMessage,
		selectCard, setHand,
		showMessage, setStacks, selectStacks,
		programming,
		startTimer, stopTimer, stopSelect,
		updateBombCounter, updateKillsCounter
	}


	return {
		render,
		onRotationClick, rotationsSelect, rotationsSelectCurrentDirection,
		message,
		selectsCards, onCardClick,
		handCards,
		stacks,
		popupMessage,
		onStackClick, stacksToClick,
		onHandClick, handActiveCardInd, scrapType,
		time,
		heart,
		creep
	}

}

const useStartGame = (render: AbstractRender, skins) => {
	const app = unref(inject(APP_PROVIDER))! as { room: Room }
	let {room} = app
	const router = useRouter()
	const route = useRoute()

	let network: AbstractNetwork | null = null;

	onMounted(async () => {
		if (!room) {
			if (route.query['testJoin'] !== undefined) {
				room = new Room()
				let roomName = localStorage.getItem('roomNameTest');
				room.setCurrentPlayerData({skin: 'ame', name: 'ame'})
				await room.joinRoom(roomName!)
				await new Promise((resolve) => room.on('players', resolve))
			} else if (route.query['testCreate'] !== undefined) {
				room = new Room()
				room.setCurrentPlayerData({skin: 'gura', name: 'gura'})
				let roomName = await room.openRoom()
				localStorage.setItem('roomNameTest', roomName);
				await new Promise((resolve) => room.on('players', resolve))
			} else {
				await router.push('/')
				return
			}
		}
		const players = room.players.sort(dynamicSort('selfId'))

		const seed = players.map(p => p.selfId).join('/')

		const gameMap = new GameMap([
			[1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
			[1, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0],
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 0, 0, 0, 0, 2, 0, 3, 0, 2],
			[1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0],
			[1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
		])


		for (const player of players) {
			if (player.selfId !== room.player.selfId && player.selfId === player.ownerId) {
				if (!network) {
					network = new ServerEventsNetwork(
						 await room.openRoom(),
						 new GlobalEventEmitter(eventsServerUrl, room.player.selfId)
					)
					await network.init()
				}
			}
		}

		const users = players.map((player) => {
			const agent =
				 (player.selfId === room.player.selfId) ? new LocalAgent(network, room.player.selfId, unref(render)) :
					  (player.selfId === player.ownerId) ? new NetworkAgent(network!, player.selfId, seed) :
							new BotAgent(seed)

			const user = new User(agent)
			skins.set(user, player.data.skin)
			return user
		})

		const game = new Game(unref(render), users, gameMap, seed, users[0])

		game.start()
		render.startTimer(0)
	})

	onBeforeUnmount(() => {
		network?.destroy()
	})
}

export default defineComponent({
	components: {SvgIcon, GameMapComponent, CardComponent},
	directives: {
		'horizontal-scroll': horizontalScrollDirective,
		'typer': typerDirective,
		'opacity-delay': opacityDelayDirective,
		'click-outside': clickOutsideDirective
	},
	data: () => ({style, cs,}),
	methods: {
		directionToDeg,
		rotateDirection,
	},
	setup() {
		const {render: gameRender, ...game} = useRenderGame()
		const {render: mapRender, skins, ...map} = useRenderGameMap()
		const render: AbstractRender = {...gameRender, ...mapRender}
		useStartGame(render, skins)

		return {
			game: reactive(game),
			map: reactive(map) as IRenderMap,
			visual: useVisualGame(game),
		}



	}
})

</script>
