<template>
	<svg aria-hidden="true">
		<use :href="symbolId"/>
	</svg>
</template>

<script lang=ts>
import {prop, Vue} from "vue-class-component";

class Props {
	prefix = prop<string>({required: false, default: 'icon'});
	name = prop<string>({required: true});
}

export default class SvgIcon extends Vue.with(Props) {
	get symbolId() {
		return `#${this.prefix}-${this.name}`
	}
}

</script>
