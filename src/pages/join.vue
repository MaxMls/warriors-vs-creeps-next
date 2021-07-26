<template>
	<Form :fields=fields v-model=form @formSubmit=submit>
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
import {AbstractLobby, RequestError} from "../engine/lobby/abstract-lobby";
import {unref} from "vue";
import {LOBBY_PROVIDER} from "../context/network.context";

class Props {
	//propMessage!: string
}


@Options({
	components: {Form},
	inject: [LOBBY_PROVIDER]
})
export default class Join extends Vue.with(Props) {
	get lobby(): AbstractLobby | null {
		return unref(this[LOBBY_PROVIDER])
	}

	fields = [
		{name: 'name', label: 'Введите имя'},
		{name: 'room', label: 'Введите код приглашения'}
	]
	form = {
		values: {name: '', room: '',},
		errors: {name: null, room: null} as any
	}

	mounted() {
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

	async submit() {
		// check name
		const {name, room} = this.form.values;
		//console.log('bubabubabubabuba')
		if (!name) {
			this.form.errors.name = 'Empty name'
		} else if (!room) {
			this.form.errors.room = 'Empty room'
		} else if (name.length > 25) {
			this.form.errors.name = 'Long name'
		} else if (this.lobby) {
			try {
				await this.lobby.joinRoom(name, room);
				await this.$router.push('/lobby/' + this.lobby.roomId)
			} catch (e) {
				if (e instanceof RequestError) {
					this.form.errors = e.data
				} else {
					throw e
				}
			}
		}

	}
}


</script>

<style module="cs" lang=scss src="./common.scss"/>
<style module lang=scss>

</style>
