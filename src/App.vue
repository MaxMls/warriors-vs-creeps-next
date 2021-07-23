<template>
	<router-view/>
</template>

<script lang="ts">

import {Vue, Options, setup} from "vue-class-component"
import {LOBBY_PROVIDER} from "./context/network.context";
import {ref, onMounted, provide, onBeforeUnmount,unref} from 'vue'

import firebase from 'firebase/app';
import 'firebase/database';

import {AbstractLobby} from "./engine/lobby/abstract-lobby";
import {FirebaseLobby} from "./engine/lobby/firebase-lobby";

class Props {
}

function useFirebase() {

	const lobby = ref<FirebaseLobby | null>(null)

	onMounted(async () => {
		console.log('create db')
		try {
			firebase.initializeApp({
				apiKey: "AIzaSyBOGli71Pe0V_N0OyUTyCtjqreUZr4axG0",
				authDomain: "wvc-rtc.firebaseapp.com",
				databaseURL: "https://wvc-rtc-default-rtdb.europe-west1.firebasedatabase.app",
				projectId: "wvc-rtc",
				storageBucket: "wvc-rtc.appspot.com",
				messagingSenderId: "1094920759328",
				appId: "1:1094920759328:web:287dfed7bfe4ba0f5cb445"
			}, 'myApp')
		} catch (e) {
			if ((e as firebase.FirebaseError).code !== 'app/duplicate-app') {
				console.error({e})
				throw e
			}
		}

		lobby.value = new FirebaseLobby(firebase.app('myApp'))
	})


	onBeforeUnmount(async () => {
		unref(lobby)?.destroy()
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
	counter = setup(() => useFirebase())

	/*	mounted() {
			console.log('mounted')
		}

		created() {
		}


		submit() {
		}*/
}

</script>
