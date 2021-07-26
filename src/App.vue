<template>
	<router-view/>
</template>

<script lang="ts">

import {Vue, Options, setup} from "vue-class-component"
import {LOBBY_PROVIDER} from "./context/network.context";
import {ref, onMounted, provide, onBeforeUnmount, unref, computed} from 'vue'

import firebase from 'firebase/app';
import 'firebase/database';

import {AbstractLobby} from "./engine/lobby/abstract-lobby";
import {ServerEventsLobby} from "./engine/lobby/server-events-lobby";

class Props {
}

function useProvideLobby() {

	const lobby = ref<AbstractLobby | null>(null)

	lobby.value = new ServerEventsLobby()

	onBeforeUnmount(async () => {
		await unref(lobby)?.destroy()
	})

	provide(LOBBY_PROVIDER.toString(), lobby)
	return {}
}

@Options({
	components: {},
	/*	provide() {
			return {
				//:  this.firebase
			}
		}*/
})
export default class App extends Vue.with(Props) {
	counter = setup(() => useProvideLobby())

	/*	mounted() {
			console.log('mounted')
		}

		created() {
		}


		submit() {
		}*/
}

</script>
