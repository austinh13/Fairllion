// The course in 3D: blocky voxel ground under a drone camera, drawn at low
// resolution and scaled up with hard edges so every pixel stays chunky.
//
// World units are yards. In three.js terms x is sideways (the hole's x), y is
// up, and z is minus the distance from the tee, so a hole runs away from a
// camera that sits behind the ball. Browsers without WebGL get the flat map.

import * as THREE from '../vendor/three.module.min.js';
import { centerX } from './course.js';
import { moodFor, seedOfHole } from './mood.js';
import { createRenderer as createFlatRenderer } from './render2d.js';
import { makeRng } from './rng.js';
import { BEYOND, CLUBS, GREEN_RADIUS, TEE_BACK } from './rules.js';
import { settingOf } from './setting.js';

/** One colour per rarity tier, shared with the stylesheet. */
export const TIER_COLORS = ['#7f9c22', '#14998a', '#2f74d0', '#8b52c8', '#e0472c'];

const CELL = 3; // yards per voxel across the ground
const STEP = 1.5; // yards per step of height
const X_HALF = 189; // the detailed course runs this far either side of the tee
const TREE_VOXEL = 2;
const BALL = 1.8; // the ball is drawn far larger than life so it can be seen
const TAU = Math.PI * 2;

const PALETTE = {
  rough: '#5c983c',
  fairway: '#88c552',
  stripe: '#7aba48',
  green: '#bdee80',
  greenAlt: '#aee470',
  fringe: '#67a542',
  semi: '#6fae45',
  shore: '#d6c58d',
  shoreDark: '#b9ad74',
  wood: '#b0834f',
  woodDark: '#84603a',
  tee: '#92d45c',
  sand: '#f0dca2',
  sandDark: '#d9c185',
  bed: '#8b7a52',
  dirt: '#7c5535',
  dirtDark: '#603f27',
  stone: '#7d786d',
  stoneDark: '#615d55',
  heather: '#9d6aaa',
  heatherDark: '#7b5191',
  pineGround: '#4c7b3d',
  pine: '#2f6c4a',
  pineDark: '#245a3d',
  trunk: '#6d462a',
  stake: '#f6f2e6',
  flag: '#e2452d',
  pole: '#f4f0e4',
  cup: '#18211b',
  snow: '#f1f5f7',
  cactus: '#4f8f4a',
  cactusDark: '#3d7640',
};

// Ground kinds.
const ROUGH = 0;
const FAIRWAY = 1;
const GREEN = 2;
const FRINGE = 3;
const TEE = 4;
const SAND = 5;
const WATER = 6;
const HEATHER = 7;
const PINES = 8;
const POND = 9;
const SHORE = 10; // the sandy edge of a river or lake
const SEMI = 11; // the first cut of rough beside the fairway

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const snap = (h) => Math.round(h / STEP) * STEP;

