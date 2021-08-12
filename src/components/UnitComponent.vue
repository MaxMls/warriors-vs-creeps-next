<template>
	<div :class="[sty.unitSkinCtn]">
		<div :ref="setEl" :class="[sty.unitSkin, sty[`unitSkin_${skin}`], sty[`unitState_${state}`]]"/>
	</div>
	<div
		 v-if="(direction ?? null) !== null"
		 :class="sty.unitDirection"
		 :style="`transform: rotate(${directionToDeg(direction)}deg)`"
	>
		<SvgIcon
			 :class="sty.unitDirectionIcon"
			 name="direction"/>
	</div>
</template>

<script lang=ts>
import sty from "./UnitComponent.module.scss"
import {defineComponent, onUpdated, PropType, ref} from "vue";
import {TUnitSkin, TUnitState} from "../engine/renders/vue-render";
import SvgIcon from "./SvgIcon.vue";
import {directionToDeg, EDirection} from "../engine/types";

export default defineComponent({
	name: "UnitComponent",
	components: {SvgIcon},
	data: () => ({sty}),
	props: {
		state: {type: String as PropType<TUnitState>, required: true},
		skin: {type: String as PropType<TUnitSkin>, required: false, default: 'ame'},
		direction: {type: Number as PropType<EDirection>, required: false},
	},
	setup() {
		const el = ref<HTMLElement | null>(null)
		onUpdated(() => {
			if (el.value) {
				el.value.style.animation = 'none';
				el.value.offsetHeight;
				el.value.style.animation = '';
			}
		})
		return {setEl: v => el.value = v}
	},
	methods: {
		directionToDeg,
	}
})
</script>
