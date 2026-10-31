import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cube } from './rubiks.ts';
import type { Face } from './rubiks.ts';

test('every face turn is a valid permutation, and four turns restore the cube', () => {
  for (let face = 0; face < 6; face++) {
    const cube = new Cube().scramble();
    const before = cube.snapshot();
    for (let i = 0; i < 4; i++) cube.turn(face as Face);
    assert.deepEqual(cube.snapshot(), before);
  }
});

test('turns have an inverse and move the face plus four edge strips', () => {
  for (let face = 0; face < 6; face++) {
    const cube = new Cube();
    const original = structuredClone(cube.stickers);
    cube.turn(face as Face);
    assert.equal(cube.stickers.filter((sticker, i) => JSON.stringify(sticker) !== JSON.stringify(original[i])).length, 20);
    cube.turn(face as Face, false);
    assert.deepEqual(cube.snapshot(), new Cube().snapshot());
  }
});

test('scrambling preserves all 54 stickers, nine of each color, and unique face cells', () => {
  const cube = new Cube().scramble(500);
  const colors = cube.snapshot().flat();
  assert.equal(colors.length, 54);
  for (let color = 0; color < 6; color++) assert.equal(colors.filter(c => c === color).length, 9);
  const positions = cube.stickers.map(s => JSON.stringify([s.position, s.normal]));
  assert.equal(new Set(positions).size, 54);
});

test('clockwise face coordinates agree with the canvas quarter turn', () => {
  for (let face = 0; face < 6; face++) {
    const cube = new Cube().scramble();
    const before = cube.face(face as Face);
    cube.turn(face as Face);
    assert.deepEqual(cube.face(face as Face), [before[6], before[3], before[0], before[7], before[4], before[1], before[8], before[5], before[2]]);
  }
});
