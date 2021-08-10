import {AbstractAgent} from "./abstract-agent";
import {AbstractNetwork} from "../networks/abstract-network";
import {AbstractRender} from "../renders/abstract-render";
import {ServerEventsNetwork} from "../networks/server-events-network";

/* get input from local user and send to others */
export class LocalAgent extends AbstractAgent {

	readonly chooseRotate: AbstractAgent["chooseRotate"]
	readonly programming: AbstractAgent["programming"]
	readonly selectCard: AbstractAgent["selectCard"]
	readonly selectCells: AbstractAgent["selectCells"]
	readonly selectStacks: AbstractAgent["selectStacks"]
	readonly setStacks: AbstractAgent["setStacks"]
	readonly setHand: AbstractAgent["setHand"]

	constructor(
		private readonly network: AbstractNetwork | null,
		private readonly id: string | null,
		private readonly render: AbstractRender
	) {
		super();
		this.chooseRotate = this.handlerFactory('chooseRotate')
		this.programming = this.handlerFactory('programming')
		this.selectCard = this.handlerFactory('selectCard')
		this.selectCells = this.handlerFactory('selectCells')
		this.selectStacks = this.handlerFactory('selectStacks')
		this.setStacks = this.render.setStacks.bind(this.render)
		this.setHand = this.render.setHand.bind(this.render)
	}

	private handlerFactory(name) {
		return (...args) => this.render[name](...args).then(async (res) => {
			if (this.network) await this.network.sendAction(name, res)
			return res
		})
	}


}
