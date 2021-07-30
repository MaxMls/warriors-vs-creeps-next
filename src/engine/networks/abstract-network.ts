// Обеспечивает связь между парой LocalAgent - NetworkAgent
/*

export class RequestError implements Error {
	data: { [_field: string]: string }
}
*/

export abstract class AbstractNetwork {

	abstract sendAction(actionUuid: string, payload: any): Promise<void>

	abstract defineAction(actionUuid: string): Promise<void>

	abstract waitAction(actionUuid): Promise<any>

	abstract destroy(): void
}
