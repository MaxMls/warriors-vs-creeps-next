<template>
	<div :class=cs.ctn>
		<div :class="[$style.buttonsGroup, $style.buttonsTop, ]">

			<div>
				<button type=button @click="lobby.instance.addBot()" :class="[$style.buttonTop, $style.button]">
					Создать бота
				</button>
				<button ref="shareBtn" type=button :class="[$style.buttonTop, $style.button]">
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
				<div :class="[$style.slotImage, {[$style.slotImage_ready]: player.ready}]"
				     :style='`background: ${colors[i]}`'>
					<img/>
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

import {inject, onBeforeUnmount, onMounted, ref, unref} from "vue";
import {Vue, Options, setup} from "vue-class-component"
import {LOBBY_PROVIDER} from "../../context/network.context";
import {AbstractLobby, ILobbyPlayer} from "../../engine/lobby/abstract-lobby";
import ClipboardJS from "clipboard";

class Props {}

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

@Options({
	components: {},
	inheritAttrs: false
})
export default class Lobby extends Vue.with(Props) {
	lobby = setup(() => useInjectLobby())
	colors = ['#F7AEF8', '#B388EB', '#8093F1', '#72DDF7']

	get roomId() {
		return this.$route.params.roomId
	}


	exit() {
		this.lobby.instance.destroy()
		this.$router.push('/')
	}

	clipboard: ClipboardJS | null = null


	mounted() {
		try {
			if (this.lobby.instance.roomId !== this.roomId) {
				this.$router.push('/')
			} else {
				this.clipboard = new ClipboardJS(this.$refs.shareBtn as Element, {
					text: (elem) => {
						return this.roomId as string
					}
				});

				this.lobby.instance.on('gameStart', this.gameStart)
			}
		} catch (e) {
			console.error(e)
			this.$router.push('/')
		}
	}

	gameStart() {
		console.log('gameStart')
		this.$router.push('/game')
	}

	beforeUnmount() {
		this.lobby.instance.off('gameStart', this.gameStart)
		this.clipboard?.destroy()
	}


}
</script>

<style module="cs" lang=scss src="../common.scss"/>
<style module lang=scss>

.buttonsGroup {
	padding: 40px 50px 39px;
}

.button {
	cursor: pointer;
	display: inline-block;
	border: 1px solid black;
	padding: 15px 40px;
}

.buttonTop {
	font-size: 16px;

	& + .buttonTop {
		border-left: none;
	}
}

.buttonsTop {
	border-bottom: 1px solid black;
	display: flex;
	justify-content: space-between;
}

.slotsGroup {
	padding: 60px 0 50px;
	border-bottom: 1px solid black;
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
	width: 100px;
	height: 100px;
	border: 1px solid black;

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
	text-align: center;
	font-size: 16px;
	color: #808080;
	display: block;
	margin: 0 auto;

	border-bottom: 1px solid transparent;

	&:not([disabled]) {
		&:hover {
			border-bottom-color: #808080;
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
	outline: 2px solid #95f180;
	outline-offset: -3px;
	//border-color: #95f180;
}

.buttonStart_ready {
	color: #2dc00a;
}
</style>
