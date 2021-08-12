import {AbstractAgent} from "./abstract-agent";
import {AbstractNetwork} from "../networks/abstract-network";
import {BotAgent} from "./bot-agent";

/* Агент получающий события через интернет.<br/>
 * Связан с local agents на других пк.<br/>
 * Не отправляет никакие данные.
 * Игнорирует любые аргументы */
export class NetworkAgent extends AbstractAgent {

	readonly chooseRotate: AbstractAgent["chooseRotate"]
	readonly programming: AbstractAgent["programming"]
	readonly selectCard: AbstractAgent["selectCard"]
	readonly selectCells: AbstractAgent["selectCells"]
	readonly selectStacks: AbstractAgent["selectStacks"]
	readonly setStacks: AbstractAgent["setStacks"]
	readonly setHand: AbstractAgent["setHand"]

	private reserveBotAgent: BotAgent | null = null

	constructor(
		private readonly network: AbstractNetwork,
		private readonly id: string,
		private readonly seed: string
	) {
		super()
		this.chooseRotate = this.handlerFactory('chooseRotate')
		this.programming = this.handlerFactory('programming')
		this.selectCard = this.handlerFactory('selectCard')
		this.selectCells = this.handlerFactory('selectCells')
		this.selectStacks = this.handlerFactory('selectStacks')
		this.setStacks = () => {}
		this.setHand = () => {}
	}

	reserveAgent(actionName, ...args) {
		this.reserveBotAgent ??= new BotAgent(this.seed)
		const result = this.reserveBotAgent[actionName](...args)
		console.log('reserveAgent', result)
		return result
	}

	private handlerFactory(name) {
		return (...args) => this.network.waitAction(this.id, name).then((result) =>
			result ?? this.reserveAgent(name, ...args)
		)
	}
}
