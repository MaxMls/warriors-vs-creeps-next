<template>
	<div :class="$style.ctn">
		<div :class="$style.module">
			<div :class="$style.step">
				<div :class="$style.icon">
				</div>
				<div :class="$style.desc">
					1 rktnre yfpf
				</div>
			</div>
		</div>

		<div :class="$style.module" v-for="i in 4">
			<div :class="$style.step" v-for="i in 2">
				<div :class="$style.icon">
				</div>
				<div :class="$style.desc">
					в любую сторону
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Card"
}
</script>

<style module lang=scss>
.ctn {
	cursor: pointer;
	display: grid;
	grid-auto-flow: row;
	grid-gap: 1px;
	background: #eee;
	padding: 1px;
}

.module {
	padding: 10px;
	background: white;
}

.step {
	display: flex;
	justify-content: center;
	align-items: center;

	& + .step {
		margin-top: 5px;
	}
}

.icon {
	flex: 0 0 auto;
	margin: 5px;
	width: 24px;
	height: 24px;
	background: #eee;

	& + .desc {
		margin-left: 10px;
	}
}

.desc {
	flex: 1 1 auto;
}

</style>