/** A cheap, stable hash of two integers into [0, 1). */
function noise2(i, j, salt = 0) {
  let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(salt, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// ---- meshing ----------------------------------------------------------------

const NORMALS = { px: [1, 0, 0], nx: [-1, 0, 0], py: [0, 1, 0], ny: [0, -1, 0], pz: [0, 0, 1], nz: [0, 0, -1] };

/** Collects coloured, axis-aligned faces into one geometry. */
function makeMesher() {
  const pos = [];
  const nor = [];
  const col = [];
  const idx = [];
  let n = 0;
  return {
    face(side, x0, y0, z0, x1, y1, z1, c) {
      switch (side) {
        case 'py': pos.push(x0, y1, z1, x1, y1, z1, x1, y1, z0, x0, y1, z0); break;
        case 'ny': pos.push(x0, y0, z0, x1, y0, z0, x1, y0, z1, x0, y0, z1); break;
        case 'px': pos.push(x1, y0, z1, x1, y0, z0, x1, y1, z0, x1, y1, z1); break;
        case 'nx': pos.push(x0, y0, z0, x0, y0, z1, x0, y1, z1, x0, y1, z0); break;
        case 'pz': pos.push(x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1); break;
        default: pos.push(x1, y0, z0, x0, y0, z0, x0, y1, z0, x1, y1, z0);
      }
      const nn = NORMALS[side];
      for (let i = 0; i < 4; i++) {
        nor.push(nn[0], nn[1], nn[2]);
        col.push(c.r, c.g, c.b);
      }
      idx.push(n, n + 1, n + 2, n, n + 2, n + 3);
      n += 4;
    },
    box(x0, y0, z0, x1, y1, z1, c, skipBottom = true) {
      addBox(this, x0, y0, z0, x1, y1, z1, c, skipBottom);
    },
    geometry() {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      g.setIndex(n > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
      g.computeBoundingSphere();
      return g;
    },
    get empty() {
      return n === 0;
    },
  };
}

function addBox(m, x0, y0, z0, x1, y1, z1, c, skipBottom = true) {
  m.face('px', x0, y0, z0, x1, y1, z1, c);
  m.face('nx', x0, y0, z0, x1, y1, z1, c);
  m.face('py', x0, y0, z0, x1, y1, z1, c);
  m.face('pz', x0, y0, z0, x1, y1, z1, c);
  m.face('nz', x0, y0, z0, x1, y1, z1, c);
  if (!skipBottom) m.face('ny', x0, y0, z0, x1, y1, z1, c);
}

/**
 * Like a mesher, but split into square tiles of the ground (in yards from
 * ox, oy), so the camera and the sun can skip the tiles they cannot see.
 */
function makeTiles(size, ox, oy) {
  const tiles = new Map();
  return {
    face(side, x0, y0, z0, x1, y1, z1, c) {
      const i = Math.floor(((x0 + x1) / 2 - ox) / size);
      const j = Math.floor((-(z0 + z1) / 2 - oy) / size);
      const key = (i + 512) * 1024 + j + 512;
      let m = tiles.get(key);
      if (!m) tiles.set(key, (m = makeMesher()));
      m.face(side, x0, y0, z0, x1, y1, z1, c);
    },
    box(x0, y0, z0, x1, y1, z1, c, skipBottom = true) {
      addBox(this, x0, y0, z0, x1, y1, z1, c, skipBottom);
    },
    geometries() {
      return [...tiles.values()].map((m) => m.geometry());
    },
  };
}

/** Colours, converted once; `shade` returns a scratch copy scaled by f. */
function makePaint(mood, setting) {
  const base = {};
  const local = Object.fromEntries(Object.entries(setting).filter(([k, v]) => k in PALETTE && typeof v === 'string'));
  for (const [k, v] of Object.entries({ ...PALETTE, rough: mood.rough || PALETTE.rough, ...local, water: setting.water || mood.water })) {
    base[k] = new THREE.Color(v);
  }
  base.leaves = (setting.leaves || mood.leaves).map((c) => new THREE.Color(c));
  const scratch = new THREE.Color();
  return {
    base,
    shade(c, f) {
      return scratch.copy(c).multiplyScalar(f);
    },
  };
}

// ---- the world --------------------------------------------------------------

/** Everything about a hole that never changes while it is played. */
function buildWorld(hole, mood) {
  const rng = makeRng(`voxel|${hole.id}`);
  const S = settingOf(hole);
  const paint = makePaint(mood, S);
  const P = paint.base;
  const pin = hole.length;
  const island = Boolean(hole.look && hole.look.island);
  const azaleas = Boolean(hole.look && hole.look.azaleas);
  const cx = (y) => centerX(hole, y);
  const wob = rng.range(0, TAU);
  const fw = (y) => hole.halfWidth * (1 + 0.1 * Math.sin(y / 41 + wob));

  // The lie of the land: a gentle roll along the hole and hills either side.
  const b1 = rng.range(0, TAU);
  const b2 = rng.range(0, TAU);
  const amp = rng.range(1.5, 3.5);
  const bed = (y) => amp * Math.sin(y / 97 + b1) + 1.2 * Math.sin(y / 41 + b2);
  const n1 = rng.range(0, TAU);
  const n2 = rng.range(0, TAU);
  const n3 = rng.range(0, TAU);
  const hills = (x, y) => S.hills * (3 * Math.sin(x / 41 + n1) * Math.sin(y / 47 + n2) + 1.2 * Math.sin((x + y) / 26 + n3));
  const lean = rng.range(-0.4, 0.4); // one side of the valley stands taller

  const yMin = -72;
  const yMax = pin + BEYOND + 150;
  const cols = Math.round((2 * X_HALF) / CELL);
  // A multiple of nine rows, so the coarser countryside around it tiles exactly.
  const rows = Math.ceil((yMax - yMin) / (CELL * 9)) * 9;
  const xAt = (i) => -X_HALF + (i + 0.5) * CELL;
  const yAt = (j) => yMin + (j + 0.5) * CELL;
  const kind = new Uint8Array(cols * rows);
  const top = new Float32Array(cols * rows);
  const wet = new Float32Array(cols * rows).fill(NaN); // water surface, where there is water
  const rise = new Float32Array(cols * rows);

  // Hazards, shaped as on the flat map so the two always agree.
  const bunkers = hole.hazards.filter((h) => h.type === 'sand').map((h) => {
    const mid = (h.from + h.to) / 2;
    return { mid, ry: (h.to - h.from) / 2, rx: fw(mid) + 7, x0: cx(mid), ph: rng.range(0, TAU) };
  });
  const rivers = hole.hazards.filter((h) => h.type === 'water').map((h) => ({
    h,
    x0: cx((h.from + h.to) / 2),
    p1: rng.range(0, TAU),
    p2: rng.range(0, TAU),
    l1: rng.range(34, 52),
    l2: rng.range(34, 52),
    level: snap(bed((h.from + h.to) / 2)),
  }));
  const bx = cx(pin + BEYOND);
  const bp = rng.range(0, TAU);
  const bl = rng.range(30, 46);
  const beyondEdge = (x) => pin + BEYOND + 0.5 + 3 * (Math.sin((x - bx) / bl + bp) - Math.sin(bp));
  const pinX = cx(pin);
  const teeX = cx(0);
  const greenLevel = snap(bed(pin)) + STEP;
  const teeLevel = snap(bed(0)) + STEP;
  // Around an island green the lake lies at the level of its water hazard.
  const pondLevel = hole.look && hole.look.island && rivers.length ? Math.min(rivers[0].level, greenLevel - STEP) : snap(bed(pin + BEYOND));
  // Around an island green the lake starts where the water hazard does.
  const lakeFrom = island && rivers.length ? rivers[0].h.from : pin + BEYOND;
  if (island) for (const r of rivers) r.level = pondLevel;
  const frontEdge = (x) => lakeFrom + 3 * Math.sin(x / 31 + bp);

  // The pond behind the green is a lake with a far shore, not a sea.
  const lakeY = island ? pin + 30 : pin + BEYOND + 95;
  const lakeRy = island ? 230 : 175;
  const inLake = (x, y) => {
    const u = (x - bx) / 290;
    const v = (y - lakeY) / lakeRy;
    return u * u + v * v <= 1 + 0.12 * Math.sin(x / 37 + n1) + 0.1 * Math.sin(y / 29 + n3);
  };
  const ease = (t) => t * t * (3 - 2 * t);

  /** Where a river's two banks lie at x. It narrows to a stream away from the course. */
  const B = { near: 0, far: 0 };
  const band = (r, x) => {
    const far = r.h.to + 3 * (Math.sin((x - r.x0) / r.l1 + r.p1) - Math.sin(r.p1));
    const near = r.h.from + 3 * (Math.sin((x - r.x0) / r.l2 + r.p2) - Math.sin(r.p2));
    const squeeze = clamp(1 - (Math.abs(x - r.x0) - 170) / 380, 0.35, 1);
    const mid = (far + near) / 2;
    B.near = mid - ((far - near) / 2) * squeeze;
    B.far = mid + ((far - near) / 2) * squeeze;
  };
  const inRiver = (r, x, y) => {
    band(r, x);
    return y >= B.near && y <= B.far;
  };

  /** The natural lie of the land anywhere, ignoring the course itself. */
  const landAt = (x, y) => {
    const c = cx(clamp(y, -TEE_BACK, pin + BEYOND));
    const side = Math.max(0, Math.abs(x - c) - fw(y) - 14);
    const up = Math.min(19, (side / 17) ** 1.25 * 1.7 * (1 + lean * Math.sign(x - c)));
    const roll = hills(x, y) * Math.min(1, side / 26);
    // Farther out, broad hills roll away towards the horizon.
    const swell = 10 * Math.sin(x / 150 + n2) * Math.sin(y / 190 + n1) * clamp((side - 120) / 260, 0, 1);
    let h = snap(bed(clamp(y, -40, pin + BEYOND + 30))) + up + roll + swell;
    // The ground eases down to the water, so banks are low rather than cliffs.
    for (const r of rivers) {
      const reach = clamp((600 - Math.abs(x - r.x0)) / 60, 0, 1);
      if (!reach) continue;
      band(r, x);
      const d = y < B.near ? B.near - y : y > B.far ? y - B.far : 0;
      h = r.level + (h - r.level) * (1 - (1 - ease(clamp(d / 42, 0, 1))) * reach);
    }
    if (hole.beyond === 'pond' || island) {
      const q = Math.hypot((x - bx) / 290, (y - lakeY) / lakeRy);
      const back = clamp((y - (lakeFrom - 30)) / 30, 0, 1);
      h = pondLevel + (h - pondLevel) * (1 - (1 - ease(clamp((q - 0.95) / 0.45, 0, 1))) * back);
    }
    return { up, h: snap(h) };
  };

  for (let j = 0; j < rows; j++) {
    const y = yAt(j);
    const c = cx(clamp(y, -TEE_BACK, pin + BEYOND));
    const w = fw(y);
    const b = snap(bed(clamp(y, -40, pin + BEYOND + 30)));
    const y0 = 24;
    const y1 = pin - 6;
    const t = clamp(Math.min((y - y0) / 20, (y1 - y) / 18), 0, 1);
    const fairHalf = y >= y0 && y <= y1 ? w * Math.sqrt(1 - (1 - t) * (1 - t)) : -1;
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      const x = xAt(i);
      const dx = Math.abs(x - c);
      const land = landAt(x, y);
      rise[k] = land.up;
      let kd = ROUGH;
      let h = land.h;

      const dPin = Math.hypot(x - pinX, y - pin);
      if (y > beyondEdge(x)) {
        if (hole.beyond === 'pond') {
          kd = POND;
          h = pondLevel - 2 * STEP;
          wet[k] = pondLevel - 0.7;
        } else if (hole.beyond === 'pines') {
          kd = PINES;
        } else {
          kd = HEATHER;
          h = land.h + (noise2(i, j, 3) < 0.45 ? STEP : 0);
        }
      } else if (dPin <= GREEN_RADIUS) {
        kd = GREEN;
        h = greenLevel;
      } else if (dPin <= GREEN_RADIUS + 3.5) {
        kd = FRINGE;
        h = greenLevel;
      } else if (Math.abs(x - teeX) <= 6 && Math.abs(y) <= 4.5) {
        kd = TEE;
        h = teeLevel;
      } else if (dx <= fairHalf) {
        kd = FAIRWAY;
        h = b;
      } else if (fairHalf >= 0 && dx <= fairHalf + 6) {
        kd = SEMI;
        h = b;
      } else if (dPin <= GREEN_RADIUS + 14) {
        h = greenLevel - STEP; // a flat collar of rough around the green
      }

      if (island && (kd === ROUGH || kd === SEMI) && dPin > GREEN_RADIUS + 9 && y > frontEdge(x) && inLake(x, y)) {
        kd = POND;
        h = pondLevel - 2 * STEP;
        wet[k] = pondLevel - 0.7;
      }

      for (const s of bunkers) {
        // A lobed outline, never smaller than the hazard itself along the line of play.
        const u = (x - s.x0) / s.rx;
        const v = (y - s.mid) / s.ry;
        const lobes = 1.12 + 0.12 * Math.sin(Math.atan2(v, u) * 3 + s.ph);
        const m = (Math.abs(u) ** 2.4 + Math.abs(v) ** 2.4) / lobes ** 2.4;
        if (m <= 1) {
          kd = SAND;
          h = b - (m < 0.5 ? 1.5 : 0.75); // deeper in the middle
        }
      }
      for (const r of rivers) {
        if (inRiver(r, x, y)) {
          kd = WATER;
          h = r.level - 2 * STEP;
          wet[k] = r.level - 0.7;
        }
      }
      kind[k] = kd;
      top[k] = h;
    }
  }

  // Edges: a raised grass lip around each bunker, and a sandy shore by the water.
  {
    const lip = [];
    const shore = [];
    const soft = (kd) => kd === ROUGH || kd === SEMI || kd === FAIRWAY;
    const wetKind = (kd) => kd === WATER || kd === POND;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        if (!soft(kind[k])) continue;
        let sand = false;
        let water = false;
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            const ii = i + di;
            const jj = j + dj;
            if (ii < 0 || jj < 0 || ii >= cols || jj >= rows) continue;
            const kd = kind[jj * cols + ii];
            if (kd === SAND && (di === 0 || dj === 0)) sand = true;
            if (wetKind(kd)) water = true;
          }
        }
        if (water && kind[k] === ROUGH) shore.push(k);
        else if (sand) lip.push(k);
      }
    }
    for (const k of lip) {
      kind[k] = FRINGE;
      top[k] += 0.75;
    }
    for (const k of shore) kind[k] = SHORE;
  }

  const cellOf = (x, y) => {
    const i = Math.floor((x + X_HALF) / CELL);
    const j = Math.floor((y - yMin) / CELL);
    if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
    return j * cols + i;
  };
  /** Height of whatever the ball would rest on (the water's surface, in water). */
  const groundAt = (x, y) => {
    const k = cellOf(x, y);
    if (k < 0) return landAt(x, y).h;
    return Number.isNaN(wet[k]) ? top[k] : wet[k];
  };

  // ---- ground mesh ----
  // The course (with its trees) casts shadows; the countryside only takes them.
  const course = makeTiles(126, -X_HALF, yMin);
  const land = makeTiles(540, -1620, yMin - 1431);
  const water = makeMesher();
  const topColor = new THREE.Color();
  /** Open ground: grass, with snow, bare rock or heather where the setting has them. */
  const roughColor = (x, y, i, j, up) => {
    if (S.snow && up > 8 + 3 * noise2(i, j, 7)) return P.snow;
    if (up > 11 && noise2(i, j, 2) < 0.35) return P.stone;
    if (S.heather && Math.sin(x / 23 + n1) * Math.sin(y / 19 + n3) > 0.4) return noise2(i, j, 9) < 0.6 ? P.heather : P.heatherDark;
    return Math.sin(x / 13) * Math.sin(y / 11) > 0.35 ? paint.shade(P.rough, 0.9) : P.rough;
  };
  const lipKinds = new Set([ROUGH, FAIRWAY, GREEN, FRINGE, TEE, HEATHER, PINES, SHORE, SEMI]);
  // A one-step edge is tinted against the sun: a little darker where it is lit,
  // lighter where it is in shade, so slopes read as ground and not as stripes.
  const az = (mood.sun.bearing * Math.PI) / 180;
  const sunX = Math.sin(az);
  const sunZ = Math.cos(az);
  const stepTint = {};
  for (const [side, n] of Object.entries(NORMALS)) stepTint[side] = 1.06 - 0.16 * (n[0] * sunX + n[2] * sunZ);
  /** The exposed side of a column: a lip of the top colour, then earth, then stone. */
  const wall = (m, s, x0, z0, x1, z1, h, hn, kd, f, salt) => {
    if (hn >= h) return;
    let yTop = h;
    if (lipKinds.has(kd)) {
      // A single step stays grassy; only real drops show earth.
      const single = h - hn <= STEP + 0.01;
      const lip = single ? hn : Math.max(hn, h - 0.6);
      m.face(s, x0, lip, z0, x1, h, z1, paint.shade(topColor, single ? stepTint[s] : 0.82));
      yTop = lip;
    } else if (kd === SAND) {
      const lip = Math.max(hn, h - 0.8);
      m.face(s, x0, lip, z0, x1, h, z1, paint.shade(P.sandDark, 0.95));
      yTop = lip;
    }
    if (yTop <= hn) return;
    const rock = -5;
    if (yTop > rock) {
      m.face(s, x0, Math.max(hn, rock), z0, x1, yTop, z1, paint.shade((Math.floor(yTop / STEP) + salt) % 3 ? P.dirt : P.dirtDark, f));
    }
    if (hn < rock) {
      m.face(s, x0, hn, z0, x1, Math.min(rock, yTop), z1, paint.shade(noise2(salt, 0, 11) < 0.5 ? P.stone : P.stoneDark, f));
    }
  };
  for (let j = 0; j < rows; j++) {
    const ya = yMin + j * CELL;
    const z0 = -(ya + CELL);
    const z1 = -ya;
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      const x0 = -X_HALF + i * CELL;
      const x1 = x0 + CELL;
      const h = top[k];
      const kd = kind[k];
      const y = yAt(j);
      const f = 0.95 + noise2(i, j) * 0.1;
      let c;
      switch (kd) {
        case FAIRWAY: c = Math.floor(y / 12) % 2 ? P.stripe : P.fairway; break;
        case GREEN: c = (Math.floor(i / 2) + Math.floor(j / 2)) % 2 ? P.greenAlt : P.green; break;
        case FRINGE: c = P.fringe; break;
        case SEMI: c = P.semi; break;
        case SHORE: c = noise2(i, j, 6) < 0.3 ? P.shoreDark : P.shore; break;
        case TEE: c = P.tee; break;
        case SAND: c = noise2(i, j, 5) < 0.18 ? P.sandDark : P.sand; break;
        case WATER: case POND: c = P.bed; break;
        case HEATHER: c = noise2(i, j, 9) < 0.55 ? P.heather : noise2(i, j, 4) < 0.5 ? P.heatherDark : P.rough; break;
        case PINES: c = P.pineGround; break;
        default:
          c = roughColor(x0, y, i, j, rise[k]);
      }
      topColor.copy(c).multiplyScalar(f);
      course.face('py', x0, h - 1, z0, x1, h, z1, topColor);

      // At the edge, a short skirt meets the countryside around the course.
      wall(course, 'px', x0, z0, x1, z1, h, i + 1 < cols ? top[k + 1] : h - 10, kd, f, i + j);
      wall(course, 'nx', x0, z0, x1, z1, h, i > 0 ? top[k - 1] : h - 10, kd, f, i + j);
      wall(course, 'nz', x0, z0, x1, z1, h, j + 1 < rows ? top[k + cols] : h - 10, kd, f, i + j);
      wall(course, 'pz', x0, z0, x1, z1, h, j > 0 ? top[k - cols] : h - 10, kd, f, i + j);

      if (!Number.isNaN(wet[k])) water.face('py', x0, wet[k] - 1, z0, x1, wet[k], z1, P.water);
    }
  }

  // ---- the countryside: coarser blocks the farther out, fading into the haze ----
  const courseTop = yMin + rows * CELL;
  const forest = (x, y) => Math.sin(x / 71 + n3) * Math.sin(y / 63 + n1) + 0.5 * Math.sin((x - y) / 37 + n2);
  const landCell = (x, y, cell) => {
    const land = landAt(x, y);
    const c = { kd: ROUGH, h: land.h, wl: NaN, up: land.up };
    if (island && y > frontEdge(x) && inLake(x, y)) {
      Object.assign(c, { kd: POND, h: pondLevel - 2 * STEP, wl: pondLevel - 0.7 });
    } else if (y > beyondEdge(x)) {
      if (hole.beyond !== 'pond') c.kd = hole.beyond === 'pines' ? PINES : HEATHER;
      else if (inLake(x, y)) Object.assign(c, { kd: POND, h: pondLevel - 2 * STEP, wl: pondLevel - 0.7 });
    } else if (cell < 20) {
      for (const r of rivers) if (inRiver(r, x, y)) Object.assign(c, { kd: WATER, h: r.level - 2 * STEP, wl: r.level - 0.7 });
    }
    return c;
  };
  const ring = (cell, ox, oy, nx, ny, gap) => {
    const heights = new Float32Array(nx * ny).fill(NaN);
    const kinds = new Uint8Array(nx * ny).fill(255);
    const cells = [];
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const xa = ox + i * cell;
        const ya = oy + j * cell;
        if (xa >= gap.x0 && xa + cell <= gap.x1 && ya >= gap.y0 && ya + cell <= gap.y1) continue;
        const c = landCell(xa + cell / 2, ya + cell / 2, cell);
        heights[j * nx + i] = c.h;
        kinds[j * nx + i] = c.kd;
        cells.push([i, j, c]);
      }
    }
    const wetAt = (i, j) => {
      if (i < 0 || j < 0 || i >= nx || j >= ny) return false;
      const kd = kinds[j * nx + i];
      return kd === WATER || kd === POND;
    };
    const near = (i, j, h) => {
      if (i < 0 || j < 0 || i >= nx || j >= ny) return h - 10;
      const v = heights[j * nx + i];
      return Number.isNaN(v) ? h - 10 : v;
    };
    for (const [i, j, c] of cells) {
      const x0 = ox + i * cell;
      const x1 = x0 + cell;
      const ya = oy + j * cell;
      const z0 = -(ya + cell);
      const z1 = -ya;
      const xm = x0 + cell / 2;
      const ym = ya + cell / 2;
      const f = 0.95 + noise2(i, j, cell) * 0.1;
      let col;
      if (c.kd === ROUGH && (wetAt(i + 1, j) || wetAt(i - 1, j) || wetAt(i, j + 1) || wetAt(i, j - 1))) c.kd = SHORE;
      switch (c.kd) {
        case POND: case WATER: col = P.bed; break;
        case SHORE: col = noise2(i, j, 6) < 0.3 ? P.shoreDark : P.shore; break;
        case PINES: col = P.pineGround; break;
        case HEATHER: col = noise2(i, j, 9) < 0.55 ? P.heather : P.heatherDark; break;
        default:
          col = forest(xm, ym) > 0.55 && c.up < 8 ? P.pineGround : roughColor(xm, ym, i, j, c.up);
      }
      topColor.copy(col).multiplyScalar(f);
      land.face('py', x0, c.h - 1, z0, x1, c.h, z1, topColor);
      wall(land, 'px', x0, z0, x1, z1, c.h, near(i + 1, j, c.h), c.kd, f, i + j);
      wall(land, 'nx', x0, z0, x1, z1, c.h, near(i - 1, j, c.h), c.kd, f, i + j);
      wall(land, 'nz', x0, z0, x1, z1, c.h, near(i, j + 1, c.h), c.kd, f, i + j);
      wall(land, 'pz', x0, z0, x1, z1, c.h, near(i, j - 1, c.h), c.kd, f, i + j);
      if (!Number.isNaN(c.wl)) water.face('py', x0, c.wl - 1, z0, x1, c.wl, z1, P.water);
    }
  };
  // 9-yard blocks out to about 350 yards, then 27-yard blocks well past the haze.
  ring(9, -540, yMin - 351, 120, (rows * CELL + 702) / 9, { x0: -X_HALF, x1: X_HALF, y0: yMin, y1: courseTop });
  ring(27, -1620, yMin - 1431, 120, (rows * CELL + 2862) / 27, { x0: -540, x1: 540, y0: yMin - 351, y1: courseTop + 351 });

  // ---- trees, stakes and the like ----
  const blocked = (x, y, r) => {
    if (y > -24 && y < pin + BEYOND + 2 && Math.abs(x - cx(y)) < Math.max(fw(y) + 9, 30) + r) return true;
    for (const h of hole.hazards) {
      if (h.type === 'water' && y > h.from - 9 - r && y < h.to + 9 + r) return true;
    }
    return y > pin + BEYOND - 4 - r;
  };
  const trunkAt = (x, y) => {
    const k = cellOf(x, y);
    return k >= 0 && (kind[k] === ROUGH || kind[k] === PINES || kind[k] === HEATHER) ? top[k] : null;
  };
  const tr = makeRng(`trees|${hole.id}`);
  const grid = 21;
  for (let gy = yMin + 4; gy < pin + BEYOND; gy += grid) {
    for (let gx = -X_HALF + 4; gx < X_HALF - grid; gx += grid) {
      const x = gx + tr.range(2, grid - 2);
      const y = gy + tr.range(2, grid - 2);
      // Copses and clearings rather than an even scatter; mostly small trees, a few big ones.
      const keep = tr.chance(clamp(0.42 + 0.45 * forest(x, y), 0.1, 0.92) * S.trees);
      const r = 3.6 + 6 * tr.next() ** 1.7;
      const g = trunkAt(x, y);
      const pine = tr.chance(S.pines);
      if (!keep || g === null || blocked(x, y, r)) continue;
      if (S.cactus) addCactus(course, P, tr, x, y, g);
      else if (S.palm) addPalm(course, P, tr, x, y, g);
      else addTree(course, P, tr, x, y, g, r, pine);
    }
  }
  if (hole.beyond === 'pines') {
    for (let gy = pin + BEYOND + 6; gy < yMax - 6; gy += 12) {
      for (let gx = -X_HALF + 4; gx < X_HALF - 12; gx += 12) {
        const x = gx + tr.range(1, 11);
        const y = gy + tr.range(1, 11);
        const g = trunkAt(x, y);
        if (tr.chance(0.85) && g !== null && y > beyondEdge(x) + 3) addTree(course, P, tr, x, y, g, tr.range(4, 6.4), true);
      }
    }
  }
  // Woods and lone trees in the countryside: a few blocks each, and they cast no shadow.
  for (let gy = yMin - 351; gy < courseTop + 351; gy += 24) {
    for (let gx = -540; gx < 540; gx += 24) {
      const x = gx + tr.range(2, 22);
      const y = gy + tr.range(2, 22);
      const roll = tr.next();
      const r = tr.range(4.2, 7);
      const pine = tr.next() < Math.min(1, S.pines * 2);
      if (x > -X_HALF - 4 && x < X_HALF + 4 && y > yMin - 4 && y < courseTop + 4) continue;
      const c = landCell(Math.floor((x + 540) / 9) * 9 - 540 + 4.5, Math.floor((y - yMin) / 9) * 9 + yMin + 4.5, 9);
      if (c.kd === POND || c.kd === WATER || c.kd === HEATHER) continue;
      const dense = c.kd === PINES || forest(x, y) > 0.55;
      if (roll > (dense ? 0.8 : 0.07) * Math.min(1.2, S.trees)) continue;
      if (S.cactus && c.kd !== PINES) addCactus(land, P, tr, x, y, c.h);
      else if (S.palm && c.kd !== PINES) addPalm(land, P, tr, x, y, c.h);
      else addFarTree(land, P, tr, x, y, c.h, r, c.kd === PINES || pine);
    }
  }

  // Undergrowth in the rough: bushes, boulders and patches of wild flowers.
  const pr = makeRng(`props|${hole.id}`);
  const blooms = (azaleas ? ['#f2609a', '#f5a3c4', '#ffffff'] : S.blooms || ['#ffffff', '#ffd84a', '#f5a3c4', '#c9a2f2']).map((c) => new THREE.Color(c));
  const bush = azaleas ? [P.leaves[2], blooms[0]] : S.bush ? S.bush.map((c) => new THREE.Color(c)) : [P.leaves[2], P.leaves[1]];
  const bushy = azaleas ? 0.22 : S.bush ? 0.2 : 0.1;
  for (let gy = yMin + 4; gy < pin + BEYOND; gy += 12) {
    for (let gx = -X_HALF + 4; gx < X_HALF - 12; gx += 12) {
      const x = gx + pr.range(1, 11);
      const y = gy + pr.range(1, 11);
      const roll = pr.next();
      const size = pr.next();
      const g = trunkAt(x, y);
      if (g === null || blocked(x, y, -4)) continue;
      const z = -y;
      if (roll < bushy) {
        const a = 1.2 + size * 0.9;
        course.box(x - a, g, z - a, x + a, g + a * 1.1, z + a, bush[0]);
        course.box(x - a * 0.6, g + a * 1.1, z - a * 0.6, x + a * 0.6, g + a * 1.75, z + a * 0.6, bush[1]);
      } else if (roll < bushy + 0.05) {
        const a = 0.9 + size;
        course.box(x - a, g, z - a * 0.8, x + a, g + a * 0.9, z + a * 0.8, P.stone);
        course.box(x + a * 0.5, g, z - a * 0.2, x + a * 1.5, g + a * 0.5, z + a, P.stoneDark);
      } else if (roll < bushy + (azaleas ? 0.3 : 0.18)) {
        const color = blooms[pr.int(0, blooms.length - 1)];
        for (let n = pr.int(4, 8); n > 0; n--) {
          const fx = x + pr.range(-4, 4);
          const fy = y + pr.range(-4, 4);
          const fg = trunkAt(fx, fy);
          if (fg !== null) course.box(fx - 0.3, fg, -fy - 0.3, fx + 0.3, fg + 0.6, -fy + 0.3, color);
        }
      }
    }
  }

  // A plank footbridge over each river, to one side of the line of play.
  for (const r of island ? [] : rivers) {
    const x = r.x0 + fw((r.h.from + r.h.to) / 2) * 0.6;
    band(r, x);
    const from = B.near - 3;
    const to = B.far + 3;
    const deck = r.level + 0.45;
    for (let y = from, q = 0; y < to; y += 1.5, q++) {
      course.box(x - 2.6, deck, -Math.min(to, y + 1.5), x + 2.6, deck + 0.5, -y, q % 2 ? P.wood : P.woodDark, false);
    }
    for (const sx of [-2.6, 2.6]) {
      for (let y = from; y <= to + 0.01; y += (to - from) / Math.max(2, Math.round((to - from) / 4))) {
        course.box(x + sx - 0.3, deck + 0.5, -y - 0.3, x + sx + 0.3, deck + 2.3, -y + 0.3, P.woodDark);
      }
      course.box(x + sx - 0.2, deck + 1.9, -to, x + sx + 0.2, deck + 2.3, -from, P.wood, false);
    }
  }

  // White stakes mark out of bounds behind the tee.
  for (let x = -54; x <= 54; x += 9) {
    const sx = cx(-TEE_BACK) + x;
    const g = groundAt(sx, -TEE_BACK - 1);
    course.box(sx - 0.35, g, TEE_BACK + 1 - 0.35, sx + 0.35, g + 2.6, TEE_BACK + 1 + 0.35, P.stake);
  }
  // Tee markers.
  for (const dx of [-7.5, 7.5]) {
    course.box(teeX + dx - 0.55, teeLevel, -0.55, teeX + dx + 0.55, teeLevel + 1.1, 0.55, P.flag);
  }

  // Water glints, in fixed places so they can twinkle.
  const glints = [];
  for (let k = 0, tries = 0; k < 70 && tries < 4000; tries++) {
    const i = rng.int(0, cols - 1);
    const j = rng.int(0, rows - 1);
    const c = j * cols + i;
    if (Number.isNaN(wet[c])) continue;
    glints.push({ x: xAt(i) + rng.range(-1, 1), z: -yAt(j) + rng.range(-1, 1), y: wet[c] + 0.05, phase: rng.range(0, TAU), speed: rng.range(0.6, 1.4) });
    k++;
  }

  // A few clouds drifting across, high up.
  const clouds = makeMesher();
  const cr = makeRng(`clouds|${hole.id}`);
  const cloudColor = new THREE.Color(mood.cloud);
  for (let n = 0; n < 9; n++) {
    const ox = cr.range(-600, 600);
    const oz = -cr.range(yMin, yMax);
    const oy = cr.range(300, 360);
    const parts = cr.int(3, 6);
    for (let p = 0; p < parts; p++) {
      const w = cr.int(3, 7) * 4;
      const d = cr.int(2, 5) * 4;
      const px = ox + cr.int(-3, 3) * 4;
      const pz = oz + cr.int(-2, 2) * 4;
      const py = oy + (p % 2) * 3;
      clouds.box(px, py, pz, px + w, py + 3 + (p % 2) * 2, pz + d, cloudColor, false);
    }
  }

  return {
    pin,
    pinX,
    teeX,
    greenLevel,
    teeLevel,
    cx,
    fw,
    yMin,
    yMax,
    cols,
    rows,
    xAt,
    yAt,
    top,
    wet,
    kind,
    groundAt,
    glints,
    course: course.geometries(),
    land: land.geometries(),
    water: water.empty ? null : water.geometry(),
    clouds: clouds.geometry(),
  };
}

