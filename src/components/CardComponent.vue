<template>
	<div :class="[sty.icons]">
		<SvgIcon v-for="e in cardIcons" :class="[sty.icon, {[sty['icon_' + e.t]]: !!topCard}]" :name="e.i"/>
	</div>
	<div :class="[sty.name]">
		{{ damageCard ? 'Повреждение' : noDefectCard ? noDefectCard.name : 'Нет эффекта' }}
	</div>
	<div
		 v-if=topCard
		 :class="[sty.ctn, cardTypeClass,
	     {[sty.ctn_single]: single !== null,
	     [sty.ctn_outline]: outline,
	     [sty.ctn_active]: outlineActive}]"
	>
		<div v-if=damageCard :class="[sty.module, sty.module_damage]">
			<div :class="sty.step">
				<SvgIcon :class="[sty.icon]" :name="stepIcon(damageCard?.levels[0].steps[0])"/>
				<div :class="sty.desc">
					{{ damageCard?.levels[0].steps[0].desc }}
				</div>
			</div>
		</div>

		<div v-if=noDefectCard :class="[sty.module, {[sty.module_active]: i === level, [sty.module_damaged]: damageCard}]"
		     v-for="(l, i) in noDefectCard?.levels">
			<div :class="[sty.step]" v-for="s in l.steps">
				<SvgIcon :class="[sty.icon]" :name="stepIcon(s)"/>
				<div :class="sty.desc">
					{{ desc(s) }}
				</div>
			</div>
		</div>
	</div>
</template>


<script lang=ts>
import {cardsJSON, ICardStep} from "../engine/cards";
import {directionToDeg, ECardAction, ECardType, TCardId} from "../engine/types";
import sty from './CardComponent.module.scss'
import SvgIcon from "./SvgIcon.vue";
import {computed, defineComponent, PropType} from "vue";


export default defineComponent({
	components: {SvgIcon},
	data() {
		return {sty}
	},
	props: {
		stack: {type: Array as PropType<TCardId[]>, required: false, default: []},
		idx: {type: Number as PropType<TCardId>, required: false, default: null},
		select: {type: Boolean, required: false, default: false},
		active: {type: Boolean, required: false, default: null},
	},
	setup: (props, context) => {

		const single = computed(() => props.idx !== null ? cardsJSON[props.idx] : null)
		const outline = computed(() => props.select)
		const outlineActive = computed(() => props.active)
		const topCard = computed(() => single.value ?? cardsJSON[props.stack[props.stack.length - 1]])
		const damageCard = computed(() => {
			const c = topCard.value
			return c?.type === ECardType.Defect ? c : null
		})
		const cardIcons = computed(() => {
			const icons = {
				[ECardType.Electro]: 'types-lightning',
				[ECardType.Metal]: 'types-crown',
				[ECardType.Fire]: 'types-fire',
				[ECardType.Computer]: 'types-mech',
			}
			const res: { i: string, t: string }[] = []
			if (topCard.value) {
				for (let i = 0; i < props.stack.length - (damageCard.value ? 1 : 0) + (props.idx !== null ? 1 : 0); i++)
					res.push({i: icons[noDefectCard.value.type], t: ECardType[noDefectCard.value.type]})
				if (damageCard.value) res.push({i: 'types-warning', t: ECardType[ECardType.Defect]})
			} else
				for (const icon in icons)
					res.push({i: icons[icon], t: ECardType[icon]})
			return res
		})
		const level = computed(() => props.stack.length - 1 - (damageCard.value ? 1 : 0))
		const noDefectCard = computed((() => {
			const ndc = props.stack.filter(v => cardsJSON[v].type !== ECardType.Defect)
			return single.value ?? cardsJSON[ndc[ndc.length - 1]]
		}))
		const cardTypeClass = computed(() => noDefectCard.value ? sty['ctn_' + ECardType[noDefectCard.value.type]] : '')


		function stepIcon(step: ICardStep) {
			const icons = {
				[ECardAction.Rotate]: 'rotate',
				[ECardAction.Attack]: 'attack',
				[ECardAction.Move]: 'move',
			}
			return icons[step.action]
		}

		function desc(step: ICardStep) {
			if (step.desc) {
				return step.desc
			} else if (step.action === ECardAction.Rotate) {

				return step.directions.length === 4 ?
					 'В любую сторону' :
					 '' + step.directions.map(v => directionToDeg(v)).join(', ') + ' градусов'
			} else if (step.action === ECardAction.Move) {
				return 'move'

			} else if (step.action === ECardAction.Attack) {
				return 'attack'
			}
		}

		return {
			single, outline, outlineActive, topCard, damageCard, cardIcons, level, noDefectCard, cardTypeClass,
			stepIcon, desc
		}
	},
})

</script>
