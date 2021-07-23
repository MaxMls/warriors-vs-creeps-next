<template>
	<div :class='[cs.ctn, $style.ctn]' ref="ctn">
		<div style="position: relative; display: grid; height: fit-content">
			<div :class="$style.statsPanel">
				<div :class="$style.statsPanelCtn">
					<div :class="[$style.statCtn,  $style.statCtnCounter]" v-for="i in 3">
						<div :class="$style.statIcon">
							O
						</div>
						<div :class="[$style.statValue,]">
							99
						</div>
					</div>
					<div :class="[$style.statCtn, $style.statCtnCrane]">
						<div :class="$style.statIcon">
							O
						</div>
					</div>
					<div :class="[$style.statCtn, $style.statCtnTrash]">
						<div :class="$style.statIcon">
							O
						</div>
					</div>

				</div>
			</div>
		</div>
		<div :class="$style.gamePanel">

		</div>
		<div :class="$style.handPanelCtn">
			<div :class="$style.handPanel">

				<div v-for="i in 5" :class="$style.handPanelCard">
					<Card/>
				</div>
			</div>
		</div>
		<div :class="$style.termPanel" ref="termPanel">
			<div v-for="i in 6" :class="$style.termSlot" :ref="setItemTermSlotRef">
				<div :class="$style.termCard">
					<Card/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang=ts>
import {defineComponent} from "vue";
import Card from "../components/Card.vue";

export default defineComponent({
	name: "game",
	components: {Card},
	data() {
		return {
			termSlotRefs: [] as HTMLElement[]
		}
	},
	methods: {
		setItemTermSlotRef(v: any) {
			this.termSlotRefs.push(v)
		},
		recalculateTermCardsBottomOffset() {
			const termPanel = this.$refs.termPanel as HTMLElement
			const ctnHeight = termPanel.getBoundingClientRect().height
			for (const slot of this.termSlotRefs) {
				const card = slot.querySelector('.' + this.$style.termCard) as HTMLElement
				card.style.bottom = Math.min(0, ctnHeight - card.getBoundingClientRect().height + 150) + 'px'
			}
		}
	},
	mounted() {
		this.recalculateTermCardsBottomOffset()
		window.addEventListener("resize", this.recalculateTermCardsBottomOffset);
	},
	beforeUnmount() {
		window.removeEventListener("resize", this.recalculateTermCardsBottomOffset);
	}
})
</script>

<style module="cs" lang=scss src="./common.scss"/>

<style module lang=scss>

.statCtn {
	padding: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background: white;
}

.statIcon {
	min-width: 30px;
	min-height: 30px;
	background: #eee;

	& + .statValue {
		margin-top: 5px;
	}
}

.statValue {
	font-size: 20px;
}

.statsPanel {
	width: 0px;
}

.statsPanelCtn {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 1px;
	padding-right: 1px;
	width: 120px;
}

.statCtnCounter {
	grid-column: 1/-1;
}

.statCtnCrane {
	grid-column: 1;
}

.statCtnTrash {
	grid-column: 2;
}

.ctn {
	display: grid;
	grid-template-columns: 0fr 1fr 0fr;
	grid-template-rows: 550px 150px;
	grid-gap: 1px;
	border: none;

	padding: 1px;
	//height: calc(100vh - 40px);
	margin: 20px;
	//height: 700px;

	&, .statsPanel {
		background: #eee;
	}

	overflow: hidden;
}

/*
.headerPanel {
	grid-row: 1;
	grid-column: 1/-1;
	background: white;
	padding: 20px;
}*/

.statsPanel {
	grid-column: 1;
	grid-row: 1;
	background: black;
}

.gamePanel {
	// background: white;
	grid-column: 2;
	grid-row: 1;
}

.handPanelCtn {
	position: relative;

	grid-column: 3;
	grid-row: 1;
	width: 250px;
}

.handPanel {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: white;
	padding: 20px;
	overflow-y: auto;
}

.handPanelCard {
	& + .handPanelCard {
		margin-top: 20px;
	}
}

.termPanel {
	background: white;
	grid-column: 1/-1;
	grid-row: 2;
	//min-height: 100px;

	display: grid;
	padding: 0 40px 0 15px;
	z-index: 1;
	grid-auto-flow: column;
	grid-gap: 10px;
	grid-auto-columns: 1fr;
}

.termSlot {
	//height: 0;
	position: relative;
}

.termCard {
	position: absolute;
	left: 0;
	right: 0;
	background: #fff;
	bottom: -30px;
	transition: bottom .2s;

	&:hover {

		bottom: 0px !important;
	}
}

.termCardCtn {
	position: relative;
	top: calc(100% - 208px)
}
</style>
