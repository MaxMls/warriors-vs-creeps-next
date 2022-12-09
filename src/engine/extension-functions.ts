import { IVector } from "./types";

export const getRandomInt = (random, min, max) => {
  return Math.floor(random() * (max - min)) + min;
};

export const shakeArray = (a, random): void => {
  a.sort(() => random() - 0.5);
};

export const vectorRotate = (a, angle) => {
  // angle 0 - 0; 1 - 90; 2 - 180; 3 - 270
  const an = { x: a.x, y: a.y };
  for (let i = 0; i < angle; i++) {
    const c = an.x;
    an.x = an.y;
    an.y = -c;
  }
  return an;
};

//a, b - {x:X, y:Y}
export const getNextCellFromAToB = (a, b) => {
  const vectorFromAToB = (a, b) => ({ x: b.x - a.x, y: b.y - a.y });
  const vectorMultiple = (a, v) => ({ x: a.x * v, y: a.y * v });
  const vectorAdd = (a, b) => ({ x: b.x + a.x, y: b.y + a.y });
  const vectorRound = (a) => ({ x: Math.round(a.x), y: Math.round(a.y) });
  const vectorLen = (a) => Math.sqrt(a.x * a.x + a.y * a.y);

  const v = vectorFromAToB(a, b);
  const l = vectorLen(v);

  let c = vectorMultiple(v, 1 / l);
  c = vectorRound(c);

  if (c.x !== 0 && c.y !== 0) c.x = 0;

  return vectorAdd(a, c);
};

//createArray(3, 2); // [new Array(2),
//  new Array(2),
//  new Array(2)]
export const createArray = (...lengths) => {
  const length = lengths[0];
  let array = new Array(length || 0);
  let index = length;

  if (lengths.length > 1) {
    const args = lengths.slice(1);
    while (index--) {
      array[length - index - 1] = createArray(...args);
    }
  }

  return array;
};

export const radius = (value: number): IVector[] => {
  throw new Error("no ip");
  return [];
};

export const uuid = (random: () => { toString(): string }): string => {
  return random().toString();
};

export const symbol = (desc = ""): string => {
  return desc;
};
