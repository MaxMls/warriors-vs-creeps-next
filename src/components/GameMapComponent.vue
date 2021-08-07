<template>
	<div :class="sty.map" v-if="map.gameMap">
		<div :class="sty.grid"
		     :style="`grid-template-columns: repeat(${map.gameMap?.size.x}, 1fr);aspect-ratio: ${map.gameMap?.size.x}/${map.gameMap?.size.y};`"
		     :ref="setGridRef"
		>
			<div
				 v-for="coord in (map.gameMap?.size.x * map.gameMap?.size.y)"
				 :ref="(v) => setCellRef(cell(coord), v)"
				 :class="[sty.cell, {[sty.cellDark]: chessCell(coord)}]"
			>
				<div :class="[sty.cellType, cellClass(cell(coord))]"/>
			</div>
		</div>
		<div v-if="!!gridRef && !!cellsRefs.size" :class="sty.units">
			<div
				 v-for="[unit, {cell, key, state, skin}] in map.units"
				 :style="layerPositionStyle(cell)+ `transition: left ${map.moveUnitMs}ms, top ${map.moveUnitMs}ms;`"
				 :key="key"
				 :class="sty.unitCtn"
			>
				<UnitComponent
					 :skin="skin"
					 :state="state"
					 :direction="map.cellsDirection.has(unit) ? map.cellsDirection.get(unit) : null"
				/>


			</div>
		</div>
		<div v-if="map.cellsToSelect.size" :class="sty.select">
			<button
				 type=button
				 v-for="([cell, {highlight}]) in map.cellsToSelect"
				 :style="layerPositionStyle(cell)"
				 :class="selClass(highlight)"
				 @click="map.onCellClick(cell)"
			>
			</button>
		</div>
	</div>
</template>

<style module="_sty" lang=scss src="./GameMapComponent.module.scss"/>
<script lang=ts>
import sty from "./GameMapComponent.module.scss"

import {IRenderMap} from "../engine/renders/vue-render";
import {
	defineComponent,
	onBeforeUnmount,
	onMounted,
	PropType,
	reactive,
	ref,
	toRaw,
	toRef,
	unref
} from "vue";
import {Cell} from "../engine/cell";
import {Unit} from "../engine/unit";
import {directionToDeg, EHighlight, ETileType, EUnitType, TCardId} from "../engine/types";
import {sync} from "../common/sync";
import SvgIcon from "./SvgIcon.vue";
import UnitComponent from "./UnitComponent.vue";

export default defineComponent({
	components: {UnitComponent, SvgIcon},
	data: () => ({sty}),
	props: {
		renderMap: {type: Object as PropType<IRenderMap>, required: true},
	},
	methods: {
		directionToDeg
	},
	setup(props) {

		let animation: any = null
		onMounted(() => {
			animation = sync([sty.unitAnimation, sty.unitDirectionAnimation,])
			// animation = sync([sty.spriteXAnimation, sty.spriteYAnimation,])
		})

		onBeforeUnmount(() => {
			animation?.free()
		})


		const cellsRefs = ref<Map<Cell, HTMLElement>>(new Map())

		const setCellRef = (cell: Cell, ref) => {
			cellsRefs.value.set(cell, ref)
		}

		let gridRef = ref<HTMLElement>(null)
		const setGridRef = (value) => {
			gridRef.value = value
		}

		const layerPositionStyle = (cell: Cell) => {
			const el = cellsRefs.value.get(cell)
			const divWidth = gridRef.value.offsetWidth / 100
			const divHeight = gridRef.value.offsetHeight / 100
			return `
				left: ${el.offsetLeft / divWidth}%;
				top: ${el.offsetTop / divHeight}%;
				width: ${el.clientWidth / divWidth}%;
				height: ${el.clientHeight / divHeight}%;
			`
		}

		const map = toRef(props, 'renderMap')
		return {
			map, setCellRef, gridRef, cellsRefs, setGridRef,
			layerPositionStyle,
			cellClass: (cell: Cell) => {
				return cell ? sty['cell_' + ETileType[cell.type]] : null
			},
			unitTypeClass: (unit: Unit) => {
				return sty['unitSkinType_' + EUnitType[unit.type]]
			},
			selClass: (highlight) => {
				return [sty.selType, sty['selType_' + EHighlight[highlight]]]
			},
			cell: (coord) => {
				const x = ((coord - 1) % props.renderMap.gameMap?.size.x)
				const y = (((coord - 1) / props.renderMap.gameMap?.size.x) | 0)
				return props.renderMap.gameMap?.getCell(x, y)
			},
			chessCell(coord) {
				const x = ((coord - 1) % props.renderMap.gameMap?.size.x)
				const y = (((coord - 1) / props.renderMap.gameMap?.size.x) | 0)
				return ((x % 2 === 0) && (y % 2 === 0)) || ((x % 2 !== 0) && (y % 2 !== 0))
			}
		}
	}
})
</script>


