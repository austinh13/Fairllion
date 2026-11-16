// Light and weather. Each course is played under one mood, chosen from its
// seed, so everyone on the same round sees the same sky.

import { makeRng } from './rng.js';

/**
 * sky:    zenith, middle and horizon colours (the horizon matches the fog)
 * sun:    colour, strength, height above the horizon and bearing, in degrees
 *         (bearing 0 is behind the tee, so light falls down the hole)
 * fill:   sky and ground colours of the soft light, and its strength
 * leaves: canopy colours, light to dark; other keys recolour the ground
 */
export const MOODS = [
  {
    key: 'morning',
    name: 'Clear morning',
    sky: ['#4f9fe0', '#8fcaee', '#d4ecf1'],
    fog: [260, 1050],
    sun: { color: '#fff1d8', power: 2.5, height: 46, bearing: -38 },
    fill: { sky: '#cfe6ff', ground: '#4e6a35', power: 1.15 },
    leaves: ['#6aa84a', '#4f9140', '#3d7a36'],
    water: '#3b97d0',
    cloud: '#ffffff',
  },
  {
    key: 'noon',
    name: 'High noon',
    sky: ['#2e78d2', '#55a1ea', '#a9d8f6'],
    fog: [300, 1150],
    sun: { color: '#ffffff', power: 2.9, height: 70, bearing: -25 },
    fill: { sky: '#d8ecff', ground: '#557a36', power: 1.0 },
    leaves: ['#6db248', '#529a3c', '#3c8034'],
    water: '#2f8fd4',
    cloud: '#ffffff',
  },
  {
    key: 'golden',
    name: 'Golden hour',
    sky: ['#5376b8', '#e9a86a', '#ffd79c'],
    fog: [220, 920],
    sun: { color: '#ffc27a', power: 2.7, height: 20, bearing: -55 },
    fill: { sky: '#ffd2a1', ground: '#5c4a2a', power: 0.95 },
    leaves: ['#8fae45', '#6b9a3a', '#4e7d32'],
    water: '#4b8fba',
    cloud: '#ffe2c0',
    rough: '#6e9a3d',
  },
  {
    key: 'dusk',
    name: 'Dusk',
    sky: ['#26285a', '#86508e', '#ee8c6c'],
    fog: [170, 760],
    sun: { color: '#ffa070', power: 2.5, height: 17, bearing: -50 },
    fill: { sky: '#a49be6', ground: '#5d4c6e', power: 1.55 },
    leaves: ['#5c9446', '#457e3d', '#336535'],
    water: '#5a6fb4',
    cloud: '#f7b7a8',
  },
  {
    key: 'mist',
    name: 'Sea mist',
    sky: ['#9fb2b3', '#bfcdc9', '#d6e0da'],
    fog: [110, 600],
    sun: { color: '#f2f2ea', power: 1.2, height: 58, bearing: -20 },
    fill: { sky: '#e6eee9', ground: '#66775f', power: 1.65 },
    leaves: ['#5d8f55', '#4a7c4a', '#3a6740'],
    water: '#6d9ba6',
    cloud: '#eef3f0',
  },
  {
    key: 'autumn',
    name: 'Autumn afternoon',
    sky: ['#4686cc', '#86bbe2', '#e9dfc1'],
    fog: [240, 960],
    sun: { color: '#ffe0ad', power: 2.5, height: 34, bearing: 40 },
    fill: { sky: '#ffe9c8', ground: '#5d5232', power: 1.1 },
    leaves: ['#e7b43c', '#d9802c', '#bb4f2a'],
    water: '#3f8cc4',
    cloud: '#fff6e6',
    rough: '#7d993f',
  },
];

/** The mood a course is played under. */
export function moodFor(seed) {
  return makeRng(`${seed}|mood`).pick(MOODS);
}

/** The seed a hole was generated from (hole ids are "seed|index"). */
export function seedOfHole(hole) {
  return String(hole.id).replace(/\|\d+$/, '');
}
