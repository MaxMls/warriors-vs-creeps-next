import EventEmitter from "events";

export class RequestError {
	constructor(public readonly data: { [_field: string]: string }) {}
}

export interface ILobbyPlayer {
	// unique id
	name: string;
	bot?: boolean;
	ready?: boolean;
	// bot host name
	master?: string;
	// visible name
	alias: string;
}

export abstract class AbstractLobby {
	protected readonly localEventEmitter: EventEmitter

	public readonly on: (event: (string | symbol), listener: (...args: any[]) => void) => EventEmitter
	public readonly off: (event: (string | symbol), listener: (...args: any[]) => void) => EventEmitter

	protected constructor() {
		this.localEventEmitter = new EventEmitter()
		this.on = this.localEventEmitter.on.bind(this.localEventEmitter)
		this.off = this.localEventEmitter.off.bind(this.localEventEmitter)
	}

	abstract get player(): ILobbyPlayer | null

	abstract createRoom(peerName: string): Promise<void>

	/** kick player from current room */
	abstract joinRoom(initName: string, roomId: string): Promise<void>

	abstract destroy(): void

	abstract get playerName(): string | null

	/** generate bot to current room in empty slot */
	abstract addBot(): Promise<void>

	/** current room id */
	abstract get roomId(): string | null

	abstract get players(): ILobbyPlayer[]

	/** kick from current room */
	abstract kick(name: string): Promise<void>

	/** start game when all ready */
	abstract ready(value: boolean): Promise<void>

	/*abstract on: typeof EventEmitter.on
	abstract off: typeof EventEmitter.off*/
}
