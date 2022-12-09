// Straight - Убивать по прямой пока не достигнута координата
//const attackType = {Straight, Coordinates}
import { ECardAction, ECardType, ERotation, IVector } from "./types";

export type ICardStep = (
  | {
      action: ECardAction.Move;
      coords: IVector[];
    }
  | {
      action: ECardAction.Rotate;
      directions: ERotation[];
    }
  | {
      action: ECardAction.Attack;
      coords: IVector[];
      // Targets count. undefined === all found targets
      count?: number;
    }
) & {
  // описание
  desc?: string;
};

export interface ICardLevel {
  // количество возможных целей
  targetCount: number;
  // варианты вектора движения от текущей позиции и поворота
  move: IVector[];
  // Атака пока только после движения
  attack: IVector[];
  // Варианты поворота на выбор, можно выбрать только 1
  rotate: ERotation[];
  steps: ICardStep[];
}

export interface ICard {
  name: string;
  // Элемент карты
  type: ECardType;
  // Эффект накладывается при взятии карты
  // Сложные эффекты обрабатываются отдельно
  effects: string[];
  // Возможности карты зависят от её уровня
  levels: ICardLevel[];
}

export const cardsJSON: ICard[] = [
  {
    //name: "Fuel Tank",
    name: "Маневрирование",
    // Эффект накладывается при взятии карты
    type: ECardType.Fire,
    effects: ["FuelTank"], // при желании. функция Сброс карты и атаковать всех в радиусе 1 при получении урона
    levels: [
      {
        // 1 Уровень
        targetCount: 0,
        move: [],
        attack: [],
        rotate: [ERotation._90, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [ERotation._90, ERotation._270],
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 0,
        move: [],
        attack: [],
        rotate: [ERotation._90, ERotation._180, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [ERotation._90, ERotation._180, ERotation._270],
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 0,
        move: [],
        attack: [],
        rotate: [ERotation._0, ERotation._90, ERotation._180, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [
              ERotation._0,
              ERotation._90,
              ERotation._180,
              ERotation._270,
            ],
          },
        ],
      },
    ],
  },
  {
    /*name: "Blaze",*/
    name: "Пламя",
    type: ECardType.Fire,
    effects: [],
    levels: [
      {
        targetCount: 2,
        move: [{ x: 0, y: 1 }],
        attack: [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 1 }],
            desc: "1 клетка вперёд",
          },
          {
            action: ECardAction.Attack,
            coords: [
              { x: -1, y: 0 },
              { x: 1, y: 0 },
            ],
            count: 2,
            desc: "По бокам",
          },
        ],
      },
      {
        targetCount: 2,
        move: [{ x: 0, y: 2 }],
        attack: [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ], // Атака в конце хода
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 2 }],
            desc: "2 клетки вперёд",
          },
          {
            action: ECardAction.Attack,
            coords: [
              { x: -1, y: 0 },
              { x: 1, y: 0 },
            ],
            count: 2,
            desc: "По бокам",
          },
        ],
      },
      {
        targetCount: 2,
        move: [{ x: 0, y: 3 }],
        attack: [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ], // Атака в конце хода
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 3 }],
            desc: "3 клетки вперёд",
          },
          {
            action: ECardAction.Attack,
            coords: [
              { x: -1, y: 0 },
              { x: 1, y: 0 },
            ],
            count: 2,
            desc: "По бокам",
          },
        ],
      },
    ],
  },
  {
    name: "Огнемёт",
    /*name: "Flamespitter",*/
    type: ECardType.Fire,
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 999,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 0, y: 2 },
        ], // Атака в конце хода
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 0, y: 2 },
            ],
            desc: "2 клетки спереди",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 999,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 0, y: 2 },
          { x: -1, y: 2 },
          { x: 1, y: 2 },
        ],
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 0, y: 2 },
              { x: -1, y: 2 },
              { x: 1, y: 2 },
            ],
            desc: "4 клетки спереди буквой T",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 999,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 0, y: 2 },
          { x: -1, y: 2 },
          { x: 1, y: 2 },
          { x: -1, y: 3 },
          { x: 0, y: 3 },
          { x: 1, y: 3 },
        ],
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 0, y: 2 },
              { x: -1, y: 2 },
              { x: 1, y: 2 },
              { x: -1, y: 3 },
              { x: 0, y: 3 },
              { x: 1, y: 3 },
            ],
            desc: "7 клеток спереди буквой T",
          },
        ],
      },
    ],
  },
  {
    name: "Настройка",
    /*name: "Memory Core",*/
    // +1 карта в раздачу, если ты первый игрок
    type: ECardType.Computer,
    effects: ["FuelTank"],
    levels: [
      {
        // 1 Уровень
        targetCount: 0,
        move: [],
        attack: [],
        rotate: [ERotation._90, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [ERotation._90, ERotation._270],
          },
        ],
      },
      {
        // 2 Уровень +2 cards
        targetCount: 0,
        move: [],
        attack: [],
        rotate: [ERotation._90, ERotation._180, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [ERotation._90, ERotation._180, ERotation._270],
          },
        ],
      },
      {
        // 3 Уровень +3 cards
        targetCount: 0,
        move: [],
        attack: [],
        rotate: [ERotation._0, ERotation._90, ERotation._180, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [
              ERotation._0,
              ERotation._90,
              ERotation._180,
              ERotation._270,
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Сальто",
    /*	name: "Omni Stomp",*/
    type: ECardType.Computer,
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 0,
        move: [
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [
              { x: 0, y: 1 },
              { x: -1, y: 0 },
              { x: 1, y: 0 },
            ],
            desc: "1 клетка вперед, влево или вправо",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 0,
        move: [
          { x: 0, y: 2 },
          { x: -2, y: 0 },
          { x: 2, y: 0 },
        ],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [
              { x: 0, y: 2 },
              { x: -2, y: 0 },
              { x: 2, y: 0 },
            ],
            desc: "2 клетки вперед, влево или вправо",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 0,
        move: [
          { x: 0, y: 3 },
          { x: -3, y: 0 },
          { x: 3, y: 0 },
        ],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [
              { x: 0, y: 3 },
              { x: -3, y: 0 },
              { x: 3, y: 0 },
            ],
            desc: "3 клетки вперед, влево или вправо",
          },
        ],
      },
    ],
  },
  {
    //name: "Hexmatic Aimbot",
    name: "Прицельный выстрел",
    type: ECardType.Computer,
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 1,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
          { x: 1, y: -1 },
          { x: 0, y: -1 },
          { x: -1, y: -1 },
          { x: -1, y: 0 },
          { x: -1, y: 1 },
        ],
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 1, y: 1 },
              { x: 1, y: 0 },
              { x: 1, y: -1 },
              { x: 0, y: -1 },
              { x: -1, y: -1 },
              { x: -1, y: 0 },
              { x: -1, y: 1 },
            ],
            count: 1,
            desc: "1 цель в радиусе 1",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 1,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
          { x: 1, y: -1 },
          { x: 0, y: -1 },
          { x: -1, y: -1 },
          { x: -1, y: 0 },
          { x: -1, y: 1 },
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 2, y: 1 },
          { x: 2, y: 0 },
          { x: 2, y: -1 },
          { x: 2, y: -2 },
          { x: 1, y: -2 },
          { x: 0, y: -2 },
          { x: -1, y: -2 },
          { x: -2, y: -2 },
          { x: -2, y: -1 },
          { x: -2, y: 0 },
          { x: -2, y: 1 },
          { x: -2, y: 2 },
          { x: -1, y: 2 },
        ],
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 1, y: 1 },
              { x: 1, y: 0 },
              { x: 1, y: -1 },
              { x: 0, y: -1 },
              { x: -1, y: -1 },
              { x: -1, y: 0 },
              { x: -1, y: 1 },
              { x: 0, y: 2 },
              { x: 1, y: 2 },
              { x: 2, y: 2 },
              { x: 2, y: 1 },
              { x: 2, y: 0 },
              { x: 2, y: -1 },
              { x: 2, y: -2 },
              { x: 1, y: -2 },
              { x: 0, y: -2 },
              { x: -1, y: -2 },
              { x: -2, y: -2 },
              { x: -2, y: -1 },
              { x: -2, y: 0 },
              { x: -2, y: 1 },
              { x: -2, y: 2 },
              { x: -1, y: 2 },
            ],
            count: 1,
            desc: "1 цель в радиусе 2",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 1,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
          { x: 1, y: -1 },
          { x: 0, y: -1 },
          { x: -1, y: -1 },
          { x: -1, y: 0 },
          { x: -1, y: 1 },
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
          { x: 2, y: 1 },
          { x: 2, y: 0 },
          { x: 2, y: -1 },
          { x: 2, y: -2 },
          { x: 1, y: -2 },
          { x: 0, y: -2 },
          { x: -1, y: -2 },
          { x: -2, y: -2 },
          { x: -2, y: -1 },
          { x: -2, y: 0 },
          { x: -2, y: 1 },
          { x: -2, y: 2 },
          { x: -1, y: 2 },
          { x: 0, y: 3 },
          { x: 1, y: 3 },
          { x: 2, y: 3 },
          { x: 3, y: 3 },
          { x: 3, y: 2 },
          { x: 3, y: 1 },
          { x: 3, y: 0 },
          { x: 3, y: -1 },
          { x: 3, y: -2 },
          { x: 3, y: -3 },
          { x: 2, y: -3 },
          { x: 1, y: -3 },
          { x: 0, y: -3 },
          { x: -1, y: -3 },
          { x: -2, y: -3 },
          { x: -3, y: -3 },
          { x: -3, y: -2 },
          { x: -3, y: -1 },
          { x: -3, y: 0 },
          { x: -3, y: 1 },
          { x: -3, y: 2 },
          { x: -3, y: 3 },
          { x: -2, y: 3 },
          { x: -1, y: 3 },
        ],
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 1, y: 1 },
              { x: 1, y: 0 },
              { x: 1, y: -1 },
              { x: 0, y: -1 },
              { x: -1, y: -1 },
              { x: -1, y: 0 },
              { x: -1, y: 1 },
              { x: 0, y: 2 },
              { x: 1, y: 2 },
              { x: 2, y: 2 },
              { x: 2, y: 1 },
              { x: 2, y: 0 },
              { x: 2, y: -1 },
              { x: 2, y: -2 },
              { x: 1, y: -2 },
              { x: 0, y: -2 },
              { x: -1, y: -2 },
              { x: -2, y: -2 },
              { x: -2, y: -1 },
              { x: -2, y: 0 },
              { x: -2, y: 1 },
              { x: -2, y: 2 },
              { x: -1, y: 2 },
              { x: 0, y: 3 },
              { x: 1, y: 3 },
              { x: 2, y: 3 },
              { x: 3, y: 3 },
              { x: 3, y: 2 },
              { x: 3, y: 1 },
              { x: 3, y: 0 },
              { x: 3, y: -1 },
              { x: 3, y: -2 },
              { x: 3, y: -3 },
              { x: 2, y: -3 },
              { x: 1, y: -3 },
              { x: 0, y: -3 },
              { x: -1, y: -3 },
              { x: -2, y: -3 },
              { x: -3, y: -3 },
              { x: -3, y: -2 },
              { x: -3, y: -1 },
              { x: -3, y: 0 },
              { x: -3, y: 1 },
              { x: -3, y: 2 },
              { x: -3, y: 3 },
              { x: -2, y: 3 },
              { x: -1, y: 3 },
            ],
            count: 1,
            desc: "1 цель в радиусе 3",
          },
        ],
      },
    ],
  },
  {
    //name: "Scythe",
    name: "Коса",
    // Эффект накладывается при взятии карты
    type: ECardType.Metal,
    effects: [], // при желании. функция Сброс карты и аттаковать всех в радиусе 1 при получении урона
    levels: [
      {
        // 1 Уровень
        targetCount: 1,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
          { x: 1, y: -1 },
          { x: 0, y: -1 },
          { x: -1, y: -1 },
          { x: -1, y: 0 },
          { x: -1, y: 1 },
        ],
        rotate: [ERotation._90, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [ERotation._90, ERotation._270],
          },
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 1, y: 1 },
              { x: 1, y: 0 },
              { x: 1, y: -1 },
              { x: 0, y: -1 },
              { x: -1, y: -1 },
              { x: -1, y: 0 },
              { x: -1, y: 1 },
            ],
            count: 1,
            desc: "1 цель в радиусе 1",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 2,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
          { x: 1, y: -1 },
          { x: 0, y: -1 },
          { x: -1, y: -1 },
          { x: -1, y: 0 },
          { x: -1, y: 1 },
        ],
        rotate: [ERotation._90, ERotation._180, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [ERotation._90, ERotation._180, ERotation._270],
          },
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 1, y: 1 },
              { x: 1, y: 0 },
              { x: 1, y: -1 },
              { x: 0, y: -1 },
              { x: -1, y: -1 },
              { x: -1, y: 0 },
              { x: -1, y: 1 },
            ],
            count: 2,
            desc: "2 цели в радиусе 1",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 3,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 },
          { x: 1, y: -1 },
          { x: 0, y: -1 },
          { x: -1, y: -1 },
          { x: -1, y: 0 },
          { x: -1, y: 1 },
        ],
        rotate: [ERotation._0, ERotation._90, ERotation._180, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [
              ERotation._0,
              ERotation._90,
              ERotation._180,
              ERotation._270,
            ],
          },
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 1, y: 1 },
              { x: 1, y: 0 },
              { x: 1, y: -1 },
              { x: 0, y: -1 },
              { x: -1, y: -1 },
              { x: -1, y: 0 },
              { x: -1, y: 1 },
            ],
            count: 3,
            desc: "3 цели в радиусе 1",
          },
        ],
      },
    ],
  }, // do
  {
    /*name: "Skewer",*/
    name: "Прыжок",
    type: ECardType.Metal,
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 2,
        move: [{ x: 0, y: 1 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 1 }],
            desc: "1 клетка вперёд",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 2,
        move: [{ x: 0, y: 2 }],
        attack: [], //
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 2 }],
            desc: "2 клетки вперёд",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 2,
        move: [{ x: 0, y: 3 }],
        attack: [], //
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 3 }],
            desc: "3 клетки вперёд",
          },
        ],
      },
    ],
  },
  {
    name: "Шпага",
    /*		name: "Ripsaw",*/
    type: ECardType.Metal,
    effects: ["Ripsaw"],
    levels: [
      {
        // 1 Уровень
        targetCount: 1,
        move: [],
        attack: [{ x: 0, y: 1 }], //
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [{ x: 0, y: 1 }],
            count: 1,
            desc: "1 цель перед вами",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 2,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 0, y: 2 },
        ], //
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 0, y: 2 },
            ],
            count: 2,
            desc: "2 цели перед вами",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 3,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 0, y: 2 },
          { x: 0, y: 3 },
        ], //
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 0, y: 2 },
              { x: 0, y: 3 },
            ],
            count: 3,
            desc: "3 цели перед вами",
          },
        ],
      },
    ],
  },
  {
    /*name: "Cyclotron",*/
    name: "Безумное вращение",
    type: ECardType.Electro,
    // +1 карта в раздачу, если ты первый игрок
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 999,
        move: [],
        attack: [
          { x: 1, y: 1 },
          { x: -1, y: -1 },
          { x: 1, y: -1 },
          { x: -1, y: 1 },
        ],
        rotate: [ERotation._90, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [ERotation._90, ERotation._270],
          },
          {
            action: ECardAction.Attack,
            coords: [
              { x: 1, y: 1 },
              { x: -1, y: -1 },
              { x: 1, y: -1 },
              { x: -1, y: 1 },
            ],
            desc: "По диагонали в радиусе 1",
          },
        ],
      },
      {
        // 2 Уровень +2 cards
        targetCount: 999,
        move: [],
        attack: [
          { x: 1, y: 1 },
          { x: -1, y: -1 },
          { x: 1, y: -1 },
          { x: -1, y: 1 },
          /**/ { x: 2, y: 2 },
          { x: -2, y: -2 },
          { x: 2, y: -2 },
          { x: -2, y: 2 },
        ],
        rotate: [ERotation._90, ERotation._180, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [ERotation._90, ERotation._180, ERotation._270],
          },
          {
            action: ECardAction.Attack,
            coords: [
              { x: 1, y: 1 },
              { x: -1, y: -1 },
              { x: 1, y: -1 },
              { x: -1, y: 1 },
              /**/ { x: 2, y: 2 },
              { x: -2, y: -2 },
              { x: 2, y: -2 },
              { x: -2, y: 2 },
            ],
            desc: "По диагонали в радиусе 2",
          },
        ],
      },
      {
        // 3 Уровень +3 cards
        targetCount: 999,
        move: [],
        attack: [
          { x: 1, y: 1 },
          { x: -1, y: -1 },
          { x: 1, y: -1 },
          { x: -1, y: 1 },
          /**/ { x: 2, y: 2 },
          { x: -2, y: -2 },
          { x: 2, y: -2 },
          { x: -2, y: 2 },
          /**/ { x: 3, y: 3 },
          { x: -3, y: -3 },
          { x: 3, y: -3 },
          { x: -3, y: 3 },
        ],
        rotate: [ERotation._0, ERotation._90, ERotation._180, ERotation._270],
        steps: [
          {
            action: ECardAction.Rotate,
            directions: [
              ERotation._0,
              ERotation._90,
              ERotation._180,
              ERotation._270,
            ],
          },
          {
            action: ECardAction.Attack,
            coords: [
              { x: 1, y: 1 },
              { x: -1, y: -1 },
              { x: 1, y: -1 },
              { x: -1, y: 1 },
              /**/ { x: 2, y: 2 },
              { x: -2, y: -2 },
              { x: 2, y: -2 },
              { x: -2, y: 2 },
              /**/ { x: 3, y: 3 },
              { x: -3, y: -3 },
              { x: 3, y: -3 },
              { x: -3, y: 3 },
            ],
            desc: "По диагонали в радиусе 3",
          },
        ],
      },
    ],
  },
  {
    /*name: "Speed",*/
    name: "Скорость",
    type: ECardType.Electro,
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 0,
        move: [
          { x: 0, y: 1 },
          { x: 0, y: 2 },
        ],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [
              { x: 0, y: 1 },
              { x: 0, y: 2 },
            ],
            desc: "1 или 2 клетки вперёд",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 0,
        move: [
          { x: 0, y: 2 },
          { x: 0, y: 3 },
          { x: 0, y: 4 },
        ],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [
              { x: 0, y: 2 },
              { x: 0, y: 3 },
              { x: 0, y: 4 },
            ],
            desc: "2, 3 или 4 клетки вперёд",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 0,
        move: [
          { x: 0, y: 3 },
          { x: 0, y: 4 },
          { x: 0, y: 5 },
          { x: 0, y: 6 },
        ],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [
              { x: 0, y: 3 },
              { x: 0, y: 4 },
              { x: 0, y: 5 },
              { x: 0, y: 6 },
            ],
            desc: "3, 4, 5 или 6 клеток вперёд",
          },
        ],
      },
    ],
  },
  {
    /*name: "Chain Lightning",*/
    name: "Шаровая молния",
    type: ECardType.Electro,
    effects: ["ChainLightning"],
    levels: [
      {
        // 1 Уровень
        targetCount: 1,
        move: [],
        attack: [{ x: 0, y: 1 }],
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [{ x: 0, y: 1 }],
            desc: "1 цель перед вами",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 3,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 0, y: 2 },
          { x: 0, y: 3 },
        ],
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 0, y: 2 },
              { x: 0, y: 3 },
            ],
            desc: "3 цели перед вами",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 5,
        move: [],
        attack: [
          { x: 0, y: 1 },
          { x: 0, y: 2 },
          { x: 0, y: 3 },
          { x: 0, y: 4 },
          { x: 0, y: 5 },
        ],
        rotate: [],
        steps: [
          {
            action: ECardAction.Attack,
            coords: [
              { x: 0, y: 1 },
              { x: 0, y: 2 },
              { x: 0, y: 3 },
              { x: 0, y: 4 },
              { x: 0, y: 5 },
            ],
            desc: "5 целей перед вами",
          },
        ],
      },
    ],
  },
  {
    name: "Move left disable",
    type: ECardType.Defect,
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 0,
        move: [{ x: -1, y: 0 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: -1, y: 0 }],
            desc: "1 клетка влево",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 0,
        move: [{ x: -1, y: 0 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: -1, y: 0 }],
            desc: "1 клетка влево",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 0,
        move: [{ x: -1, y: 0 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: -1, y: 0 }],
            desc: "1 клетка влево",
          },
        ],
      },
      {
        // 4 Уровень
        targetCount: 0,
        move: [{ x: -1, y: 0 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: -1, y: 0 }],
            desc: "1 клетка влево",
          },
        ],
      },
    ],
  },
  {
    name: "Move backward disable",
    type: ECardType.Defect,
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 0,
        move: [{ x: 0, y: -1 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: -1 }],
            desc: "1 клетка назад",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 0,
        move: [{ x: 0, y: -1 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: -1 }],
            desc: "1 клетка назад",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 0,
        move: [{ x: 0, y: -1 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: -1 }],
            desc: "1 клетка назад",
          },
        ],
      },
      {
        // 4 Уровень
        targetCount: 0,
        move: [{ x: 0, y: -1 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: -1 }],
            desc: "1 клетка назад",
          },
        ],
      },
    ],
  },
  {
    name: "Move forward disable",
    type: ECardType.Defect,
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 0,
        move: [{ x: 0, y: 1 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 1 }],
            desc: "1 клетка вперёд",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 0,
        move: [{ x: 0, y: 1 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 1 }],
            desc: "1 клетка вперёд",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 0,
        move: [{ x: 0, y: 1 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 1 }],
            desc: "1 клетка вперёд",
          },
        ],
      },
      {
        // 4 Уровень
        targetCount: 0,
        move: [{ x: 0, y: 1 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 0, y: 1 }],
            desc: "1 клетка вперёд",
          },
        ],
      },
    ],
  },
  {
    name: "Move right disable",
    type: ECardType.Defect,
    effects: [],
    levels: [
      {
        // 1 Уровень
        targetCount: 0,
        move: [{ x: 1, y: 0 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 1, y: 0 }],
            desc: "1 клетка вправо",
          },
        ],
      },
      {
        // 2 Уровень
        targetCount: 0,
        move: [{ x: 1, y: 0 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 1, y: 0 }],
            desc: "1 клетка вправо",
          },
        ],
      },
      {
        // 3 Уровень
        targetCount: 0,
        move: [{ x: 1, y: 0 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 1, y: 0 }],
            desc: "1 клетка вправо",
          },
        ],
      },
      {
        // 4 Уровень
        targetCount: 0,
        move: [{ x: 1, y: 0 }],
        attack: [],
        rotate: [],
        steps: [
          {
            action: ECardAction.Move,
            coords: [{ x: 1, y: 0 }],
            desc: "1 клетка вправо",
          },
        ],
      },
    ],
  },
];