/** A tree of chunky voxels: a round crown, or a stack of layers for a pine. */
function addTree(m, P, rng, x, y, g, r, pine) {
  const T = TREE_VOXEL;
  const cells = new Map();
  const key = (a, b, c) => ((a + 64) * 128 + b + 64) * 128 + c + 64;
  const put = (a, b, c, color) => cells.set(key(a, b, c), { a, b, c, color });
  if (pine) {
    const levels = rng.int(4, 6);
    const reach = rng.range(1.4, 2.1);
    put(0, 0, 0, P.trunk);
    for (let L = 0; L < levels; L++) {
      const rr = Math.max(0, (1 - L / levels) * reach);
      const span = Math.ceil(rr);
      for (let a = -span; a <= span; a++) {
        for (let c = -span; c <= span; c++) {
          if (a * a + c * c <= rr * rr + 0.4) put(a, L + 1, c, L % 2 ? P.pine : P.pineDark);
        }
      }
    }
    put(0, levels + 1, 0, P.pine);
  } else {
    const R = (r * 0.8) / T;
    const trunk = rng.int(2, 3) + (r > 7.4 ? 1 : 0);
    for (let b = 0; b < trunk; b++) put(0, b, 0, P.trunk);
    const cy = trunk + R * 0.7;
    const span = Math.ceil(R);
    for (let a = -span; a <= span; a++) {
      for (let b = -span; b <= span; b++) {
        for (let c = -span; c <= span; c++) {
          const d = (a * a + c * c) / (R * R) + (b * b) / (R * R * 0.7);
          if (d > 1 + rng.range(-0.25, 0.15)) continue;
          const shade = b > R * 0.3 ? 0 : b < -R * 0.2 ? 2 : 1;
          const pick = rng.chance(0.18) ? Math.min(2, shade + 1) : shade;
          put(a, Math.round(cy + b), c, P.leaves[pick]);
        }
      }
    }
  }
  const has = (a, b, c) => cells.has(key(a, b, c));
  const z = -y;
  for (const { a, b, c, color } of cells.values()) {
    const x0 = x + a * T - T / 2;
    const y0 = g + b * T;
    const z0 = z + c * T - T / 2;
    const x1 = x0 + T;
    const y1 = y0 + T;
    const z1 = z0 + T;
    if (!has(a + 1, b, c)) m.face('px', x0, y0, z0, x1, y1, z1, color);
    if (!has(a - 1, b, c)) m.face('nx', x0, y0, z0, x1, y1, z1, color);
    if (!has(a, b + 1, c)) m.face('py', x0, y0, z0, x1, y1, z1, color);
    if (!has(a, b - 1, c) && b > 0) m.face('ny', x0, y0, z0, x1, y1, z1, color);
    if (!has(a, b, c + 1)) m.face('pz', x0, y0, z0, x1, y1, z1, color);
    if (!has(a, b, c - 1)) m.face('nz', x0, y0, z0, x1, y1, z1, color);
  }
}

