// Обеспечивает связь между парой LocalAgent - NetworkAgent
/*

export class RequestError implements Error {
	data: { [_field: string]: string }
}
*/

export abstract class AbstractNetwork {

	abstract sendAction(actionUuid: string, payload: any): Promise<void>

	abstract init(): Promise<void>

	abstract waitAction(fromId, actionName): Promise<any>

	abstract destroy(): void
}
