import {AbstractNetwork} from "./abstract-network";
import {GlobalEventEmitter} from "../../common";


export class ServerEventsNetwork extends AbstractNetwork {
	private readonly callbacks = new Map<string, (payload: any) => void>()
	private readonly results = new Map<string, any>()
	private readonly listeners: { actionUuid: string, listener: Parameters<GlobalEventEmitter["on"]>[1] }[] = []

	constructor(
		private readonly roomId: string,
		private readonly emitter: GlobalEventEmitter = new GlobalEventEmitter('https://localhost/e/')
	) {
		super();
	}

	async defineAction(actionUuid: string): Promise<void> {
		const listener = (function (this: ServerEventsNetwork, payload) {
			const callback = this.callbacks.get(actionUuid)
			if (callback) {
				callback(payload)
				this.callbacks.delete(actionUuid)
			} else {
				this.results.set(actionUuid, payload)
			}
		}).bind(this)

		await this.emitter.on(`room/${this.roomId}/game/${actionUuid}`, listener)
		this.listeners.push({actionUuid, listener})
	}

	destroy(): void {
		while (this.listeners.length) {
			const {actionUuid, listener} = this.listeners.pop() as any
			this.emitter.off(actionUuid, listener)
		}
	}

	async sendAction(actionUuid: string, payload: any): Promise<void> {
		await this.emitter.emit(`room/${this.roomId}/game/${actionUuid}`, payload)
	}

	waitAction(actionUuid): Promise<any> {
		return new Promise((resolve, reject) => {
			if (this.results.has(actionUuid)) {
				const res = this.results.get(actionUuid)
				this.results.delete(actionUuid)
				resolve(res)
			} else {
				this.callbacks.set(actionUuid, resolve)
			}
		})
	}

}

