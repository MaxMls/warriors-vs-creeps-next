<template>
	{{ players }}
	<div :class=cs.ctn>

		<div :class="[$style.buttonsGroup, $style.buttonsTop, ]">

			<div>
				<button @click=addBot :class="[$style.buttonTop, $style.button]">
					Создать бота
				</button>
				<button :class="[$style.buttonTop, $style.button]">
					Копировать ссылку-приглашение
				</button>
			</div>
			<div>
				<router-link to='/' :class="[$style.buttonTop, $style.button]">
					Выйти из лобби
				</router-link>
			</div>
		</div>
		<div :class="[$style.slotsGroup]">
			<div v-for="i in 4" :class="[$style.slotCtn]">
				<div :class="[$style.slotImage]">
					<img/>
				</div>
				<div :class="[$style.slotName]">
					Свободный слот
				</div>
				<button :class="[$style.slotKick]">
					Удалить
				</button>
			</div>
		</div>
		<div :class="[$style.buttonsGroup, $style.buttonsBot]">
			<button :class="[$style.buttonStart, $style.button]">
				Готов начать игру
			</button>
		</div>
	</div>
</template>

<script lang=ts>

import {unref} from "vue";
import {Vue, Options, setup} from "vue-class-component"
import {LOBBY_PROVIDER} from "../../context/network.context";
import {AbstractLobby} from "../../engine/lobby/abstract-lobby";

class Props {
	_lobbyId: String | undefined
	lobbyId: String | undefined
}

@Options({
	components: {},
	inject: [LOBBY_PROVIDER],
})
export default class Lobby extends Vue.with(Props) {
	get lobby() {
		return unref(this[LOBBY_PROVIDER] as AbstractLobby)
	}

	get roomId() {
		return this.$route.params['roomId']
	}

	get players() {
		console.log(this.lobby.players)
		return this.lobby.players
	}

	addBot() {
		this.lobby.addBot()
	}


	mounted() {
		console.log('inject', this.lobby)
		console.log('props', this.roomId)
		// console.log(this.lobby.roomId, this.roomId)
		try {
			if (this.lobby.roomId !== this.roomId) {
				this.$router.push('/')
			}
		} catch (e) {
			this.$router.push('/')
		}
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
	width: 100px;
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

.slotKick {
	text-align: center;
	font-size: 16px;
	color: #808080;
	display: block;
	margin: 0 auto;
}

.buttonsBot {
	display: flex;
	justify-content: center;
}

.buttonStart {
	font-size: 20px;
}

</style>
