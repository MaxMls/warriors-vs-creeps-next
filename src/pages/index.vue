<template>
	<div>
		<router-link to='/webtrctest/host'>host </router-link>
		<router-link to='/webtrctest/member'>member</router-link>
		<h1 :class="$style.title">
			Warriors vs Creeps 2
		</h1>
		<div :class="$style.buttonsGroup">
			<router-link to="/create" :class="$style.button">Создать игру</router-link>
			<router-link to="/join" :class="$style.button">Присоединится к игре</router-link>
		</div>
		<div :class="[cs.linksGroup, $style.linksGroup]">
			<div :class="cs.link">
				<a target=_blank href="https://github.com/blazzer-band/Warriors-vs-Creeps">Warriors vs Creeps 1</a>
			</div>
			<div :class="cs.link">
				<router-link to="/rules">Читать правила игры</router-link>
			</div>
			<div :class="cs.link">
				<a target=_blank href="https://github.com/blazzer-band/Warriors-vs-Creeps">Исходный код</a>
			</div>
		</div>
	</div>
</template>

<script lang=ts>

import {Vue, Options, setup} from "vue-class-component"
import {LOBBY_PROVIDER} from "../context/network.context";
class Props {
}
@Options({
	components: {},
	inject: [LOBBY_PROVIDER],
})
export default class Index extends Vue.with(Props) {

	mounted() {
		 //console.log('inject', this[LOBBY_PROVIDER])
	}


}
</script>

<style module="cs" lang=scss src="./common.scss"/>
<style module lang=scss>
.title {
	text-align: center;
	font-size: 34px;
	font-weight: bold;

	& + .buttonsGroup {
		margin-top: 65px;
	}
}

.button {
	display: inline-block;
	padding: 15px 40px;
	border: 1px solid black;
	font-size: 20px;

}

.buttonsGroup {
	display: grid;
	grid-gap: 65px;
	grid-auto-flow: column;
	justify-content: center;

	& + .linksGroup {
		margin-top: 75px;
	}
}


</style>
