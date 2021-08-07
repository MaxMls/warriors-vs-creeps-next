<template>
	<div :class="[cs.ctn, $style.ctn]">
		<div :class="[$style.buttonsGroup, $style.buttonsTop, ]">

			<div>
				<button type=button @click="lobby.instance.addBot()" :class="[$style.buttonTop, $style.button]">
					Создать бота
				</button>
				<button :ref="shareBtn" type=button :class="[$style.buttonTop, $style.button]">
					Копировать ссылку-приглашение
				</button>
			</div>
			<div>
				<button type=button @click=exit :class="[$style.buttonTop, $style.button]">
					Выйти из лобби
				</button>
			</div>
		</div>
		<div :class="[$style.slotsGroup]">

			<div v-for="(player, i) in lobby.players" :class="[$style.slotCtn]">
				<div
					 :class="[$style.slotImage, {[$style.slotImage_ready]: player.ready}]"
					 :style='`background: ${colors[i]}`'
				>
					<UnitComponent
						 skin=gura
						 state=idle
					/>
				</div>
				<div :class="[$style.slotName, {[$style.slotNameMe]: player.name === lobby.playerName}]">
					{{ player.alias }}
				</div>
				<button type=button @click="lobby.instance.kick(player.name)" :class="[$style.slotKick]"
				        :disabled="!player.bot">
					Удалить
				</button>
			</div>

			<div v-for="() in (4 - lobby.players.length)" :class="[$style.slotCtn]">
				<div :class="[$style.slotImage]"/>
				<div :class="[$style.slotName]">Свободный слот</div>
			</div>

		</div>
		<div :class="[$style.buttonsGroup, $style.buttonsBot]">
			<button @click="lobby.instance.ready(false)" v-if="lobby.player?.ready" type=button
			        :class="[$style.buttonStart, $style.button,$style.buttonStart_ready]">
				Ждем других игроков
			</button>
			<button @click="lobby.instance.ready(true)" v-else type=button :class="[$style.buttonStart, $style.button]">
				Готов начать игру
			</button>
		</div>
	</div>
</template>

<script lang=ts>

import {defineComponent, inject, onBeforeUnmount, onMounted, reactive, ref, unref} from "vue";
import {LOBBY_PROVIDER} from "../../context/network.context";
import {AbstractLobby, ILobbyPlayer} from "../../engine/lobby/abstract-lobby";
import ClipboardJS from "clipboard";
import {useRoute, useRouter} from "vue-router";
import cs from "../common.module.scss"
import UnitComponent from "../../components/UnitComponent.vue";

const useInjectLobby = () => {
	const lobby = unref(inject(LOBBY_PROVIDER) as AbstractLobby)

	const players = ref<ILobbyPlayer[]>([])
	const player = ref<ILobbyPlayer | null>(null)
	const updatePlayers = () => {
		console.log('updatePlayers')
		players.value = [...lobby.players]
		player.value = lobby.player
	}

	const playerName = ref<string | null>(null)
	const updatePlayerName = () => {
		console.log('updatePlayerName')
		playerName.value = lobby.playerName
	}

	onMounted(async () => {
		updatePlayers()
		lobby.on('players', updatePlayers)
		updatePlayerName()
		lobby.on('playerName', updatePlayerName)
	})

	onBeforeUnmount(async () => {
		lobby.off('players', updatePlayers)
		lobby.off('playerName', updatePlayerName)
	})

	console.log(lobby.players)
	return {
		players,
		playerName,
		instance: lobby,
		player
	}
}

export default defineComponent({
	components: {UnitComponent},
	data: () => ({cs}),
	setup() {
		const lobby = useInjectLobby()
		const $router = useRouter()
		const $route = useRoute()
		const roomId = $route.params.roomId
		const shareBtn = ref<Element | null>(null)
		let clipboard: ClipboardJS | null = null

		const gameStart = () => {
			$router.push('/game')

		}

		onMounted(() => {
			try {
				if (lobby.instance.roomId !== $route.params.roomId) {
					$router.push('/')
				} else {
					clipboard = new ClipboardJS(shareBtn.value!, {
						text: (elem) => roomId as string
					});

					lobby.instance.on('gameStart', gameStart)
				}
			} catch (e) {
				console.error(e)
				$router.push('/')
			}
		})

		onBeforeUnmount(() => {
			lobby.instance.off('gameStart', gameStart)
			clipboard?.destroy()
		})

		return {
			shareBtn: (v) => {
				shareBtn.value = v
			},
			lobby: reactive(lobby),
			colors: ['#F7AEF8', '#B388EB', '#8093F1', '#72DDF7'],
			exit() {
				lobby.instance.destroy()
				$router.push('/')
			}
		}
	}
})
</script>

<style module lang=scss>
$e: #eee;
.buttonsGroup {
	padding: 40px 50px 39px;
}

.ctn {
	background: white;
	border-color: $e;
	border-radius: 15px;
}

.button {
	cursor: pointer;
	display: inline-block;
	border: 1px solid #808080;
	padding: 15px 40px;


	background: white;
	border-radius: 5px;
}

.buttonTop {
	font-size: 16px;

	& + .buttonTop {
		margin-left: 10px;
		//border-left: none;
	}
}

.buttonsTop {
	border-bottom: 1px solid $e;
	display: flex;
	justify-content: space-between;
}

.slotsGroup {
	padding: 60px 0 50px;
	border-bottom: 1px solid $e;
	display: flex;
	justify-content: space-around;
}

.slotCtn {
	min-width: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	max-width: 200px;
	word-break: break-word;
}

.slotImage {
	position: relative;
	width: 100px;
	height: 100px;
	border: 1px solid #808080;
	border-radius: 10px;
	//background: #fff;

	& + .slotName {
		margin-top: 15px;
	}
}

.slotName {
	font-size: 18px;
	text-align: center;

	& + .slotKick {
		margin-top: 5px;
	}
}

.slotNameMe {
	font-weight: bold;
}

.slotKick {
	$c: #808080;
	$c: #7a7a7a;
	text-align: center;
	font-size: 16px;
	color: $c;
	display: block;
	margin: 0 auto;

	border-bottom: 1px solid transparent;

	&:not([disabled]) {
		&:hover {
			border-bottom-color: $c;
		}
	}

	&[disabled] {
		color: #dedede;
		cursor: default;
		//opacity: 0;
	}
}

.buttonsBot {
	display: flex;
	justify-content: center;
}

.buttonStart {
	font-size: 20px;
}


.buttonStart_ready, .slotImage_ready {
	border: 2px solid #95f180;
	//outline-offset: -3px;
	//border-color: #95f180;
	margin: -1px;
}

.slotImage_ready {

}

.buttonStart_ready {
	color: #2dc00a;
}
</style>
