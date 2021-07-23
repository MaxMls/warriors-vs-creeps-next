<template>
	<Form :fields=fields v-model=form @submit=submit>
		<template v-slot:title>
			Присоединится к игре
		</template>
		<template v-slot:next>
			Войти
		</template>
	</Form>
</template>

<script lang=ts>

import Form from "../components/Form.vue";
import {Vue, Options, setup} from "vue-class-component"
import firebase from "firebase/app";

class Props {
	//propMessage!: string
}

@Options({
	components: {Form}
})
export default class Join extends Vue.with(Props) {
/*	myContext = setup(() => {
		const data = ref("");

		// declare useStore inside composition API setup()
		const store = useStore();
		// this will be acording with the module's action.ts
		console.log(store)
		//store.dispatch(ModuleA.setValue, data.value);
		// this will be acording with the module's getters.ts
		//console.log(store.getters.value);
		return {data};
	})*/

	fields = [
		{name: 'name', label: 'Введите имя'},
		{name: 'room', label: 'Вставьте ссылку или код приглашения'}
	]
	form = {
		values: {name: '', room: '',},
		errors: {name: null, room: null}
	}

	setup() {

	}

	mounted() {
		console.log('mounted')
		this.setName()
	}

	get name() {
		return this.form.values.name
	}

	created() {
		this.$watch("name", () => {
			localStorage.setItem('name', this.name);
		});
	}

	setName() {
		let name = localStorage.getItem('name');
		this.form.values.name = name || ''
	}

	submit() {


		console.log(JSON.stringify(this.form))
	}
}


</script>

<style module="cs" lang=scss src="./common.scss"/>
<style module lang=scss>

</style>
