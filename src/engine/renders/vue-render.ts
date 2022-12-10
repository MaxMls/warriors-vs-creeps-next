import { Cell } from "../cell";
import { GameMap } from "../game-map";
import { EDirection, EHighlight } from "../types";

import { Unit } from "../unit";

export type THeroSkin = "ame" | "cali" | "gura" | "ina" | "kiara";

export type TUnitSkin = THeroSkin | "cake" | "greenSlime";

export const heroesSkins: THeroSkin[] = ["ame", "cali", "gura", "ina", "kiara"];
export type TUnitState = "idle" | "walk" | "attack";

export interface IRenderMap {
  onCellClick: ((cell: Cell) => void) | null;
  cellsToSelect: Map<Cell, { highlight: EHighlight; ind: number }>;
  gameMap: GameMap | null;
  units: Map<
    Unit,
    {
      cell: Cell;
      key: number;
      state: TUnitState;
      skin: TUnitSkin;
    }
  >;
  moveUnitMs: number;
  cellsDirection: Map<Unit, EDirection>;
}
