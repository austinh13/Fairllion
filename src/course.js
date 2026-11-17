// Course generation. A seed always produces the same three holes.

import { makeRng } from './rng.js';
import { settingKeyFor } from './setting.js';

/** The loop: a par 3, a par 4 and a par 5. Par 12. */
export const PARS = [3, 4, 5];

const LENGTHS = { 3: [105, 170], 4: [240, 330], 5: [410, 520] };

const COURSE_A = ['Alder', 'Marl', 'Wex', 'Thorn', 'Ash', 'Brack', 'Hollin', 'Corbie', 'Dun', 'Whin', 'Farl', 'Pen', 'Roth', 'Sel', 'Tarn', 'Wold', 'Kes', 'Lind', 'Morn', 'Hare'];
const COURSE_B = ['wick', 'mere', 'ford', 'combe', 'stead', 'holt', 'bury', 'thorpe', 'ley', 'worth', 'garth', 'by'];
const COURSE_C = ['Links', 'Heath', 'Downs', 'Park', 'Common', 'Dunes', 'Moor', 'Hills', 'Pines', 'Mesa', 'Bay', 'Cove', 'Garden', 'Fell'];

const HOLE_A = ['Heron', 'Kestrel', 'Foxglove', 'Barrow', 'Quarry', 'Millrace', 'Bracken', 'Lantern', 'Orchard', 'Warren', 'Thistle', 'Gorse', 'Larch', 'Beacon', 'Saddle', 'Cinder', 'Plover', 'Badger', 'Otter', 'Rowan', 'Hazel', 'Tinker', 'Drover', 'Piper', 'Harrow', 'Ember', 'Curlew', 'Wren', 'Marten', 'Sorrel'];
const HOLE_B = ['Bend', 'Rise', 'Hollow', 'Reach', 'Gap', 'Down', 'Corner', 'Walk', 'Ridge', 'Turn', 'Field', 'Bank', 'Run', 'Step', 'Brow', 'Dip', 'Mile', 'Cut', 'Leap', 'Rest'];

/** What waits more than 40 yards past each pin. */
export const BEYOND_KINDS = ['pond', 'pines', 'heather'];

/**
 * Holes modelled on famous real ones. The hazards sit where the originals'
 * do, scaled to this game's yardages (its longest club is 300 yards).
 *
 * after:   the hole it is modelled on, shown on the hole card
 * look:    extra scenery for the 3D course (island green, azaleas)
 */
