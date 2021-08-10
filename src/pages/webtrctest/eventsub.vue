<template>
	<!--	<input v-model="name" placeholder='Member name'/><br/>
		<input v-model="roomId" placeholder='Room id'/><br/>-->
	<button @click=join><b>[sub]</b></button>
	<button @click=close><b>[close]</b></button>
	<button @click=emit><b>[emit]</b></button>
	<ul>
		<li v-for="m in messages">
			{{ m }}
		</li>
	</ul>
</template>

<script lang=ts>
import {defineComponent, ref} from "vue";
import {GlobalEventEmitter} from "../../common";
import {eventsServerUrl} from "../../engine/lobby/server-events-lobby";

export default defineComponent({
	setup() {

		console.log(JSON.stringify(ref(23).value))
		const listener = (data) => {
			console.log(data)
		}
		const ge = new GlobalEventEmitter(eventsServerUrl)

		return {
			join() {
				ge.on(['buba'], listener)
			},
			close() {
				ge.off(['buba'], listener)
			},
			emit() {
				ge.emit(['buba'], [1, 2])
			},
		}
	}
})
/*

export default class RTCSubTest extends Vue {
	name: string = ''
	roomId: string = ''
	source: EventSource | null = null
	messages: string[] = []

	close() {
		if (this.source === null) return
		this.source.close()
		console.log('close')
		this.source = null
	}

	join() {

		/!*if (this.source !== null) return

		this.source = new EventSource(" http://127.0.0.1:8125/e/buba?id=45", {
			withCredentials: false
		})
		console.log('create')

		this.source.onerror = (e) => {
			console.error('error', e)
		}

		this.source.onmessage = (e) => {
			console.log('message', JSON.parse(e.data))
			this.messages.unshift(e.data)
		}*!/
	}
}
*/

</script>
