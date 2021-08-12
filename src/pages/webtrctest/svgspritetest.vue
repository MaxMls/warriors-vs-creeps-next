<template>
	<div :class="$style.g">
		<div :class="$style.d" v-for="i in ids">
			<SvgIcon :class="$style.s" :name="i"/>
			<br/>
			{{ i }}
		</div>
	</div>
</template>

<script lang=ts>
import SvgIcon from "../../components/SvgIcon.vue";
// @ts-ignore
import ids from 'virtual:svg-icons-names';

export default {
	name: "svgspritetest",
	components: {SvgIcon},
	data: () => ({ids: ids.map((v: string) => v.substr(5))})
}
</script>
<style module lang=scss>
.s {
	height: 60px;
	width: 60px;

	--icon-color: #0048ff;
}

.g {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.d {
	text-align: center;

}

</style>
