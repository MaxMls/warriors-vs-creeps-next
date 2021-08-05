<template>
	<div/>
</template>

<script lang=ts>
import {PropType} from "vue";

export interface IAnimationData {
	name: string,
	gifSrc?: string,

	spriteSrc?: string
}

export default {
	name: "AnimationsController",
	props: {
		state: {type: String, required: false, default: 'idle'},
		data: {type: Array, required: false, default: []},
	}
}
</script>

<style scoped>

</style>