/** A palm: a bare trunk with fronds drooping from the top. */
function addPalm(m, P, rng, x, y, g) {
  const z = -y;
  const tall = rng.range(7, 11);
  m.box(x - 0.5, g, z - 0.5, x + 0.5, g + tall, z + 0.5, P.trunk);
  const top = g + tall;
  m.box(x - 1, top - 0.4, z - 1, x + 1, top + 0.6, z + 1, P.leaves[1], false);
  for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const reach = rng.range(2.6, 3.8);
    const w = 0.7;
    const ax = dx ? [x + dx * 1, x + dx * (1 + reach)] : [x - w, x + w];
    const az = dz ? [z + dz * 1, z + dz * (1 + reach)] : [z - w, z + w];
    m.box(Math.min(...ax), top, Math.min(...az), Math.max(...ax), top + 0.5, Math.max(...az), P.leaves[0], false);
    const bx = dx ? [x + dx * (1 + reach), x + dx * (2.2 + reach)] : [x - w, x + w];
    const bz = dz ? [z + dz * (1 + reach), z + dz * (2.2 + reach)] : [z - w, z + w];
    m.box(Math.min(...bx), top - 0.9, Math.min(...bz), Math.max(...bx), top + 0.1, Math.max(...bz), P.leaves[2], false);
  }
}

