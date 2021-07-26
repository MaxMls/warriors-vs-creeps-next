<template>
	<form :class="[cs.ctn, $style.ctn]" @submit=submit>
		<h1 :class="$style.title">
			<slot name="title"/>
		</h1>
		<div :class="$style.inputGroup" v-for="{name, label} in fieldsArray">
			<div :class="$style.label">
				<span>
					{{ label }}
				</span>
			</div>
			<input :name='name' :class="$style.input" @input="e => input(name, e)" :value="form.values[name]"/>
			<div :class="$style.error" v-if="form.errors[name]">
				<span>{{ modelValue.errors[name] }}</span>
			</div>
		</div>
		<div :class="$style.buttonsGroup">
			<router-link :class="$style.button" to="/">Назад</router-link>
			<button type=submit :class="$style.button">
				<slot name="next"/>
			</button>
		</div>
	</form>
</template>

<script lang=ts>
import cs from "../pages/common.module.scss"
import {Options, prop, Vue} from "vue-class-component";

class Props {
	public modelValue = prop<{ values: { [_: string]: string }, errors: { [_: string]: string } }>({required: true});
	public fields = prop<[{ name: string, label: string }]>({required: true});
}

@Options({
	data: () => ({cs})
})
export default class Form extends Vue.with(Props) {
	get form() {
		return this.modelValue
	}

	get fieldsArray() {
		return this.fields
	}

	input(name, e) {
		if (this.modelValue) {
			this.modelValue.values[name] = e.target.value
			this.$emit('update:modelValue', this.modelValue)
		}
	}

	submit(e) {
		e.preventDefault()
		//console.log('submit')
		this.$emit('formSubmit')
	}
}/*
export default {
	name: "Form",
	data() {
		return {cs}
	},
	props: {
		modelValue: Object,
		fields: Array,
	},
	emits: ['update:modelValue', 'submit'],
	methods: {

	}
}*/
</script>

<style module lang=scss>

.ctn {
	padding: 40px 50px 50px;
}

.title {
	font-size: 28px;
	font-weight: bold;
	margin-bottom: 26px;
}

.inputGroup {
	& + .inputGroup, & + .buttonsGroup {
		margin-top: 40px;
	}
}

.buttonsGroup {
	display: flex;
	justify-content: space-between;
}

.label {
	//color: #808080;

	font-size: 20px;
}

.button, .input, .label, .error {
	font-size: 18px;
}

.error {
	color: #a74646;
	font-size: 16px;
}

.label + .input {
	margin-top: 10px;
}

.input + .error {
	margin-top: 10px;
}

.input {
	padding: 16px 25px;
	width: 100%;
	display: block;
}

.button {
	padding: 15px 40px;

	& + .button {
		margin-left: 40px;
	}
}

.input, .button {
	border: 1px solid black;
}

</style>
