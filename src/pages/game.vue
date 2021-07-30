<template>
	<div :class='[cs.ctn, style.ctn]' ref="ctn">
		<div :class="style.statsPanelCtn">
			<div :class="style.statsPanel">
				<div :class="[style.statCtn,  style.statCtnCounter]" v-for="i in ['creep', 'heart', 'time']">
					<SvgIcon :class="style.statIcon" :name="i"/>
					<div :class="[style.statValue]">
						99
					</div>
				</div>
				<div :class="[style.statCtn, style.statCtnCrane]">
					<SvgIcon :class="style.statIcon" name="cran"/>
				</div>
				<div :class="[style.statCtn, style.statCtnTrash]">
					<SvgIcon :class="style.statIcon" name="trash"/>
				</div>
				<div :class="[style.statCtn, style.statCtnDirection]">
					<SvgIcon :class="style.statIcon" name="direction"/>
				</div>
			</div>
		</div>

		<div :class="style.gamePanel">
			<GameMapComponent v-if=game.map.gameMap :renderMap="game.map"/>
		</div>
		<div :class="style.handPanelCtn">
			<div :class="style.handPanel">

				<div v-for="(idx, i) in game.handCards" :class="style.handPanelCard" @click="game.onHandClick(i)">
					<CardComponent  :idx="idx" :select="!!game.onHandClick" :active="game.handActiveCardInd === i"/>
				</div>
			</div>
		</div>
		<div :class="style.termPanel" :ref="visual.setItemTermPanelRef">
			<div v-for="stack in game.stacks" :class="style.termSlot" :ref="visual.setItemTermSlotRef">
				<div :class="style.termCard">
					<CardComponent :stack="stack" :level="stack.length"/>
					<div :class="style.termGradient"/>
				</div>
			</div>
		</div>
		<div v-show=game.message :class="style.message">
			{{ game.message }}
		</div>
		<div v-if=game.selectsCards.length v-horizontal-scroll :class="style.selectPopupCtn">
			<div :class="style.selectPopup">
				<div v-for="idx in game.selectsCards" :class="style.selectPopupCard">
					<CardComponent :stack="[idx]"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang=ts>
import style from "./game.module.scss";
import cs from "./common.module.scss";

import {onBeforeUnmount, onMounted, ref, unref} from "vue";
import {Options, setup, Vue} from "vue-class-component";
import CardComponent from "../components/CardComponent.vue";
import GameMapComponent from "../components/GameMapComponent.vue";
import {VueRender} from "../engine/renders/vue-render";
import SvgIcon from "../components/SvgIcon.vue";

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
const useRenderGame = () => {
	/*	const lobby = unref(inject(LOBBY_PROVIDER) as AbstractLobby)
		const router = useRouter()

		let game: Game*/
	let render = new VueRender()

	/*
		onBeforeMount(async () => {
			if (!lobby.game) {
				await router.push('/')
			} else {
				const seed = lobby.players.map(p => p.seed ?? '').join('.')
				const network = new ServerEventsNetwork(lobby.roomId as string)
				const gameMap = new GameMap([
					[1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
					[1, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0],
					[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[1, 1, 1, 0, 0, 0, 0, 2, 0, 3, 0, 2],
					[1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0],
					[1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
				])

				const render = new VueRender()

				const agents: AbstractAgent[] = []
				for (const player of lobby.players) {
					if (player.name == lobby.playerName) {
						agents.push(new LocalAgent(network, player.name, render))
					} else if (player.bot) {
						agents.push(new BotAgent(seed))
					} else {
						agents.push(new NetworkAgent(network, player.name))
					}
				}

				game = new Game(render, agents, gameMap, seed)

			}
		})

	*/

	onMounted(() => {
		//game.start()
	})

	return render
}

@Options({
	data: () => ({style, cs}),
	components: {SvgIcon, GameMapComponent, CardComponent},
	inheritAttrs: false
})
export default class GamePage extends Vue {
	visual = setup(() => useVisualGame())
	game = setup(() => useRenderGame())
}

</script>
