<template>
	<div :class="[sty.icons]">
		<SvgIcon v-for="e in cardIcons" :class="[sty.icon, {[sty['icon_' + e.t]]: !!topCard}]" :name="e.i"/>
	</div>
	<div v-if=noDefectCard :class="[sty.name]">
		{{ noDefectCard.name }}
	</div>
	<div
		 v-if=topCard
		 :class="[
		 	 sty.ctn, cardTypeClass,
	     {[sty.ctn_single]: single !== null,
	     [sty.ctn_outline]: outline,
	     [sty.ctn_active]: outlineActive}]"
	>
		<div v-if=damageCard :class="[sty.module, sty.module_damage]">
			<div :class="sty.step">
				<SvgIcon :class="[sty.icon]" :name="stepIcon(damageCard.levels[0].steps[0])"/>
				<div :class="sty.desc">
					{{ damageCard.levels[0].steps[0].desc }}
				</div>
			</div>
		</div>

		<div :class="[sty.module, {[sty.module_active]: i === level, [sty.module_damaged]: damageCard}]"
		     v-for="(l, i) in noDefectCard.levels">
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
import {Options, prop, Vue} from "vue-class-component";
import {cardsJSON, ICardStep} from "../engine/cards";
import {ECardAction, ECardType, EDirection, TCardInd} from "../engine/types";
import sty from './CardComponent.module.scss'
import SvgIcon from "./SvgIcon.vue";

class Props {
	public stack = prop<TCardInd[]>({required: false, default: []});
	public idx = prop<TCardInd | null>({required: false, default: null});

	// just outline
	public select = prop<boolean>({required: false, default: false});
	public active = prop<boolean>({required: false, default: false});
}

@Options({
	components: {SvgIcon},
	data() {
		return {sty}
	}
})

export default class CardComponent extends Vue.with(Props) {
	get single() {
		return this.idx !== null ? cardsJSON[this.idx] : null
	}

	get outline() {
		return this.select
	}

	get outlineActive() {
		return this.active
	}

	get topCard() {
		return this.single ?? cardsJSON[this.stack[this.stack.length - 1]]
	}

	get cardTypeClass() {
		return sty['ctn_' + ECardType[this.noDefectCard.type]]
	}

	get cardIcons() {
		const icons = {
			[ECardType.Electro]: 'types-lightning',
			[ECardType.Metal]: 'types-crown',
			[ECardType.Fire]: 'types-fire',
			[ECardType.Computer]: 'types-mech',
		}

		const res: { i: string, t: string }[] = []
		if (this.topCard) {
			for (let i = 0; i < this.stack.length - (this.damageCard ? 1 : 0) + (this.idx !== null ? 1 : 0); i++) {
				res.push({
					i: icons[this.noDefectCard.type],
					t: ECardType[this.noDefectCard.type]
				})
			}

			if (this.damageCard) {
				res.push({
					i: 'types-warning',
					t: ECardType[ECardType.Defect]
				})
			}
		} else {
			for (const icon in icons) {
				console.log({icon})
				res.push({
					i: icons[icon],
					t: ECardType[icon]
				})
			}
		}
		return res
	}

	stepIcon(step: ICardStep) {
		const icons = {
			[ECardAction.Rotate]: 'rotate',
			[ECardAction.Attack]: 'attack',
			[ECardAction.Move]: 'move',
		}
		return icons[step.action]
	}

	get level() {
		return this.stack.length - 1 - (this.damageCard ? 1 : 0)
	}

	get damageCard() {
		const c = this.topCard
		return c.type === ECardType.Defect ? c : null
	}

	get noDefectCard() {
		const ndc = this.stack.filter(v => cardsJSON[v].type !== ECardType.Defect)
		return this.single ?? cardsJSON[ndc[ndc.length - 1]]
	}

	desc(step: ICardStep) {
		if (step.desc) {
			return step.desc
		} else if (step.action === ECardAction.Rotate) {
			const str = {
				[EDirection._0]: 360,
				[EDirection._90]: 90,
				[EDirection._180]: 180,
				[EDirection._270]: 270,
			}

			return step.directions.length === 4 ?
				 'В любую сторону' :
				 '' + step.directions.map(v => str[v]).join(', ') + ' градусов'
		} else if (step.action === ECardAction.Move) {
			return 'move'

		} else if (step.action === ECardAction.Attack) {
			return 'attack'
		}

	}

}
</script>