export const CLASSICS = [
  { name: 'Island Green', after: 'the 17th at TPC Sawgrass, Florida', par: 3, length: 137, setting: 'parkland', beyond: 'pond', look: { island: true }, hazards: [['water', 60, 117]] },
  { name: 'Postage Stamp', after: 'the 8th at Royal Troon, Scotland', par: 3, length: 123, setting: 'links', beyond: 'heather', halfWidth: 17, hazards: [['sand', 80, 103]] },
  { name: 'Golden Bell', after: 'the 12th at Augusta National, Georgia', par: 3, length: 155, setting: 'parkland', beyond: 'pines', look: { azaleas: true }, hazards: [['water', 94, 114], ['sand', 121, 135]] },
  { name: 'Little Seven', after: 'the 7th at Pebble Beach, California', par: 3, length: 106, setting: 'links', beyond: 'pond', hazards: [['sand', 64, 84]] },
  { name: 'Desert Coliseum', after: 'the 16th at TPC Scottsdale, Arizona', par: 3, length: 163, setting: 'desert', beyond: 'heather', hazards: [['sand', 112, 136]] },
  { name: 'Old Redan', after: 'the 15th at North Berwick, Scotland', par: 3, length: 170, setting: 'links', beyond: 'heather', hazards: [['sand', 126, 149]] },
  { name: 'Calamity Chasm', after: 'the 16th at Royal Portrush, Northern Ireland', par: 3, length: 170, setting: 'links', beyond: 'heather', halfWidth: 17, hazards: [] },
  { name: 'Cypress Carry', after: 'the 16th at Cypress Point, California', par: 3, length: 170, setting: 'links', beyond: 'pond', hazards: [['water', 60, 148]] },
  { name: 'High Eden', after: 'the 11th on the Old Course, St Andrews', par: 3, length: 168, setting: 'links', beyond: 'pond', hazards: [['sand', 124, 147]] },
  { name: 'Devils Cauldron', after: 'the 4th at Banff Springs, Alberta', par: 3, length: 165, setting: 'alpine', beyond: 'pines', hazards: [['water', 70, 132]] },
  { name: 'Lava Shore', after: 'the 3rd at Mauna Kea, Hawaii', par: 3, length: 165, setting: 'tropical', beyond: 'pond', hazards: [['water', 62, 140]] },
  { name: 'Road Hole', after: 'the 17th on the Old Course, St Andrews', par: 4, length: 330, setting: 'links', beyond: 'heather', hazards: [['sand', 286, 308]] },
  { name: 'Swilcan Burn', after: 'the 1st on the Old Course, St Andrews', par: 4, length: 326, setting: 'links', beyond: 'heather', halfWidth: 22, hazards: [['water', 282, 304]] },
  { name: 'Barry Water', after: 'the 18th at Carnoustie, Scotland', par: 4, length: 320, setting: 'links', beyond: 'heather', hazards: [['water', 150, 170], ['water', 270, 292]] },
  { name: 'Church Pews', after: 'the 3rd at Oakmont, Pennsylvania', par: 4, length: 330, setting: 'parkland', beyond: 'pines', hazards: [['sand', 130, 154], ['sand', 198, 222]] },
  { name: 'Short Ten', after: 'the 10th at Riviera, California', par: 4, length: 315, setting: 'parkland', beyond: 'heather', halfWidth: 18, hazards: [['sand', 238, 260], ['sand', 276, 295]] },
  { name: 'Cliff Leap', after: 'the 8th at Pebble Beach, California', par: 4, length: 330, setting: 'links', beyond: 'pond', hazards: [['water', 244, 300]] },
  { name: 'White Dogwood', after: 'the 11th at Augusta National, Georgia', par: 4, length: 330, setting: 'parkland', beyond: 'pines', look: { azaleas: true }, hazards: [['water', 284, 308]] },
  { name: 'Slieve Donard', after: 'the 9th at Royal County Down, Northern Ireland', par: 4, length: 328, setting: 'heath', beyond: 'heather', hazards: [['sand', 180, 204]] },
  { name: 'Lighthouse Home', after: 'the 18th at Harbour Town, South Carolina', par: 4, length: 326, setting: 'tropical', beyond: 'pond', hazards: [['water', 200, 228]] },
  { name: 'Azalea Creek', after: 'the 13th at Augusta National, Georgia', par: 5, length: 510, setting: 'parkland', beyond: 'pines', look: { azaleas: true }, hazards: [['water', 452, 478]] },
  { name: 'Firethorn Pond', after: 'the 15th at Augusta National, Georgia', par: 5, length: 520, setting: 'parkland', beyond: 'pond', look: { azaleas: true }, hazards: [['water', 466, 492]] },
  { name: 'Hell Bunker', after: 'the 14th on the Old Course, St Andrews', par: 5, length: 520, setting: 'links', beyond: 'heather', hazards: [['sand', 200, 222], ['sand', 392, 418]] },
  { name: 'Hogans Alley', after: 'the 6th at Carnoustie, Scotland', par: 5, length: 500, setting: 'links', beyond: 'heather', halfWidth: 17, hazards: [['sand', 236, 258], ['water', 430, 452]] },
  { name: 'Lake Horseshoe', after: 'the 6th at Bay Hill, Florida', par: 5, length: 505, setting: 'parkland', beyond: 'pond', hazards: [['water', 120, 150], ['water', 330, 358]] },
  { name: 'Plantation Home', after: 'the 18th at Kapalua, Hawaii', par: 5, length: 520, setting: 'tropical', beyond: 'pines', hazards: [['sand', 300, 324], ['sand', 470, 494]] },
  { name: 'Ocean Finish', after: 'the 18th at Pebble Beach, California', par: 5, length: 520, setting: 'links', beyond: 'pond', hazards: [['sand', 255, 277], ['sand', 472, 496]] },
];

export function generateCourse(seed) {
  const rng = makeRng(`${seed}|course`);
  const name = `${rng.pick(COURSE_A)}${rng.pick(COURSE_B)} ${rng.pick(COURSE_C)}`;
  const used = new Set();
  const setting = settingKeyFor(name);
  const holes = PARS.map((par, index) => ({ ...generateHole(rng, par, index, seed, used), setting }));

  // One hole on every course, sometimes two, is modelled on a real one. They
  // are dealt from their own stream so the other holes stay as they were.
  const deal = makeRng(`${seed}|classics`);
  const slots = deal.shuffle(holes.map((_, i) => i)).slice(0, deal.chance(0.35) ? 2 : 1);
  const taken = new Set();
  for (const i of slots) {
    const words = new Set(holes.flatMap((h, n) => (n === i ? [] : h.name.split(' '))));
    const fits = CLASSICS.filter((c) => c.par === holes[i].par && !taken.has(c) && c.name.split(' ').every((w) => !words.has(w)));
    if (!fits.length) continue;
    const c = deal.pick(fits);
    taken.add(c);
    holes[i] = {
      ...holes[i],
      name: c.name,
      after: c.after,
      length: c.length,
      setting: c.setting,
      beyond: c.beyond,
      halfWidth: c.halfWidth ?? holes[i].halfWidth,
      look: c.look ?? null,
      hazards: c.hazards.map(([type, from, to]) => ({ type, from, to })),
    };
  }
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
