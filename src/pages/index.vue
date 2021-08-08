<template>
	<div>
		<!--		<router-link to='/webtrctest/host'>host </router-link>
				<router-link to='/webtrctest/member'>member</router-link>-->
		<h1 :class="$style.title">
			Warriors vs Creeps 2
		</h1>
		<div :class="$style.buttonsGroup">
			<router-link to="/create" :class="$style.button">Создать игру</router-link>
			<router-link to="/join" :class="$style.button">Присоединится к игре</router-link>
		</div>
		<div :class="[cs.linksGroup, $style.linksGroup]">
			<div :class="[cs.link, $style.link]">
				<a target=_blank href="https://github.com/blazzer-band/Warriors-vs-Creeps">Warriors vs Creeps 1</a>
			</div>
			<div :class="[cs.link, $style.link]">
				<router-link target='_blank' to="/rules">Читать правила игры</router-link>
			</div>
		</div>
		<div :class="[cs.linksGroup, $style.linksGroup]">
			<div :class="[cs.link, $style.link]">
				<a target=_blank href="https://walfiegif.wordpress.com/">Анимация персонажей: Walfie Gif</a>
			</div>
			<div :class="[cs.link, $style.link]">
				<a target=_blank href="https://github.com/blazzer-band/Warriors-vs-Creeps">Исходный код</a>
			</div>
		</div>
	</div>
</template>

<script lang=ts>

import {Options, Vue} from "vue-class-component"
import {APP_PROVIDER} from "../context/network.context";

class Props {
}

@Options({
	components: {},
	inject: [APP_PROVIDER],
})
export default class Index extends Vue.with(Props) {

	mounted() {
		//console.log('inject', this[LOBBY_PROVIDER])
	}


}
</script>

<style module="cs" lang=scss src="./common.scss"/>
<style module lang=scss>
.linksGroup {
	display: flex;
	justify-content: center;

	& + .linksGroup {
		margin-top: 40px;
	}

	.link {
		margin: 0 40px;
	}
}


.title {
	text-align: center;
	font-size: 34px;
	color: #000;
	color: #de8d13;
	opacity: .7;

	font-size: 66px;
	font-weight: 600;

	& + .buttonsGroup {
		margin-top: 65px;
	}
}

.button {
	border-radius: 10px;
	background: rgba(255, 255, 255, .7);
	display: inline-block;
	padding: 15px 40px;
	border: 1px solid #eee;
	font-size: 20px;

	transition: .1s;

	&:hover {
		// border-color: #4e78de;
		background: #d1dcff;
		background: rgb(255, 161, 39, .7);
		color: #0f64ff;
		color: #fff;
		//order-color: #4b8bff;
		border-color: #fff;
		border-width: 2px;
		margin: -1px;

	}

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


.link {
	font-size: 20px;
	a {
		border-bottom: 1px solid #366bff;
		color: #3d71ff;
	}

}

</style>