/** A saguaro: a tall column with an arm or two. */
function addCactus(m, P, rng, x, y, g) {
  const z = -y;
  const tall = rng.range(5, 9);
  m.box(x - 0.7, g, z - 0.7, x + 0.7, g + tall, z + 0.7, P.cactus);
  for (const side of [-1, 1]) {
    if (!rng.chance(0.7)) continue;
    const at = rng.range(0.3, 0.55) * tall;
    const up = rng.range(1.6, 3.2);
    const x0 = Math.min(x + side * 0.7, x + side * 2.3);
    const x1 = Math.max(x + side * 0.7, x + side * 2.3);
    m.box(x0, g + at, z - 0.5, x1, g + at + 1, z + 0.5, P.cactusDark, false);
    m.box(x + side * 1.8 - 0.5, g + at + 1, z - 0.5, x + side * 1.8 + 0.5, g + at + 1 + up, z + 0.5, P.cactus);
  }
}

/** A distant tree: the same shape as a near one, in three or four blocks. */
function addFarTree(m, P, rng, x, y, g, r, pine) {
  const T = TREE_VOXEL;
  const z = -y;
  const b = (hw, y0, h, c) => m.box(x - hw, g + y0, z - hw, x + hw, g + y0 + h, z + hw, c);
  if (pine) {
    const levels = rng.int(3, 4);
    const reach = Math.round(rng.range(1.4, 2.1));
    b(T / 2, 0, T, P.trunk);
    for (let L = 0; L < levels; L++) {
      const hw = Math.max(0.5, reach - (L * reach) / levels) * T + T / 2;
      b(hw, T + L * T * 1.5, T * 1.5, L % 2 ? P.pine : P.pineDark);
    }
    b(T / 2, T + levels * T * 1.5, T, P.pine);
  } else {
    const R = Math.max(1, Math.round((r * 0.8) / T));
    const trunk = rng.int(2, 3) * T;
    b(T / 2, 0, trunk, P.trunk);
    b(R * T - T / 2, trunk, T, P.leaves[2]);
    b(R * T + T / 2, trunk + T, T * 2, P.leaves[1]);
    b(R * T - T / 2, trunk + T * 3, T, P.leaves[0]);
  }
}

// The golfer's colours: a cream cap, a mustard jumper, navy trousers.
const KIT = {
  cap: '#f3ecd6', brim: '#2a6f63', skin: '#e0a679', hair: '#5b3920', eye: '#1b1714',
  jumper: '#e9b23a', jumperDark: '#c38d22', trousers: '#2c3b58', belt: '#1d2333', shoes: '#f3ecd6', soles: '#3a2a1d',
  grip: '#1c1c1c', shaft: '#c7ccd3', head: '#4a5058',
};

/**
 * A blocky golfer at address. In its own frame +x runs down the target line,
 * +z points at the ball (which sits 3.3 yards away) and +y is up. `pivot`
 * turns about z to swing the arms and club.
 */
function makeGolfer(material) {
  const C = Object.fromEntries(Object.entries(KIT).map(([k, v]) => [k, new THREE.Color(v)]));
  const mesh = (m) => new THREE.Mesh(m.geometry(), material);
  const root = new THREE.Group();

  // Legs and shoes, feet apart along the target line.
  const legs = makeMesher();
  for (const x of [-0.5, 0.5]) {
    legs.box(x - 0.36, 0, -0.42, x + 0.36, 0.22, 0.62, C.soles, false);
    legs.box(x - 0.36, 0.22, -0.42, x + 0.36, 0.5, 0.62, C.shoes);
    legs.box(x - 0.34, 0.5, -0.34, x + 0.34, 3.15, 0.34, C.trousers);
  }
  root.add(mesh(legs));

  // Body, head and cap, bent forward over the ball from the hips.
  const body = makeMesher();
  body.box(-0.86, -0.1, -0.46, 0.86, 0.2, 0.46, C.belt);
  body.box(-0.86, 0.2, -0.46, 0.86, 1.95, 0.46, C.jumper);
  body.box(-0.86, 1.95, -0.46, 0.86, 2.2, 0.46, C.jumperDark);
  body.box(-0.5, 2.2, -0.45, 0.5, 3.25, 0.5, C.skin);
  body.box(-0.52, 2.55, -0.5, 0.52, 3.25, -0.12, C.hair);
  body.box(-0.53, 2.82, 0.2, -0.47, 2.98, 0.34, C.eye);
  body.box(0.47, 2.82, 0.2, 0.53, 2.98, 0.34, C.eye);
  body.box(-0.56, 3.2, -0.53, 0.56, 3.62, 0.53, C.cap);
  body.box(-0.5, 3.2, 0.53, 0.5, 3.34, 1.12, C.brim);
  const bodyMesh = mesh(body);
  bodyMesh.position.set(0, 3.15, 0);
  bodyMesh.rotation.x = 0.36;
  root.add(bodyMesh);

  // Arms and club in one line from the shoulders down to the clubhead.
  const arms = makeMesher();
  arms.box(-0.42, -1.85, -0.3, 0.42, 0.25, 0.3, C.jumper, false);
  arms.box(-0.34, -2.3, -0.28, 0.34, -1.85, 0.28, C.skin, false);
  arms.box(-0.13, -2.62, -0.13, 0.13, -2.3, 0.13, C.grip, false);
  arms.box(-0.08, -4.66, -0.08, 0.08, -2.62, 0.08, C.shaft, false);
  arms.box(-0.24, -4.96, -0.22, 0.52, -4.66, 0.22, C.head, false);
  const armsMesh = mesh(arms);
  const pivot = new THREE.Group();
  pivot.position.set(0, 4.9, 0.68);
  armsMesh.rotation.x = -Math.atan2(1.62, 4.7);
  pivot.add(armsMesh);
  root.add(pivot);

  // A soft dark patch underfoot stands in for a cast shadow.
  const patch = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 2.6),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.26, depthWrite: false }),
  );
  patch.rotation.x = -Math.PI / 2;
  patch.position.set(0, 0.07, 0.2);
  root.add(patch);
  root.visible = false;
  return { root, pivot };
}

