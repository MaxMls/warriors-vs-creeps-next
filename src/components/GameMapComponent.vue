<template>
	<div :class="sty.map">
		<div :class="sty.grid"
		     :style="`grid-template-columns: repeat(${map.width}, 1fr); grid-template-rows: repeat(${map.height}, 1fr); `">
			<div
				 v-for="coord in map.size"
				 :ref="(v) => setCellRef(v, cell(coord))"
				 :class="sty.cell"
			>
<!--
				{{ coord - 1 }}<br/>
				{{ (coord - 1) % map.width }} {{ (((coord - 1) / map.width) | 0) }}
-->

			</div>
		</div>
		<div :class="sty.units">
			<div
				 v-for="unitEntry in map.units.value"
				 :style="unitStyle(unitEntry)"
				 :class="unitClass(unitEntry)"
			/>
		</div>
		<div :class="sty.selects">

			<!--				<div
								 v-for="unitEntry in map.units.value"
								 :style="unitStyle(unitEntry)"
								 :class="unitClass(unitEntry)"
							/>-->
		</div>
	</div>
</template>

<style module="_sty" lang=scss src="./GameMapComponent.module.scss"/>
<script lang=ts>
import sty from "./GameMapComponent.module.scss"

import {Options, prop, setup, Vue} from "vue-class-component";
import {VueRenderMap} from "../engine/renders/vue-render";
import {unref} from "vue";
import {coordsToString} from "../common";
import {Cell} from "../engine/cell";
import {Unit} from "../engine/unit";
import {EUnitType} from "../engine/types";

class Props {
	renderMap = prop<VueRenderMap>({required: true, type: VueRenderMap})// = prop<VueRenderMap>({required: true, type: VueRenderMap})
}

const useRenderMap = () => {
	return {}
}

@Options({
	data() {
		return {sty}
	}
})
export default class GameMapComponent extends Vue.with(Props) {
	constructor(...props) {
		super(...props);

		console.log(unref(this.renderMap))
		//c//onsole.log(props)
		//console.log(this.renderMap)
	}

	private cellsRefs = new Map<Cell, HTMLElement>()

	setCellRef(ref, cell: Cell) {
		this.cellsRefs.set(cell, ref)
	}

	unitStyle([unit, cell]: [Unit, Cell]) {
		const el = this.cellsRefs.get(cell)
		//console.log(el.offsetLeft, el.offsetTop)
		return `
			left: ${el.offsetLeft}px;
			top: ${el.offsetTop}px;
			width: ${el.clientWidth}px;
			height: ${el.clientHeight}px;
		`
	}

	unitClass([unit, cell]: [Unit, Cell]) {
		return [sty.unit, sty['unitType_' + EUnitType[unit.type]]]
	}

	get map() {
		return this.renderMap
	}

	cell(coord) {
		const x = ((coord - 1) % this.map.width)
		const y = (((coord - 1) / this.map.width) | 0)
		return this.map.gameMap.value?.getCell(x, y)
	}


}
</script>


