<template>
	<form :class="[cs.ctn, $style.ctn]" @submit=submit>
		<h1 :class="$style.title">
			<slot name="title"/>
		</h1>
		<div :class="$style.inputGroup" v-for="{name, label} in fields">
			<div :class="$style.label">
				<span>
					{{ label }}
				</span>
			</div>
			<input :name='name' :class="$style.input" @input="e => input(name, e)" :value="modelValue.values[name]"/>
			<div :class="$style.error" v-if="modelValue.errors[name]">
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

<script lang=js>
export default {
	name: "Form",
	props: {
		modelValue: Object,
		fields: Array,
	},
	emits: ['update:modelValue', 'submit'],
	methods: {
		input(name, e) {
			this.modelValue.values[name] = e.target.value
			this.$emit('update:modelValue', this.modelValue)
		},
		submit(e) {
			e.preventDefault()
			this.$emit('submit')
		},
	}
}
</script>
<style module="cs" lang=scss src="../pages/common.scss"/>

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
