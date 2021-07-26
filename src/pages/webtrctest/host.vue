<template>
	<input v-model="name" placeholder='Host name'/><br/>
	<input v-model="roomId" placeholder='Room id'/><br/>
	<button @click=createRoom><b>[create room]</b></button>
	<button @click=stopRoom><b>[stop room]</b></button>
	<br/>
	<span>Room id: <b>{{ roomId }}</b></span><br/>
</template>

<script lang=ts>
import {Vue} from "vue-class-component";
import {HostRoom} from "../../common";


export default class RTCHostTest extends Vue {
	name: string = 'myhost'
	roomId: string = 'myroom'
	hostRoom: HostRoom | null = null

	async createRoom() {
		if (!this.name || !this.roomId || this.hostRoom) return

		this.hostRoom = new HostRoom(this.roomId, this.name)

		this.hostRoom.onConnection = (initName: string, connection: RTCPeerConnection) => {
			console.log('New connection', initName, connection)
		}

		await this.hostRoom.start()
	}

	stopRoom() {
		//console.log('hostRoom')
		this.hostRoom?.stop()
		this.hostRoom = null
	}

	beforeUnmount() {
		this.stopRoom()
	}
}

</script>
