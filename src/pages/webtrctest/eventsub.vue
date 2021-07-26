<template>
	<!--	<input v-model="name" placeholder='Member name'/><br/>
		<input v-model="roomId" placeholder='Room id'/><br/>-->
	<button @click=join><b>[sub]</b></button>
	<button @click=close><b>[close]</b></button>
	<ul>
		<li v-for="m in messages">
			{{ m }}
		</li>
	</ul>
</template>

<script lang=ts>
import {Vue} from "vue-class-component";

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
		if (this.source !== null) return

		this.source = new EventSource(" http://127.0.0.1:8125/e/buba", {
			withCredentials: false
		})
		console.log('create')

		this.source.onerror = (e) => {
			console.error('error', e)
		}
		/*		this.source.onopen = (e) => {
					console.log('onopen', e)
				}*/

		this.source.onmessage = (e) => {
			console.log('message', JSON.parse(e.data))
			this.messages.unshift(e.data)
		}

		/*
				this.source.addEventListener('message', (soure, ev) => {

				}, {})

				this.source.onopen = () => {

				}*/
		/*	const connection = new RTCPeerConnection(rtcConfig)
			const offer = await createOffer(connection)
			const answer = await sendOfferAndWaitAnswer(this.roomId, this.name, offer)

			const [peerName] = await Promise.all([
				waitName(connection),
				acceptAnswer(connection, answer),
			])

			console.log({peerName})*/
	}
}

</script>
