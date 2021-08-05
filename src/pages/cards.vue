<template>
	<div :class=$style.c>

		<div v-for="i in cards">
			<CardComponent :idx="i - 1"/>
		</div>

	</div>
</template>

<script lang=ts>
import {Options, Vue} from "vue-class-component";
import {cardsJSON} from "../engine/cards";
import CardComponent from "../components/CardComponent.vue";

@Options({
	components: {CardComponent: CardComponent}
})
export default class GamePage extends Vue {

	get cards() {
		return cardsJSON.length
	}
}

</script>

<style module lang=scss>
.c {

	width: 100%;
	display: grid;
	grid-gap: 10px;
	// grid-auto-flow: row;
	grid-template-columns: repeat(auto-fill, 200px);
	justify-content: space-around;
}

</style>
