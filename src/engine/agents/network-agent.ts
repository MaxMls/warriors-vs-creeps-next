import {AbstractAgent} from "./abstract-agent";
import {AbstractNetwork} from "../networks/abstract-network";

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

	constructor(
		private readonly network: AbstractNetwork,
		private readonly name: string,
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

	private handlerFactory(name) {
		this.network.defineAction(name).catch(e => console.error(e))

		return () => this.network.waitAction(`${this.name}/${name}`)
	}
}
