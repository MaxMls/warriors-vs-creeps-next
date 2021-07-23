import {AbstractAgent} from "../agents/abstract-agent";

export class RequestError {
	constructor(public readonly data: { [_field: string]: string }) {}
}

export abstract class AbstractLobby {
	abstract createRoom(): Promise<string>

	/** kick player from current room */
	abstract joinRoom(name: string, roomId: string): Promise<void>

	abstract destroy(): void

	/** generate bot to current room in empty slot */
	abstract addBot(): Promise<void>

	/** current room id */
	abstract get roomId(): string | null


	abstract get players(): { id: string, name: string, bot: boolean, ready: boolean }[]


	/** kick agent from current room */
	abstract kick(id: string): Promise<void>

	/** start game when all ready */
	abstract readyToStart(): Promise<void>

}
