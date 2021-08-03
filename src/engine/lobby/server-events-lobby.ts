import {AbstractLobby, ILobbyPlayer, RequestError} from "./abstract-lobby";
import {dynamicSort, GlobalEventEmitter} from "../../common";
import {customAlphabet} from 'nanoid'

const urlAlphabet = "abdefghijklmnqrstuvxyzABDEFGHIJKLMNQRSTUVXYZ0123456789-_"
const genId = customAlphabet(urlAlphabet, 15)

interface IRoomEvent {
	type: string,
	initName: string,
	peerName?: string,
	data?: any
}

export class ServerEventsLobby extends AbstractLobby {

	private readonly globalEventEmitter: GlobalEventEmitter

	constructor(serverUrl: string) {
		super();
		this.globalEventEmitter = new GlobalEventEmitter(serverUrl)
	}

	private _game: boolean = false;
	get game(): boolean {
		return this._game;
	}

	private set game(value: boolean) {
		this._game = value;
	}

	private _playerName: string | null = null
	set playerName(value: string | null) {
		this.localEventEmitter.emit('playerName', value)
		this._playerName = value;
	}

	get playerName(): string | null {
		return this._playerName;
	}

	get player(): ILobbyPlayer | null {
		return this.players.find(v => v.name === this.playerName) ?? null
	}

	private readonly _players: ILobbyPlayer[] = []
	public get players(): ILobbyPlayer[] {
		return this._players
	}

	private addPlayer(value: ILobbyPlayer) {
		if (this.players.length < 4 && !this.players.find(v => v.name === value.name)) {
			this.players.push(value)
			this.players.sort(dynamicSort('name'))
			console.log('emit players addPlayer')
			console.log(this.localEventEmitter.emit('players'));
		} else {
			throw new Error('fail add player')
		}
	}

	private kickPlayer(playerName: string) {
		const idx = this.players.findIndex(v => v.name === playerName)
		if (idx > -1) this.players.splice(idx, 1)
		this.localEventEmitter.emit('players', this.players)
	}

	private readyPlayer(playerName: string, value: boolean, seed: string) {
		const player = this.players.find(v => v.name === playerName)
		if (player) {
			player.ready = value
			player.seed = seed
			this.localEventEmitter.emit('players', this.players)
		} else {
			throw new Error('Player not found')
		}
	}

	private _roomId: string | null = null
	public get roomId(): string | null {return this._roomId}

	private set roomId(value: string | null) {
		this.localEventEmitter.emit('roomId', value)
		this._roomId = value;
	}

	private async roomEventEmit(event: IRoomEvent) {
		if (this.roomId) {
			await this.globalEventEmitter.emit(['room', this.roomId, 'event'], event)
		} else {
			throw new Error('not in room')
		}
	}

	private pingInterval: NodeJS.Timer | null = null
	private subscribed = false

	private async roomEventsSubscribe() {
		if (this.roomId !== null && this.playerName !== null) {
			await this.globalEventEmitter.on(['room', this.roomId, 'event'], this.onRoomEventThis)
			/*this.pingInterval = setInterval(() => {
				this.roomEventEmit({type: 'alive', initName: this.playerName as string, data: null})
			}, 1000)*/
			this.subscribed = true
		} else {
			throw new Error('not in room')
		}
	}

	private async roomEventsUnsubscribe() {
		if (this.roomId) {
			await this.globalEventEmitter.off(['room', this.roomId, 'event'], this.onRoomEventThis)
			if (this.pingInterval !== null) {
				clearInterval(this.pingInterval)
			}
			this.subscribed = false
		}
	}

	async createRoom(peerName: string): Promise<void> {
		try {
			this.roomId = genId()
			this.playerName = genId()
			this.addPlayer({name: this.playerName, alias: peerName})
			await this.roomEventsSubscribe()
		} catch (e) {
			await this.destroy()
			throw e
		}
	}

	private onJoin: ((error?: RequestError) => void) | null = null

	async joinRoom(initName: string, roomId: string): Promise<void> {
		if (!this.roomId && !this.playerName) {
			this.roomId = roomId
			this.playerName = genId()
			try {
				const player: ILobbyPlayer = {name: this.playerName, alias: initName}
				this.addPlayer(player)
				await this.roomEventEmit({type: 'ping', initName: this.playerName, data: null})
				await this.roomEventsSubscribe()

				await new Promise<void>(async (resolve, reject) => {
					const t = setTimeout(() => {
						reject(new RequestError({room: 'no one from the room answers'}))
					}, 5000)
					this.onJoin = (error) => {
						clearTimeout(t)
						this.onJoin = null
						if (error) reject(error as RequestError)
						else resolve()
					}
					await this.roomEventEmit({type: 'joinEvent', initName: this.playerName as string, data: {player}})
				}).catch()
			} catch (e) {
				await this.destroy()
				if (e?.data?.room) throw new RequestError(e.data)
				else {
					console.error(e)
					throw new RequestError({room: 'Room error'})
				}
			}
		} else {
			throw new Error('already in room')
		}
	}


