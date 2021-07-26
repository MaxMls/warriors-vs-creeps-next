<template>
	<Form :fields=fields v-model=form @formSubmit=submit>
		<template v-slot:title>
			Создать игру
		</template>
		<template v-slot:next>
			Создать комнату
		</template>
	</Form>
</template>

<script lang=ts>
import Form from "../components/Form.vue";
import {Options, Vue} from "vue-class-component"
import {LOBBY_PROVIDER} from "../context/network.context";
import {AbstractLobby, RequestError} from "../engine/lobby/abstract-lobby";
import {unref} from "vue";

class Props {
	//propMessage!: string
}

@Options({
	components: {Form},
	inject: [LOBBY_PROVIDER]
})
export default class Create extends Vue.with(Props) {

	get lobby(): AbstractLobby | null {
		return unref(this[LOBBY_PROVIDER])
	}

	fields = [
		{name: 'name', label: 'Введите имя'}
	]
	form = {
		values: {name: '',},
		errors: {name: null,} as any
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
		const {name} = this.form.values;

		if (!name) {
			this.form.errors.name = 'Empty name'
		} else if (name.length > 25) {
			this.form.errors.name = 'Long name'
		} else if (this.lobby) {
			try {
				await this.lobby.createRoom(name);
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

<style module lang=scss>

</style>
