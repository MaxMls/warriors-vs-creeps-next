import { GlobalEventEmitter } from "../../common";
import { customAlphabet } from "nanoid";
import { THeroSkin, TUnitSkin } from "../renders/vue-render";
import EventEmitter from "events";

const urlAlphabet = "abdefghijklmnqrstuvxyzABDEFGHIJKLMNQRSTUVXYZ0123456789-_";
export const genId = customAlphabet(urlAlphabet, 15);

export interface IRoomPlayer {
  selfId: string;
  ownerId: string; // bot or other local player
  data: {
    name?: string;
    ready?: boolean;
    skin?: THeroSkin;
  };
}

//export const eventsServerUrl = 'https://localhost/e/'
export const eventsServerUrl = "https://my-events-server.herokuapp.com/e/";

export class Room {
  public players: IRoomPlayer[] = [];
  public player!: IRoomPlayer;

  private openRoomId: string | null = null;
  private readonly localEvents: EventEmitter;
  private networkEvents: GlobalEventEmitter | null = null;

  public readonly on: (
    event: string | symbol,
    listener: (...args: any[]) => void
  ) => EventEmitter;
  public readonly off: (
    event: string | symbol,
    listener: (...args: any[]) => void
  ) => EventEmitter;

  constructor() {
    this.localEvents = new EventEmitter();
    this.on = this.localEvents.on.bind(this.localEvents);
    this.off = this.localEvents.off.bind(this.localEvents);
  }

  setCurrentPlayerData(data: IRoomPlayer["data"]) {
    const id = genId();
    this.player = {
      selfId: id,
      ownerId: id,
      data,
    };
    this.addPlayerLocal(this.player);
  }

  public async openRoom(): Promise<string> {
    if (!this.openRoomId) {
      this.openRoomId = genId();
      this.networkEvents = new GlobalEventEmitter(eventsServerUrl);
      const openUserId = await this.networkEvents.on(
        ["room", this.openRoomId],
        this.roomListenerThis
      );
      this.changeCurrentId(openUserId);
    }
    return this.openRoomId;
  }

  private changeCurrentId(newUserId) {
    this.players.forEach((p) => {
      if (p.ownerId === this.player.selfId) p.ownerId = newUserId;
    });
    this.player.selfId = newUserId;
  }

  public async joinRoom(room: string): Promise<void> {
    if (!this.openRoomId) {
      this.openRoomId = room;
      this.networkEvents = new GlobalEventEmitter(eventsServerUrl);
      const openUserId = await this.networkEvents.on(
        ["room", this.openRoomId],
        this.roomListenerThis
      );
      this.changeCurrentId(openUserId);
    }
  }

  private addPlayerLocal(player: IRoomPlayer) {
    if (!this.players.find((p) => p.selfId === player.selfId)) {
      this.players.push(player);
    }
    this.localEvents.emit("players");
  }

  addPlayer(player: IRoomPlayer) {
    this.addPlayerLocal(player);
    this.roomEmitter("addPlayer_NE", player);
  }

  private updatePlayerDataLocal(
    id: IRoomPlayer["selfId"],
    value: IRoomPlayer["data"]
  ) {
    const player = this.players.find((p) => p.selfId === id);
    if (player === undefined) throw new Error("Impossible error");
    Object.assign(player.data, value);
    this.localEvents.emit("players");
  }

  updatePlayerData(id: IRoomPlayer["selfId"], value: IRoomPlayer["data"]) {
    this.updatePlayerDataLocal(id, value);
    this.roomEmitter("updatePlayerData_NE", id, value);
  }

  private removePlayerLocal(id: IRoomPlayer["selfId"]) {
    this.players = this.players.filter(
      (v) => v.selfId !== id && v.ownerId !== id
    );
    this.localEvents.emit("players");
  }

  removePlayer(id: IRoomPlayer["selfId"]) {
    this.removePlayerLocal(id);
    this.roomEmitter("removePlayer_NE", id);
  }

  private roomEmitter(fun, ...params) {
    this.networkEvents?.emit(["room", this.openRoomId!], { fun, params });
  }

  private roomListenerThis = this.roomListener.bind(this);

  private roomListener({ type, id, data }) {
    if (id === this.player.selfId) {
      if (type === "on") {
        this.roomEmitter("addPlayer_NE", this.player);
      }
    } else if (type === "off") {
      this.removePlayerLocal(id);
    } else if (type === "on") {
      this.roomEmitter("addPlayer_NE", this.player);
      this.players
        .filter((p) => p.ownerId === this.player.selfId)
        .forEach((p) => {
          this.roomEmitter("addPlayer_NE", p);
        });
    } else if (type === "data") {
      ({
        addPlayer_NE: this.addPlayerLocal.bind(this),
        updatePlayerData_NE: this.updatePlayerDataLocal.bind(this),
        removePlayer_NE: this.removePlayerLocal.bind(this),
      }[data.fun](...data.params));
    }
  }

  async destroy() {
    this.networkEvents?.off(["room", this.openRoomId!], this.roomListenerThis);
  }
}
