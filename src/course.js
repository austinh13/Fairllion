// Course generation. A seed always produces the same six holes.

import { makeRng } from './rng.js';

/** The loop: two par 3s, two par 4s, two par 5s. Par 24. */
export const PARS = [4, 3, 5, 3, 4, 5];

const LENGTHS = { 3: [105, 170], 4: [240, 330], 5: [410, 520] };

const COURSE_A = ['Alder', 'Marl', 'Wex', 'Thorn', 'Ash', 'Brack', 'Hollin', 'Corbie', 'Dun', 'Whin', 'Farl', 'Pen', 'Roth', 'Sel', 'Tarn', 'Wold', 'Kes', 'Lind', 'Morn', 'Hare'];
const COURSE_B = ['wick', 'mere', 'ford', 'combe', 'stead', 'holt', 'bury', 'thorpe', 'ley', 'worth', 'garth', 'by'];
const COURSE_C = ['Links', 'Heath', 'Downs', 'Park', 'Common', 'Dunes', 'Moor', 'Hills'];

const HOLE_A = ['Heron', 'Kestrel', 'Foxglove', 'Barrow', 'Quarry', 'Millrace', 'Bracken', 'Lantern', 'Orchard', 'Warren', 'Thistle', 'Gorse', 'Larch', 'Beacon', 'Saddle', 'Cinder', 'Plover', 'Badger', 'Otter', 'Rowan', 'Hazel', 'Tinker', 'Drover', 'Piper', 'Harrow', 'Ember', 'Curlew', 'Wren', 'Marten', 'Sorrel'];
const HOLE_B = ['Bend', 'Rise', 'Hollow', 'Reach', 'Gap', 'Down', 'Corner', 'Walk', 'Ridge', 'Turn', 'Field', 'Bank', 'Run', 'Step', 'Brow', 'Dip', 'Mile', 'Cut', 'Leap', 'Rest'];

/** What waits more than 40 yards past each pin. */
export const BEYOND_KINDS = ['pond', 'pines', 'heather'];

export function generateCourse(seed) {
  const rng = makeRng(`${seed}|course`);
  const name = `${rng.pick(COURSE_A)}${rng.pick(COURSE_B)} ${rng.pick(COURSE_C)}`;
  const used = new Set();
  const holes = PARS.map((par, index) => generateHole(rng, par, index, seed, used));
  return { name, par: PARS.reduce((a, b) => a + b, 0), holes };
}

function generateHole(rng, par, index, seed, used) {
  const [lo, hi] = LENGTHS[par];
  const length = rng.int(lo, hi);

  // Hazards cross the line of play between two yardages.
  const want = par === 3 ? rng.pick([0, 1, 1]) : par === 4 ? rng.pick([1, 2, 2]) : rng.pick([2, 3, 3]);
  const maxWater = par === 5 ? 2 : 1;
  const hazards = [];
  let water = 0;
  for (let tries = 0; tries < 60 && hazards.length < want; tries++) {
    const type = water < maxWater && rng.chance(0.45) ? 'water' : 'sand';
    const width = type === 'water' ? rng.int(18, 30) : rng.int(14, 24);
    const first = 60;
    const last = length - 22 - width; // keep clear of the green
    if (last < first) continue;
    const from = rng.int(first, last);
    const to = from + width;
    if (hazards.some((h) => from <= h.to + 16 && to >= h.from - 16)) continue;
    hazards.push({ type, from, to });
    if (type === 'water') water++;
  }
  hazards.sort((a, b) => a.from - b.from);

  // No word is used twice on a course, so every hole sounds like its own place.
  let first;
  let second;
  do {
    first = rng.pick(HOLE_A);
  } while (used.has(first));
  do {
    second = rng.pick(HOLE_B);
  } while (used.has(second));
  used.add(first);
  used.add(second);
  const name = `${first} ${second}`;

  // Shape of the hole on the map. Purely cosmetic: play is along the line.
  const bend = par === 3 ? 0.45 : 1;
  const shape = {
    a1: rng.range(8, 20) * bend * (rng.chance(0.5) ? 1 : -1),
    w1: rng.range(300, 560),
    p1: rng.range(0, Math.PI * 2),
    a2: rng.range(1.5, 5),
    w2: rng.range(110, 180),
    p2: rng.range(0, Math.PI * 2),
  };

  return {
    id: `${seed}|${index}`,
    number: index + 1,
    name,
    par,
    length,
    hazards,
    beyond: rng.pick(BEYOND_KINDS),
    halfWidth: rng.range(17, 22),
    shape,
  };
}

/** Sideways offset of the hole's centre line at a given yardage. */
export function centerX(hole, y) {
  const s = hole.shape;
  return s.a1 * Math.sin((Math.PI * 2 * y) / s.w1 + s.p1) + s.a2 * Math.sin((Math.PI * 2 * y) / s.w2 + s.p2);
}

/** One line of plain English per hazard, for the hole card. */
export function describeHazards(hole) {
  const lines = hole.hazards.map((h) =>
    h.type === 'water' ? `Water from ${h.from} to ${h.to} yards` : `Sand from ${h.from} to ${h.to} yards`,
  );
  const behind = { pond: 'A pond behind the green', pines: 'Pines behind the green', heather: 'Heather behind the green' }[hole.beyond];
  lines.push(behind);
  return lines;
}
