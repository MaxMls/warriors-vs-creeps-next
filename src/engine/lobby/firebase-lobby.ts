/*
import {AbstractLobby, RequestError} from "./abstract-lobby";
import firebase from "firebase/app";
import 'firebase/database';
import DataSnapshot = firebase.database.DataSnapshot;
import {User} from "../user";
import {LocalAgent} from "../agents/local-agent";
import {BotAgent} from "../agents/bot-agent";
import {FirebaseNetwork} from "../networks/firebase-network";
import {VueRender} from "../renders/vue-render";
import {NetworkAgent} from "../agents/network-agent";
import {AbstractNetwork} from "../networks/abstract-network";
import {Game} from "../game";
import {AbstractRender} from "../renders/abstract-render";
import {GameMap} from "../game-map";

export class FirebaseLobby extends AbstractLobby {

	//private readonly lobbiesRef: firebase.database.Reference
	private roomRef: firebase.database.Reference | undefined;

	constructor(private readonly firebaseApp: firebase.app.App) {
		console.log('lobby constructor')
		super();
		//this.lobbiesRef = firebase.database(this.firebaseApp).ref().child('l')
	}

	private get lobbiesRef(): firebase.database.Reference {
		return firebase.database(this.firebaseApp).ref().child('l');
	}

	private _roomId: string | null = null
	private selfId: string | null = null

	get roomId(): string {
		if (!this._roomId) throw new Error('Impossible error')
		return this._roomId;
	}

	private set roomId(value: string | null) {
		this._roomId = value;
	}


	private _players: { id: string, name: string, bot: boolean, ready: boolean }[] = []
	get players(): { id: string; name: string; bot: boolean; ready: boolean }[] {
		return this._players;
	}

	private set players(value: { id: string; name: string; bot: boolean; ready: boolean }[]) {
		this._players = value;
	}

	private setPlayers(value: { [_: string]: { n: string, b?: boolean, r?: boolean } }) {
		this.players = Object.entries(value)
			.map(([id, {n, b, r}]) =>
				({name: n, bot: !!b, id: id, ready: !!r})
			);
	}

	async createRoom(): Promise<void> {
		const res = await this.lobbiesRef.push()
		if (!res.key) throw new Error('Impossible error')
	//	return res.key
	}

	async joinRoom(name: string, roomId: string): Promise<void> {
		const players = await this.getPlayers(roomId)

		if (Object.values(players).find(v => v.n === name))
			throw new RequestError({name: 'В комнате уже есть человек с таким именем, выберите другое.'})
		else if (Object.keys(players).length >= 4)
			throw new RequestError({room: 'Все места в этой комнате заняты, попробуйте позже.'})
		else {
			//this.lobbiesRef.child(roomId)
			this.roomRef = this.lobbiesRef.child(roomId)
			const me = await this.roomRef.push({n: name})
			this.selfId = me.key
			this._roomId = roomId

			await this.lobbiesRef.child(roomId).on('value', v => this.listenRoom(v))
		}
	}

	private listenRoom(d: DataSnapshot) {
		this.setPlayers(d.val())

		if (!this.players.find(v => v.id === this.selfId)) {
			this.destroy()
		} else if (!this.players.find(v => !v.ready)) {
			this.startGame()
		}
	}


	private async getPlayers(roomId: string | undefined = undefined): Promise<{ [_: string]: { n: string, b?: boolean } }> {
		return (await this.lobbiesRef.child(roomId || this.roomId).get()).val() as
			{ [_: string]: { n: string, b?: boolean, r?: boolean } } | null || {}
	}

	async addBot(): Promise<void> {
		if (this.players.length >= 4) {
			throw new RequestError({room: 'Все места в этой комнате заняты, попробуйте позже.'})
		} else {
			await this.roomRef?.push({n: 'bot', b: true})
		}
	}

	async kick(id: string): Promise<void> {
		await this.lobbiesRef.child(this.roomId).child(id).remove()
	}

	async readyToStart(): Promise<void> {
		await this.lobbiesRef.child(this.roomId).child(this.selfId as string).update({r: true})
	}


	destroy() {
		this.selfId = null
		this.lobbiesRef.child(this.roomId).off('value', this.listenRoom)
		this._roomId = null
		console.log('lobby destroy')
	}

	startGame() {
		let network: AbstractNetwork
		let users: User[] = []
		let render: AbstractRender
		const seed = this.roomId

		for (const player of this.players) {
			if (player.id === this.selfId) {
				network ??= new FirebaseNetwork(this.firebaseApp, this.roomId)
				render ??= new VueRender()
				users.push(new User(new LocalAgent(seed, network, render)))
			} else if (player.bot) {
				users.push(new User(new BotAgent(seed)))
			} else {
				network ??= new FirebaseNetwork(this.firebaseApp, this.roomId)
				users.push(new User(new NetworkAgent(seed, network)))
			}
		}
		render ||= new VueRender()
		const gameMap = new GameMap([ // Ландшафт
			[1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
			[1, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0],
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 0, 0, 0, 0, 2, 0, 3, 0, 2],
			[1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0],
			[1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
		])

		const game = new Game(render, users, gameMap, this.roomId)
		this.destroy()
		console.log('start game')
		return game
	}


}
*/