	private myBots(master = this.playerName) {
		return this.players.filter(v => v.bot && v.master === master)
	}

	async addBot(): Promise<void> {
		if (this.roomId === null || this.playerName === null) throw new Error('not in room')
		console.log(this.addBot.name)
		const bot: ILobbyPlayer = {name: genId(), master: this.playerName, bot: true, ready: true, alias: 'Bot'}
		this.addPlayer(bot)
		await this.roomEventEmit({type: 'addPlayerEvent', initName: this.playerName, data: {player: bot}})
	}

	private onRoomEventThis = this.onRoomEvent.bind(this)

	private async onRoomEvent(event: IRoomEvent) {
		if (this.roomId === null || this.playerName === null) throw new Error('not in room')
		console.log(this.onRoomEvent.name, {event})

		if (event.initName !== this.playerName && (!event.peerName || event.peerName === this.playerName)) {
			await ({
				joinEvent: async (data: { player: ILobbyPlayer }, initName: string) => {
					console.log('joinEvent', {initName, data})
					if (this.players.length < 4) {
						this.addPlayer(data.player)
						// send me and my bots to init
						await Promise.all([this.player as ILobbyPlayer, ...this.myBots()].map((player) =>
							this.roomEventEmit({
								type: 'addPlayerEvent',
								initName: this.playerName as string,
								peerName: initName,
								data: {player}
							}))
						)
					} else {
						await this.roomEventEmit({
							type: 'rejectJoinEvent',
							initName: this.playerName as string,
							peerName: initName,
							data: {error: new RequestError({room: 'room overflow'})}
						})
					}
				},
				rejectJoinEvent: async (data: { error: RequestError }, initName: string) => {
					console.log('rejectJoinEvent', {initName, data})
					this.onJoin?.(data.error)
				},
				addPlayerEvent: async (data: { player: ILobbyPlayer }, initName: string) => {
					console.log('addPlayerEvent', {initName, data})
					this.addPlayer(data.player)
					this.onJoin?.()
				},
				kickEvent: async (data: { playerName: string }, initName: string) => {
					console.log('kickEvent', {initName, data})
					for (const s of [data.playerName, ...this.myBots(data.playerName).map(v => v.name)]) {
						this.kickPlayer(s)
					}
				},
				readyEvent: async (data: { playerName: string, value: boolean, seed: string }, initName: string) => {
					console.log('readyEvent', {initName, data})
					this.readyPlayer(data.playerName, data.value, data.seed)
					if (!this.players.find(v => !v.ready)) {
						await this.startGame()
					}
				}
			})[event.type]?.(event.data, event.initName)
		}
	}

	async kick(name: string): Promise<void> {
		// kick me and my bots
		for (const s of [name, ...this.myBots(name).map(v => v.name)]) {
			this.kickPlayer(s)
		}
		if (this.roomId === null || this.playerName === null) throw new Error('not in room')
		if (this.subscribed) {
			await this.roomEventEmit({
				type: 'kickEvent',
				initName: this.playerName,
				data: {playerName: name}
			})
		}
	}

	async ready(value): Promise<void> {
		if (this.roomId === null || this.playerName === null) throw new Error('not in room')
		const seed = genId()
		this.readyPlayer(this.playerName, value, seed)
		await this.roomEventEmit({
			type: 'readyEvent',
			initName: this.playerName,
			data: {playerName: this.playerName, value, seed}
		})
		if (!this.players.find(v => !v.ready)) {
			await this.startGame()
		}
	}

	async destroy(): Promise<void> {
		if (this.playerName) await this.kick(this.playerName)
		await this.roomEventsUnsubscribe()
		this.playerName = null
		this.roomId = null
		this.players.length = 0
		this.onJoin = null
	}

	private async startGame() {
		if (this.game) throw  new Error('game already start')
		if (this.roomId === null || this.playerName === null) throw new Error('not in room')

		await this.roomEventsUnsubscribe()

		// start game
		this.game = true /*new Game(render, agents, gameMap, seed)*/
		console.log('gameStartgameStart')
		this.localEventEmitter.emit('gameStart')
	}

	async endGame() {
		await this.roomEventsSubscribe()
	}
}
