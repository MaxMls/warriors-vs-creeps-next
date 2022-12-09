import { AbstractNetwork } from "./abstract-network";
import { GlobalEventEmitter } from "../../common";

//const operationQueue = makeOperationQueue()

interface IRequestData {
  name: string;
  init?: true;
  payload?: any;
}

interface IResponse {
  type: "data" | "on" | "off";
  id: string;
  data: IRequestData;
}

export class ServerEventsNetwork extends AbstractNetwork {
  private readonly resultsCallbacks: {
    [_id: string]: { [_name: string]: ((payload: any) => void)[] };
  } = {};
  private readonly results: { [_id: string]: { [_name: string]: any[] } } = {};
  private readonly gameEventName: string[];
  private openId: string | null = null;
  private leaversIds = new Set<string>();

  constructor(
    private readonly roomId: string,
    private readonly emitter: GlobalEventEmitter
  ) {
    super();
    this.gameEventName = [`room`, this.roomId, "game"];
  }

  async sendAction(
    name: IRequestData["name"],
    payload: IRequestData["payload"]
  ): Promise<void> {
    await this.emitter.emit(this.gameEventName, {
      name,
      payload,
    } as IRequestData);
  }

  private receiveAction({ type, id, data }: IResponse) {
    if (id === this.openId) return;
    if (type === "data") {
      console.log("receiveAction", id, data.name, data.payload);
      this.pushResult(id, data.name, data.payload);
    } else if (type === "off") {
      if (this.resultsCallbacks[id]) {
        Object.entries(this.resultsCallbacks[id]).forEach(([name, array]) =>
          array.forEach((c) => c(null))
        );
      }
      this.leaversIds.add(id);
    } else if (type === "on") {
    }
  }

  private listenerThis = this.receiveAction.bind(this);

  async init(): Promise<void> {
    this.openId = await this.emitter.on(this.gameEventName, this.listenerThis);
  }

  destroy(): void {
    this.emitter.off(this.gameEventName, this.listenerThis);
  }

  private pushResult(id, name, result) {
    const resultCallback = this.resultsCallbacks?.[id]?.[name]?.shift() ?? null;
    if (resultCallback) {
      resultCallback(result);
    } else {
      this.results[id] ??= {};
      this.results[id][name] ??= [];
      this.results[id][name].push(result);
    }
  }

  private async getResult(fromId, actionName) {
    return new Promise((resolve, reject) => {
      const result = this.results?.[fromId]?.[actionName]?.shift() ?? null;
      if (result) {
        resolve(result);
      } else {
        this.resultsCallbacks[fromId] ??= {};
        this.resultsCallbacks[fromId][actionName] ??= [];
        this.resultsCallbacks[fromId][actionName].push(resolve);
      }
    });
  }

  async waitAction(
    fromId,
    actionName
  ): Promise<IRequestData["payload"] | null> {
    console.log("waitAction", { fromId, actionName });
    if (this.leaversIds.has(fromId)) {
      return null;
    } else {
      return await this.getResult(fromId, actionName);
    }
  }
}
