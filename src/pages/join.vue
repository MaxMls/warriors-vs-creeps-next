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
import {defineComponent, inject, onMounted, ref, unref, watch} from "vue";
import {APP_PROVIDER} from "../context/network.context";
import {Room} from "../engine/lobby/server-events-lobby";
import {TUnitSkin} from "../engine/renders/vue-render";
import {useRouter} from "vue-router";
import {RequestError} from "../engine/lobby/request-error";


export default defineComponent({
	components: {Form},
	setup() {
		const app = unref(inject(APP_PROVIDER) as { room?: Room })

		const router = useRouter()
		const form = ref({
			values: {name: '', room: '',},
			errors: {name: null, room: null} as any
		})
		const fields = [
			{name: 'name', label: 'Введите имя'},
			{name: 'room', label: 'Введите код приглашения'}
		]

		onMounted(() => {
			let name = localStorage.getItem('name');
			form.value.values.name = name || ''
		})

		watch(form.value.values, () => {
			localStorage.setItem('name', form.value.values.name);
		})

		return {
			form, fields,
			async submit() {
				const {name} = form.value.values;

				if (!name) {
					form.value.errors.name = 'Empty name'
				} else if (name.length > 25) {
					form.value.errors.name = 'Long name'
				} else {
					try {
						const skin = (localStorage.getItem('skin') ?? 'ame') as TUnitSkin;
						app.room?.destroy()
						app.room = new Room()

						app.room.setCurrentPlayerData({skin, name})

						await app.room.joinRoom(form.value.values.room)
						await router.push('/room')
					} catch (e) {
						if (e instanceof RequestError) {
							form.value.errors = e.data
						} else {
							throw e
						}
					}
				}
			}
		}

	}
})

</script>

<style module="cs" lang=scss src="./common.scss"/>
