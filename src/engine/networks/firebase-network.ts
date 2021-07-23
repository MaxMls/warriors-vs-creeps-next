import {AbstractNetwork} from "./abstract-network";
import firebase from "firebase/app";
import 'firebase/database';
import Reference = firebase.database.Reference;
import DataSnapshot = firebase.database.DataSnapshot;

export class FirebaseNetwork extends AbstractNetwork {

	constructor(
		private readonly app: firebase.app.App,
		roomKey: string
	) {
		super();

		this.actionsRef = firebase.database(app).ref('room/' + roomKey + '/actions');
		this.actionsRef.on('value', this.onData)
	}

	private readonly callbacks = new Map<string, (payload: any) => void>()
	private readonly results = new Map<string, any>()
	declare actionsRef: Reference


	private onData(data: DataSnapshot) {
		const value = data.val();
		console.log('Пришло ', value)
		if (value === null) return
		const actionUuid = Object.keys(value)[0];
		const result = value[actionUuid];

		if (this.callbacks.has(actionUuid)) {
			const resolve = this.callbacks.get(actionUuid) as (payload: any) => void
			this.callbacks.delete(actionUuid)
			resolve(result)
		} else {
			this.results.set(actionUuid, result)
		}

	}

	async sendAction(actionUuid: string, payload: any) {
		let value = {[actionUuid]: payload}
		console.log('Отправляется ', value)
		await this.actionsRef.set(value);
	}


	waitAction(actionUuid): Promise<any> {
		if (this.results.has(actionUuid)) {
			const res = this.results.get(actionUuid)
			this.results.delete(actionUuid)
			return Promise.resolve(res)
		} else {
			return new Promise((resolve, reject) => {
				this.callbacks.set(actionUuid, resolve)
			})
		}
	}


}
