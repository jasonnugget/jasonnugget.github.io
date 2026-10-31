// A cube is 54 stickers with integer positions and outward-facing normals.
// Turning one outer layer permutes a face AND the four neighboring edge strips.
export type Vector = [number, number, number];
export type Face = 0 | 1 | 2 | 3 | 4 | 5;
export type Color = 0 | 1 | 2 | 3 | 4 | 5;
export interface Sticker { position: Vector; normal: Vector; color: Color }
export const COLORS = ['#f7f7f5', '#ffe000', '#005cff', '#00a565', '#ff2435', '#ff8900'] as const;
export const FACES: { normal: Vector; right: Vector; down: Vector }[] = [
  { normal: [0, 1, 0], right: [1, 0, 0], down: [0, 0, 1] },
  { normal: [0, -1, 0], right: [1, 0, 0], down: [0, 0, -1] },
  { normal: [0, 0, 1], right: [1, 0, 0], down: [0, -1, 0] },
  { normal: [0, 0, -1], right: [-1, 0, 0], down: [0, -1, 0] },
  { normal: [-1, 0, 0], right: [0, 0, 1], down: [0, -1, 0] },
  { normal: [1, 0, 0], right: [0, 0, -1], down: [0, -1, 0] },
];

function dot(a: Vector, b: Vector) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function rotate(vector: Vector, axis: number, direction: number): Vector {
  const result: Vector = [...vector];
  const a = (axis + 1) % 3;
  const b = (axis + 2) % 3;
  result[a] = -direction * vector[b];
  result[b] = direction * vector[a];
  return result;
}

export class Cube {
  stickers: Sticker[];
  constructor() {
    this.stickers = FACES.flatMap(({ normal, right, down }, face) =>
      Array.from({ length: 9 }, (_, index) => ({
        position: normal.map((n, axis) => n + right[axis] * (index % 3 - 1) + down[axis] * (Math.floor(index / 3) - 1)) as Vector,
        normal: [...normal] as Vector,
        color: face as Color,
      })),
    );
  }

  turn(face: Face, clockwise = true) {
    const normal = FACES[face].normal;
    const axis = normal.findIndex(n => n !== 0);
    const layer = normal[axis];
    const direction = (clockwise ? -1 : 1) * layer;
    for (const sticker of this.stickers) {
      if (sticker.position[axis] !== layer) continue;
      sticker.position = rotate(sticker.position, axis, direction);
      sticker.normal = rotate(sticker.normal, axis, direction);
    }
  }

  face(face: Face): Color[] {
    const { normal, right, down } = FACES[face];
    const colors: Color[] = Array(9);
    for (const sticker of this.stickers) {
      if (dot(sticker.normal, normal) !== 1) continue;
      const column = dot(sticker.position, right) + 1;
      const row = dot(sticker.position, down) + 1;
      colors[row * 3 + column] = sticker.color;
    }
    return colors;
  }

  snapshot() { return FACES.map((_, face) => this.face(face as Face)); }
  scramble(moves = 32, random = Math.random) {
    for (let i = 0; i < moves; i++) this.turn(Math.floor(random() * 6) as Face, random() > 0.5);
    return this;
  }
}
