<template>
	<router-view/>
</template>

<script lang="ts">

import {Vue, Options, setup} from "vue-class-component"
import {LOBBY_PROVIDER} from "./context/network.context";
import {ref, onMounted, provide, onBeforeUnmount, unref, computed} from 'vue'

//import firebase from 'firebase/app';
//import 'firebase/database';

import {AbstractLobby} from "./engine/lobby/abstract-lobby";
import {ServerEventsLobby} from "./engine/lobby/server-events-lobby";

class Props {
}

function useProvideLobby() {

	const lobby = ref<AbstractLobby | null>(null)

	// lobby.value = new ServerEventsLobby('https://my-events-server.herokuapp.com/e/')
	lobby.value = new ServerEventsLobby('https://localhost/e/')

	onBeforeUnmount(async () => {
		await unref(lobby)?.destroy()
	})

	provide(LOBBY_PROVIDER.toString(), lobby)
	return {}
}

@Options({})
export default class App extends Vue.with(Props) {
	counter = setup(() => useProvideLobby())
}

</script>

<style lang=scss>
body {
	background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(213, 244, 254, 0.26) 100%), linear-gradient(178.88deg, #D3F4FF 0.96%, #FFE8C6 94.4%);

backdrop-filter: opacity(.2);
}

</style>