/** A sky dome painted in flat bands. */
function makeSky(mood) {
  const [zenith, middle, horizon] = mood.sky.map((c) => new THREE.Color(c));
  const material = new THREE.ShaderMaterial({
    uniforms: { zenith: { value: zenith }, middle: { value: middle }, horizon: { value: horizon } },
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vDir = world.xyz - cameraPosition;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: `
      uniform vec3 zenith;
      uniform vec3 middle;
      uniform vec3 horizon;
      varying vec3 vDir;
      void main() {
        float t = clamp(normalize(vDir).y, 0.0, 1.0);
        t = floor(t * 16.0) / 16.0;
        vec3 c = t < 0.22 ? mix(horizon, middle, t / 0.22) : mix(middle, zenith, (t - 0.22) / 0.78);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1400, 24, 12), material);
  mesh.renderOrder = -1;
  mesh.frustumCulled = false;
  return mesh;
}

// ---- the renderer -------------------------------------------------------------

/**
 * @param canvas   the canvas to draw on; its parent must be positioned
 * @param options  { markers: show the ball and pin tags and the landing zones' labels }
 */
export function createRenderer(canvas, { markers = true } = {}) {
  let gl;
  try {
    gl = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'default' });
  } catch {
    return createFlatRenderer(canvas);
  }
  canvas.classList.add('is-3d');
  gl.setPixelRatio(1);
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.BasicShadowMap;

  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.8, 2600);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.6;
  // Only the ground and trees cast shadows, and they never move, so the shadow
  // map is redrawn only when the shadow box moves or the hole changes.
  sun.shadow.autoUpdate = false;
  const shadowAt = { x: NaN, z: NaN, span: 0 };
  scene.add(hemi, sun, sun.target);

  const world = new THREE.Group();
  scene.add(world);

  const solid = new THREE.MeshLambertMaterial({ vertexColors: true });
  const waterMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.82 });
  const cloudMat = new THREE.MeshLambertMaterial({ vertexColors: true, fog: false, emissive: 0x555555 });
  const zoneMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });

  // Ball, its shadow, the flag and the cup.
  const ballMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x666666, transparent: true });
  const ballMesh = new THREE.Mesh(new THREE.BoxGeometry(BALL, BALL, BALL), ballMat);
  const blobMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32, depthWrite: false });
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(BALL * 1.1, BALL * 1.1), blobMat);
  blob.rotation.x = -Math.PI / 2;
  const flag = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.45, 9.5, 0.45), new THREE.MeshLambertMaterial({ color: PALETTE.pole }));
  pole.position.y = 4.75;
  pole.castShadow = true;
  flag.add(pole);
  const flagMat = new THREE.MeshLambertMaterial({ color: PALETTE.flag, emissive: 0x401008 });
  const flagBits = [];
  for (let a = 0; a < 4; a++) {
    for (let b = 0; b < 3; b++) {
      const bit = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 0.45), flagMat);
      bit.userData = { a, b };
      flagBits.push(bit);
      flag.add(bit);
    }
  }
  const cup = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.6), new THREE.MeshBasicMaterial({ color: PALETTE.cup }));
  flag.add(cup);
  const golfer = makeGolfer(solid);
  scene.add(ballMesh, blob, flag, golfer.root);

  // Pooled little cubes for the flight trail and for splashes.
  const MAX_TRAIL = 90;
  const trailMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }), MAX_TRAIL);
  trailMesh.frustumCulled = false;
  trailMesh.count = 0;
  const MAX_BITS = 220;
  const bitsMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.85, 0.85, 0.85), new THREE.MeshBasicMaterial({ color: 0xffffff }), MAX_BITS);
  bitsMesh.frustumCulled = false;
  bitsMesh.count = 0;
  bitsMesh.setColorAt(0, new THREE.Color());
  const glintMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1.3, 0.06, 0.45), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, fog: true }), 80);
  glintMesh.frustumCulled = false;
  glintMesh.count = 0;
  scene.add(trailMesh, bitsMesh, glintMesh);

  // HTML tags that ride on the scene: ball, pin and landing zones.
  const host = canvas.parentElement;
  const tags = document.createElement('div');
  tags.className = 'map-tags';
  tags.setAttribute('aria-hidden', 'true');
  host.appendChild(tags);
  const ballTag = document.createElement('span');
  ballTag.className = 'map-tag map-ball';
  const pinTag = document.createElement('span');
  pinTag.className = 'map-tag map-pin';
  pinTag.textContent = 'Pin';
  if (markers) tags.append(ballTag, pinTag);
  const zoneTags = [];

  let sky = null;
  let hole = null;
  let W = 1;
  let H = 1;
  let pixel = 3;
  let insets = { top: 0, right: 0, bottom: 0, left: 0 };
  let w = null; // the built world
  let zoneMesh = null;
  let zones = null; // { pos, dir, list }
  let mode = 'overview';
  let fly = { t0: 0, dur: 1 };
  let flight = null;
  let wiggle = 0;

  const ball = { x: 0, y: 0, h: null, alpha: 1, size: 1, show: false, flying: false };
  const trail = [];
  const bits = [];
  const tweens = [];
  const cam = { pos: new THREE.Vector3(0, 80, 80), look: new THREE.Vector3() };
  const goal = { pos: new THREE.Vector3(0, 80, 80), look: new THREE.Vector3() };
  let lag = 450; // ms the camera takes to settle
  let reach = 1; // how much farther back the camera stands when the lens is capped
  let aimPos = null;
  const lastDir = new THREE.Vector3(0, 0, -1);
  let raf = 0;
  let last = performance.now();
  let dead = false;
  const tmpM = new THREE.Matrix4();
  const tmpV = new THREE.Vector3();
  const tmpQ = new THREE.Quaternion();
  const tmpS = new THREE.Vector3();
  const tmpC = new THREE.Color();

  // ---- framing ----------------------------------------------------------------

  const ground = (x, y) => (w ? w.groundAt(x, y) : 0);
  const point = (x, y, lift = 0) => new THREE.Vector3(x, ground(x, y) + lift, -y);

  /** A drone shot from behind `from`, looking down the line at `to`. */
  function frame(from, to, back, up, sway = 0, along = null) {
    const d = new THREE.Vector3(to.x - from.x, 0, to.z - from.z);
    const r = d.length();
    if (along) d.copy(along);
    else if (r < 0.5) d.copy(lastDir);
    else d.divideScalar(r);
    lastDir.copy(d);
    const pos = from.clone().addScaledVector(d, -back * reach);
    pos.y = Math.max(from.y, to.y) + up * reach;
    if (sway) pos.add(new THREE.Vector3(-d.z, 0, d.x).multiplyScalar(sway));
    if (w) pos.y = Math.max(pos.y, w.groundAt(pos.x, -pos.z) + 8);
    // Aim halfway between the two, so both sit in the shot.
    const flat = Math.hypot(pos.x - from.x, pos.z - from.z);
    const flatTo = Math.hypot(pos.x - to.x, pos.z - to.z);
    const pitch = (Math.atan2(pos.y - from.y, flat) + Math.atan2(pos.y - to.y, flatTo)) / 2;
    const look = pos.clone().add(new THREE.Vector3(d.x * Math.cos(pitch), -Math.sin(pitch), d.z * Math.cos(pitch)).multiplyScalar(60));
    return { pos, look };
  }

  function overviewGoal(now) {
    const L = hole.length;
    const sway = reduced ? 0 : Math.sin(now / 5200) * L * 0.08;
    return frame(point(w.teeX, 0), point(w.pinX, hole.length), 40 + L * 0.42, 30 + L * 0.34, sway);
  }

  /** Straight down the hole, from the tee towards the pin. */
  function holeDir() {
    return new THREE.Vector3(w.pinX - w.teeX, 0, -hole.length).normalize();
  }

  /**
   * The intro: start close on the flag, then pull back along the hole to the
   * tee, rising as it goes, and finish exactly on the overview shot.
   */
  function flyGoal(now) {
    const L = hole.length;
    const t = clamp((now - fly.t0) / fly.dur, 0, 1);
    const e = t * t * (3 - 2 * t);
    const y = L * (1 - e);
    const anchor = point(w.cx(y), y);
    const back = 22 + (40 + L * 0.42 - 22) * e;
    const up = 16 + (30 + L * 0.34 - 16) * e;
    const sway = e * Math.sin(now / 5200) * L * 0.08;
    return { goal: frame(anchor, point(w.pinX, L), back, up, sway, holeDir()), done: t >= 1 };
  }

  /** Which way the golfer faces down the line: at the pin, or down the hole. */
  function lineAt(pos) {
    const from = point(w.cx(pos), pos);
    const to = point(w.pinX, hole.length);
    const d = new THREE.Vector3(to.x - from.x, 0, to.z - from.z);
    if (d.length() < 0.5) d.copy(holeDir());
    return { from, to, d: d.normalize(), side: new THREE.Vector3(-d.z, 0, d.x) };
  }

  /** Low behind the ball, just over the golfer's shoulder, looking down the line. */
  function aimGoal(pos) {
    const { from, d, side } = lineAt(pos);
    lastDir.copy(d);
    const back = 13 * reach;
    const up = 7.8 * reach;
    const p = from.clone().addScaledVector(d, -back).addScaledVector(side, -1.4);
    p.y = Math.max(from.y + up, ground(p.x, -p.z) + 3);
    // The ball sits low in the clear part of the screen; the hole runs away up it.
    const pitch = Math.atan2(p.y - from.y, back) * 0.56;
    const look = p.clone().add(new THREE.Vector3(d.x * Math.cos(pitch), -Math.sin(pitch), d.z * Math.cos(pitch)).multiplyScalar(60));
    return { pos: p, look };
  }

  /** Stand the golfer at the ball, facing it, side-on to the line. */
  function placeGolfer(pos) {
    const { from, d, side } = lineAt(pos);
    const at = from.clone().addScaledVector(side, -3.3);
    at.y = ground(at.x, -at.z);
    golfer.root.position.copy(at);
    golfer.root.quaternion.setFromRotationMatrix(tmpM.makeBasis(d, new THREE.Vector3(0, 1, 0), side));
    golfer.pivot.rotation.z = 0;
  }

  function setGoal(g, settle) {
    goal.pos.copy(g.pos);
    goal.look.copy(g.look);
    lag = settle;
    if (reduced) {
      cam.pos.copy(goal.pos);
      cam.look.copy(goal.look);
    }
  }

  // ---- building -----------------------------------------------------------------

  function clearWorld() {
    for (const child of world.children.slice()) {
      world.remove(child);
      child.geometry?.dispose();
    }
    if (zoneMesh) {
      scene.remove(zoneMesh);
      zoneMesh.geometry.dispose();
      zoneMesh = null;
    }
  }

  function applyMood(mood) {
    if (sky) {
      scene.remove(sky);
      sky.geometry.dispose();
      sky.material.dispose();
    }
    sky = makeSky(mood);
    scene.add(sky);
    const horizon = new THREE.Color(mood.sky[2]);
    scene.fog = new THREE.Fog(horizon, mood.fog[0], mood.fog[1]);
    gl.setClearColor(horizon);
    hemi.color.set(mood.fill.sky);
    hemi.groundColor.set(mood.fill.ground);
    hemi.intensity = mood.fill.power;
    sun.color.set(mood.sun.color);
    sun.intensity = mood.sun.power;
    waterMat.color.set(mood.water);
    const el = (mood.sun.height * Math.PI) / 180;
    const az = (mood.sun.bearing * Math.PI) / 180;
    sun.userData.dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  }

  function build(next) {
    clearWorld();
    const mood = moodFor(seedOfHole(next));
    applyMood(mood);
    waterMat.color.set(settingOf(next).water || mood.water);
    w = buildWorld(next, mood);
    shadowAt.span = 0; // redraw the shadows for the new ground
    for (const g of w.course) {
      const tile = new THREE.Mesh(g, solid);
      tile.name = 'course';
      tile.castShadow = true;
      tile.receiveShadow = true;
      world.add(tile);
    }
    for (const g of w.land) {
      const tile = new THREE.Mesh(g, solid);
      tile.name = 'land';
      tile.receiveShadow = true;
      world.add(tile);
    }
    if (w.water) {
      const water = new THREE.Mesh(w.water, waterMat);
      water.receiveShadow = true;
      world.add(water);
    }
    const clouds = new THREE.Mesh(w.clouds, cloudMat);
    clouds.userData.drift = true;
    world.add(clouds);
    flag.position.set(w.pinX, w.greenLevel, -next.length);
    cup.position.set(0, 0.03, 0);
    glintMesh.count = w.glints.length;
  }

  /** Paint the landing zones onto the ground, one band per club in play. */
  function buildZones() {
    if (zoneMesh) {
      scene.remove(zoneMesh);
      zoneMesh.geometry.dispose();
      zoneMesh = null;
    }
    for (const t of zoneTags) t.el.remove();
    zoneTags.length = 0;
    if (!zones || !w) return;
    const { pos, dir, list } = zones;
    const verts = [];
    const cols4 = [];
    const idx = [];
    let n = 0;
    const lo = -TEE_BACK - 4;
    const hi = hole.length + BEYOND + 2;
    for (const z of list) {
      const a = pos + dir * (z.lo - 0.5);
      const b = pos + dir * (z.hi + 0.5);
      const yLo = Math.max(lo, Math.min(a, b));
      const yHi = Math.min(hi, Math.max(a, b));
      if (yHi - yLo < 1) continue;
      const color = new THREE.Color(TIER_COLORS[z.tiers.at(-1) - 1]);
      const jLo = Math.floor((yLo - w.yMin) / CELL);
      const jHi = Math.floor((yHi - w.yMin) / CELL);
      for (let j = Math.max(0, jLo); j <= Math.min(w.rows - 1, jHi); j++) {
        const y = w.yAt(j);
        if (y < yLo || y > yHi) continue;
        const edgeRow = j === jLo || j === jHi;
        const c = w.cx(clamp(y, 0, hole.length));
        const half = w.fw(y) + 6;
        for (let i = 0; i < w.cols; i++) {
          const x = w.xAt(i);
          const lane = Math.abs(x - c);
          if (lane > half) continue;
          const k = j * w.cols + i;
          const h = (Number.isNaN(w.wet[k]) ? w.top[k] : w.wet[k]) + 0.08;
          const rail = lane > half - 3;
          let alpha = z.reach ? 0.34 : 0.15;
          if (rail) alpha = z.reach ? 0.9 : 0.6;
          else if (edgeRow) alpha = z.reach ? 0.6 : 0.35;
          const x0 = -X_HALF + i * CELL;
          const ya = w.yMin + j * CELL;
          verts.push(x0, h, -ya, x0 + CELL, h, -ya, x0 + CELL, h, -(ya + CELL), x0, h, -(ya + CELL));
          for (let q = 0; q < 4; q++) cols4.push(color.r, color.g, color.b, alpha);
          idx.push(n, n + 1, n + 2, n, n + 2, n + 3);
          n += 4;
        }
      }
      if (markers) {
        const ym = clamp((yLo + yHi) / 2, Math.max(yLo, -TEE_BACK), Math.min(yHi, hole.length + BEYOND));
        const el = document.createElement('span');
        el.className = `map-tag map-zone${z.reach ? ' is-reach' : ''}`;
        el.style.setProperty('--tier', TIER_COLORS[z.tiers.at(-1) - 1]);
        el.textContent = z.tiers.map((t) => CLUBS[t - 1].short).join(' / ') + (z.reach ? ' ✓' : '');
        tags.appendChild(el);
        const xm = w.cx(clamp(ym, 0, hole.length)) + w.fw(ym) + 6;
        zoneTags.push({ el, at: new THREE.Vector3(xm, ground(xm, ym) + 1.5, -ym), reach: z.reach });
      }
    }
    if (!n) return;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols4, 4));
    g.setIndex(n > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
    zoneMesh = new THREE.Mesh(g, zoneMat);
    zoneMesh.renderOrder = 2;
    scene.add(zoneMesh);
  }

  // ---- effects ------------------------------------------------------------------

  function burst(x, y, h, colors, count, power) {
    for (let i = 0; i < count && bits.length < MAX_BITS; i++) {
      const a = Math.random() * TAU;
      const s = power * (0.35 + Math.random() * 0.65);
      bits.push({
        p: new THREE.Vector3(x, h + 0.5, -y),
        v: new THREE.Vector3(Math.cos(a) * s * 0.55, power * (0.7 + Math.random() * 0.8), Math.sin(a) * s * 0.55),
        life: 0,
        ttl: 700 + Math.random() * 600,
        color: new THREE.Color(colors[i % colors.length]),
      });
    }
  }

  /** Run `step(t)` with t from 0 to 1. Always finishes, even in a hidden tab. */
  function tween(dur, step) {
    return new Promise((resolve) => {
      const tw = { t0: performance.now(), dur: Math.max(1, dur), step, done: false };
      tw.finish = () => {
        if (tw.done) return;
        tw.done = true;
        clearTimeout(tw.timer);
        const i = tweens.indexOf(tw);
        if (i >= 0) tweens.splice(i, 1);
        step(1);
        resolve();
      };
      tw.timer = setTimeout(tw.finish, tw.dur + 150);
      tweens.push(tw);
    });
  }

  // ---- per frame ------------------------------------------------------------------

  function placeBall() {
    const show = ball.show && ball.alpha > 0.01 && ball.size > 0.01 && w;
    ballMesh.visible = !!show;
    blob.visible = !!show && ball.alpha > 0.5;
    if (!show) return;
    const g = ground(ball.x, ball.y);
    const h = ball.h ?? g + BALL / 2;
    ballMesh.position.set(ball.x, h - (1 - ball.size) * BALL * 0.6, -ball.y);
    ballMesh.scale.setScalar(ball.size);
    ballMat.opacity = ball.alpha;
    const height = Math.max(0, h - g - BALL / 2);
    blob.position.set(ball.x, g + 0.06, -ball.y);
    blob.scale.setScalar(Math.max(0.4, 1 - height / 40));
    blobMat.opacity = 0.32 * Math.max(0.3, 1 - height / 30);
  }

  function updateInstances(now, dt) {
    // Trail: cubes left behind in flight, shrinking away.
    if (ball.flying && ball.show && (!trail.length || now - trail.at(-1).t > 34)) {
      trail.push({ t: now, p: ballMesh.position.clone() });
      if (trail.length > MAX_TRAIL) trail.shift();
    }
    while (trail.length && now - trail[0].t > 1300) trail.shift();
    trail.forEach((s, i) => {
      const k = 1 - (now - s.t) / 1300;
      tmpS.setScalar(Math.max(0.05, k));
      tmpM.compose(s.p, tmpQ.identity(), tmpS);
      trailMesh.setMatrixAt(i, tmpM);
    });
    trailMesh.count = trail.length;
    trailMesh.instanceMatrix.needsUpdate = true;

    // Splashes, sand and sparkles.
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.life += dt;
      if (b.life > b.ttl) {
        bits.splice(i, 1);
        continue;
      }
      b.v.y -= 60 * (dt / 1000);
      b.p.addScaledVector(b.v, dt / 1000);
      const floor = ground(b.p.x, -b.p.z) + 0.4;
      if (b.p.y < floor) {
        b.p.y = floor;
        b.v.multiplyScalar(0.4);
        b.v.y = Math.abs(b.v.y) * 0.3;
      }
    }
    bits.forEach((b, i) => {
      tmpS.setScalar(Math.max(0.1, 1 - b.life / b.ttl));
      tmpM.compose(b.p, tmpQ.identity(), tmpS);
      bitsMesh.setMatrixAt(i, tmpM);
      bitsMesh.setColorAt(i, b.color);
    });
    bitsMesh.count = bits.length;
    bitsMesh.instanceMatrix.needsUpdate = true;
    if (bitsMesh.instanceColor) bitsMesh.instanceColor.needsUpdate = true;

    // Water glints blink in and out.
    if (w) {
      w.glints.forEach((g, i) => {
        const on = Math.sin(now / 700 * g.speed + g.phase) > 0.55 ? 1 : 0.001;
        tmpS.set(on, 1, on);
        tmpV.set(g.x, g.y, g.z);
        tmpM.compose(tmpV, tmpQ.identity(), tmpS);
        glintMesh.setMatrixAt(i, tmpM);
      });
      glintMesh.instanceMatrix.needsUpdate = true;
    }
  }

  function placeTags() {
    if (!markers || !w) return;
    const put = (el, at, show) => {
      if (!show) {
        el.hidden = true;
        return null;
      }
      tmpV.copy(at).project(camera);
      if (tmpV.z > 1 || tmpV.z < -1) {
        el.hidden = true;
        return null;
      }
      const x = ((tmpV.x + 1) / 2) * W;
      const y = ((1 - tmpV.y) / 2) * H;
      if (x < -40 || x > W + 40 || y < -20 || y > H + 20) {
        el.hidden = true;
        return null;
      }
      el.hidden = false;
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -100%)`;
      return { x, y };
    };
    const yards = mode === 'aim' && aimPos !== null ? `${Math.round(Math.abs(hole.length - aimPos))}y` : '';
    if (ballTag.textContent !== yards) {
      ballTag.textContent = yards;
      ballTag.classList.toggle('has-yards', !!yards);
    }
    put(ballTag, new THREE.Vector3(ballMesh.position.x, ballMesh.position.y + BALL * (yards ? 2.2 : 1.6), ballMesh.position.z), ballMesh.visible && ball.alpha > 0.5);
    const far = cam.pos.distanceTo(flag.position) > 110;
    const placed = [];
    const pinAt = put(pinTag, new THREE.Vector3(flag.position.x, flag.position.y + 11, flag.position.z), far && mode !== 'overview' && mode !== 'flyover');
    if (pinAt) placed.push(pinAt);
    for (const t of zoneTags) {
      const at = put(t.el, t.at, true);
      if (!at) continue;
      if (placed.some((p) => Math.abs(p.y - at.y) < 22 && Math.abs(p.x - at.x) < 110)) t.el.hidden = true;
      else placed.push(at);
    }
  }

  function frameStep(now) {
    if (dead) return;
    raf = requestAnimationFrame(frameStep);
    // While nothing moves but the flag, about 30 frames a second is plenty.
    const still = (mode === 'aim' || mode === 'overview') && !tweens.length && !bits.length && !trail.length && cam.pos.distanceToSquared(goal.pos) < 0.09;
    if (still && now - last < 30) return;
    const dt = clamp(now - last, 0, 64);
    last = now;

    for (const tw of tweens.slice()) {
      const t = (now - tw.t0) / tw.dur;
      if (t >= 1) tw.finish();
      else tw.step(t);
    }
    if (!w) return;

    if (mode === 'flyover') {
      const f = flyGoal(now);
      setGoal(f.goal, 140);
      if (f.done) {
        mode = 'overview';
        lag = 700;
      }
    } else if (mode === 'overview') setGoal(overviewGoal(now), lag);
    else if (mode === 'flight' && flight) {
      const at = new THREE.Vector3(ball.x, ground(ball.x, ball.y), -ball.y);
      const to = point(flight.x, flight.y);
      const g = frame(at, to, 26 + flight.carry * 0.09, 17 + flight.carry * 0.075 + Math.max(0, (ball.h ?? 0) - at.y) * 0.45);
      setGoal(g, 260);
    }
    const k = reduced ? 1 : 1 - Math.exp(-dt / lag);
    cam.pos.lerp(goal.pos, k);
    cam.look.lerp(goal.look, k);
    camera.position.copy(cam.pos);
    camera.lookAt(cam.look);
    sky.position.copy(cam.pos);

    // The sun's shadow box follows what the camera is looking at, in steps a
    // fifth of its size, and the shadows are redrawn only when it steps.
    const span = mode === 'overview' || mode === 'flyover' ? Math.max(170, hole.length * 0.62) : 150;
    const stepSize = span / 5;
    const fx = Math.round(cam.look.x / stepSize) * stepSize;
    const fz = Math.round(cam.look.z / stepSize) * stepSize;
    if (fx !== shadowAt.x || fz !== shadowAt.z || span !== shadowAt.span) {
      Object.assign(shadowAt, { x: fx, z: fz, span });
      const sc = sun.shadow.camera;
      sc.left = -span * 1.2;
      sc.right = span * 1.2;
      sc.top = span * 1.2;
      sc.bottom = -span * 1.2;
      sc.near = 1;
      sc.far = 1400;
      sc.updateProjectionMatrix();
      const fy = ground(fx, -fz);
      sun.target.position.set(fx, fy, fz);
      sun.position.set(fx, fy, fz).addScaledVector(sun.userData.dir, 500);
      sun.shadow.needsUpdate = true;
    }

    // Flag flutters; harder for a moment after a ball drops.
    if (wiggle > 0) wiggle = Math.max(0, wiggle - dt / 1100);
    const flap = reduced ? 0 : 0.35 + wiggle * 1.2;
    for (const bit of flagBits) {
      const { a, b } = bit.userData;
      bit.position.set(0.75 + a * 1.05, 6.6 + b * 1.05 + 0.3, Math.sin(now / 160 - a * 0.9) * flap * (a / 3));
    }
    for (const child of world.children) {
      if (child.userData.drift && !reduced) child.position.x = Math.sin(now / 45000) * 70;
    }

    golfer.root.visible = markers && (mode === 'aim' || mode === 'flight');
    placeBall();
    updateInstances(now, dt);
    gl.render(scene, camera);
    placeTags();
  }

  // ---- sizing ------------------------------------------------------------------------

  function project() {
    const l = insets.left;
    const r = insets.right;
    const t = insets.top;
    const b = insets.bottom;
    // Leave a little air between the picture and the panels.
    const cw = Math.max(W * 0.45, W - l - r - W * 0.04);
    const ch = Math.max(H * 0.35, H - t - b - H * 0.06);
    const ccx = clamp(l + (W - l - r) / 2, W * 0.3, W * 0.7);
    const ccy = clamp(t + (H - t - b) / 2, H * 0.3, H * 0.7);
    // The clear part of the canvas gets about 50 degrees of view, more when it is narrow.
    let half = (25 * Math.PI) / 180;
    const aspect = cw / ch;
    const wantSide = Math.tan((27 * Math.PI) / 180);
    if (Math.tan(half) * aspect < wantSide) half = Math.atan(wantSide / aspect);
    half = Math.min(half, (40 * Math.PI) / 180);
    // Past about 64 degrees the picture bends; stand farther back instead.
    const wantFull = Math.atan(Math.tan(half) * (H / ch));
    const capFull = (32 * Math.PI) / 180;
    const full = Math.min(wantFull, capFull);
    reach = Math.tan(wantFull) / Math.tan(full);
    camera.fov = (2 * full * 180) / Math.PI;
    camera.aspect = W / H;
    const iw = Math.max(1, Math.round(W / pixel));
    const ih = Math.max(1, Math.round(H / pixel));
    camera.setViewOffset(iw, ih, -((ccx - W / 2) / pixel), -((ccy - H / 2) / pixel), iw, ih);
    camera.updateProjectionMatrix();
    if (mode === 'aim' && aimPos !== null && w) setGoal(aimGoal(aimPos), lag);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    pixel = 2;
    gl.setSize(Math.max(1, Math.round(W / pixel)), Math.max(1, Math.round(H / pixel)), false);
    project();
  }

  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  observer?.observe(canvas);
  resize();
  raf = requestAnimationFrame(frameStep);

  return {
    /** Show a new hole from the air, ball on the tee. */
    setHole(next) {
      hole = next;
      build(next);
      zones = null;
      buildZones();
      flight = null;
      trail.length = 0;
      bits.length = 0;
      Object.assign(ball, { x: w.teeX, y: 0, h: null, alpha: 1, size: 1, show: true, flying: false });
      let g;
      if (reduced) {
        mode = 'overview';
        g = overviewGoal(performance.now());
      } else {
        // Hold on the flag for a beat, then pull back to the tee.
        mode = 'flyover';
        fly = { t0: performance.now() + 500, dur: clamp(3600 + next.length * 5, 4200, 6400) };
        g = flyGoal(fly.t0).goal;
      }
      setGoal(g, 140);
      cam.look.copy(g.look);
      cam.pos.copy(g.pos);
    },

    /** Frame the next shot. `list` comes from zonesFor(); null on the green. */
    aim(pos, list) {
      mode = 'aim';
      aimPos = pos;
      flight = null;
      Object.assign(ball, { x: w.cx(pos), y: pos, h: null, alpha: 1, size: 1, show: true, flying: false });
      zones = list ? { pos, dir: pos <= hole.length ? 1 : -1, list } : null;
      buildZones();
      placeGolfer(pos);
      setGoal(aimGoal(pos), 520);
    },

    /** Take the landing zones off the ground. */
    clearZones() {
      zones = null;
      buildZones();
    },

    /** Leave the ball and let the drone drift over the whole hole. */
    overview() {
      mode = 'overview';
      lag = 900;
    },

    /** Tell the camera which edges of the canvas are covered by the interface. */
    setInsets(next) {
      insets = { top: 0, right: 0, bottom: 0, left: 0, ...next };
      project();
    },

    /** Fly (or roll) the ball for a resolved shot. Resolves when it is over. */
    async play(out) {
      const pin = hole.length;
      const from = out.from;
      const x0 = w.cx(from);
      const x1 = out.kind === 'holed' ? w.pinX : w.cx(out.landed);
      zones = null;
      buildZones();
      if (!reduced && mode === 'aim') {
        // Back, down through the ball, and let the follow-through finish on its own.
        const top = out.putt ? -0.42 : -2.35;
        const arm = golfer.pivot.rotation;
        await tween(out.putt ? 360 : 520, (t) => {
          arm.z = top * (1 - (1 - t) ** 2);
        });
        await tween(out.putt ? 170 : 150, (t) => {
          arm.z = top * (1 - t * t);
        });
        if (dead) return;
        tween(out.putt ? 320 : 420, (t) => {
          arm.z = (out.putt ? 0.45 : 2.5) * (1 - (1 - t) ** 3);
        });
      }
      mode = 'flight';
      flight = { x: x1, y: out.landed, carry: out.carry };
      Object.assign(ball, { x: x0, y: from, h: null, alpha: 1, size: 1, show: true, flying: !out.putt });
      const g0 = ground(x0, from) + BALL / 2;
      const g1 = (out.kind === 'holed' ? w.greenLevel : ground(x1, out.landed)) + BALL / 2;
      const dur = reduced ? 220 : out.putt ? 520 + out.carry * 22 : 1000 + out.carry * 4.6;
      const apex = Math.min(52, 7 + out.carry * 0.17);
      await tween(dur, (t) => {
        const e = out.putt ? 1 - (1 - t) ** 2.2 : t;
        ball.y = from + (out.landed - from) * e;
        ball.x = x0 + (x1 - x0) * e;
        ball.h = out.putt || reduced ? null : g0 + (g1 - g0) * e + 4 * apex * t * (1 - t);
      });
      if (dead) return;
      ball.flying = false;
      ball.h = null;
      const landH = ground(ball.x, ball.y);

      if (out.kind === 'holed') {
        wiggle = 1;
        burst(w.pinX, pin, w.greenLevel, ['#ffd84a', '#ffffff', '#ffb12e'], 46, 26);
        await tween(reduced ? 60 : 380, (t) => {
          ball.size = 1 - t;
        });
        ball.show = false;
      } else if (out.penalty) {
        const wet = out.kind === 'water' || (out.kind === 'beyond' && hole.beyond === 'pond');
        if (wet) burst(ball.x, ball.y, landH, ['#ffffff', '#cdeefc', '#8fd0f0'], 40, 24);
        else if (out.kind === 'beyond') burst(ball.x, ball.y, landH, hole.beyond === 'pines' ? ['#2f6c4a', '#245a3d', '#6d462a'] : ['#9d6aaa', '#7b5191', '#5c983c'], 26, 16);
        await tween(reduced ? 60 : 560, (t) => {
          ball.alpha = 1 - t;
          if (wet) ball.size = 1 - t * 0.6;
        });
        if (dead) return;
        ball.y = out.to;
        ball.x = w.cx(out.to);
        ball.size = 1;
        trail.length = 0;
        await tween(reduced ? 60 : 320, (t) => {
          ball.alpha = t;
        });
      } else {
        if (out.kind === 'sand') burst(ball.x, ball.y, landH, ['#f0dca2', '#d9c185', '#fff1c6'], 30, 18);
        else if (!out.putt) burst(ball.x, ball.y, landH, ['#a9df6c', '#74b14a', '#ffffff'], 10, 9);
        if (!out.putt && !reduced && out.kind !== 'sand') {
          await tween(240, (t) => {
            ball.h = landH + BALL / 2 + Math.sin(Math.PI * t) * 1.8;
          });
          ball.h = null;
        }
      }
      await tween(reduced ? 40 : 260, () => {});
    },

    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      for (const tw of tweens.slice()) tw.finish();
      clearWorld();
      tags.remove();
      gl.dispose();
    },
  };
}
