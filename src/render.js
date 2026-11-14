// Draws a hole as a page from a yardage book, and animates the ball.
// The world is measured in yards: y runs from the tee (0) to the pin and
// beyond, x is sideways. The camera scales that uniformly onto the canvas,
// upright on tall canvases and lying on its side on wide ones.

import { centerX } from './course.js';
import { makeRng } from './rng.js';
import { BEYOND, CLUBS, GREEN_RADIUS } from './rules.js';

/** One colour per rarity tier, shared with the stylesheet. */
export const TIER_COLORS = ['#66752f', '#1f7a6f', '#2c62a3', '#74489c', '#b93b27'];

const INK = '#22362b';
const C = {
  rough: '#a9c08c', roughDark: '#9cb580', roughLight: '#b6cb9b',
  fairway: '#c9dca1', stripe: '#bfd495', edge: 'rgba(34,54,43,0.3)',
  fringe: '#b5cd8b', green: '#dbeab3',
  tee: '#bdd492',
  sand: '#eee1b6', sandEdge: '#c9b47e', sandDot: '#d8c690',
  water: '#a0cedb', waterEdge: '#6fa9bc', ripple: 'rgba(255,255,255,0.6)',
  tree: '#5f8c5d', treeDark: '#47714e', treeLight: '#7daa70', shadow: 'rgba(28,48,34,0.2)',
  pine: '#41705a', pineDark: '#2f5646', pineLight: '#5c8f72', pineGround: '#8eac83',
  heather: '#c2a9c0', heatherDark: '#a486a8', heatherGreen: '#9fb88a',
  flag: '#c2412c', paper: '#f8f2e1',
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const TAU = Math.PI * 2;

/** Everything about a hole that never changes while it is played. */
function buildScene(hole) {
  const rng = makeRng(`decor|${hole.id}`);
  const pin = hole.length;
  const cx = (y) => centerX(hole, y);
  const wob = rng.range(0, TAU);
  const fw = (y) => hole.halfWidth * (1 + 0.1 * Math.sin(y / 41 + wob));

  // Fairway: a ribbon with rounded ends, from just past the tee to the green.
  const y0 = 24;
  const y1 = pin - 6;
  const left = [];
  const right = [];
  for (let y = y0; y <= y1 + 0.01; y += 3) {
    const t = clamp(Math.min((y - y0) / 20, (y1 - y) / 18), 0, 1);
    const w = fw(y) * Math.sqrt(1 - (1 - t) * (1 - t));
    left.push([cx(y) - w, y]);
    right.push([cx(y) + w, y]);
  }
  const fairway = left.concat(right.reverse());

  // Bunkers span the fairway between their two yardages.
  const bunkers = hole.hazards.filter((h) => h.type === 'sand').map((h) => {
    const mid = (h.from + h.to) / 2;
    const ry = (h.to - h.from) / 2;
    const rx = fw(mid) + 7;
    const lobes = rng.int(5, 7);
    const phase = rng.range(0, TAU);
    const pts = [];
    for (let i = 0; i < 56; i++) {
      const a = (i / 56) * TAU;
      const c = Math.cos(a);
      const s = Math.sin(a);
      const f = 1 + 0.1 * Math.sin(lobes * a + phase) * Math.abs(c);
      pts.push([cx(mid) + rx * Math.sign(c) * Math.abs(c) ** 0.7 * f, mid + ry * Math.sign(s) * Math.abs(s) ** 0.7 * f]);
    }
    const dots = [];
    for (let i = 0; i < 14; i++) {
      const a = rng.range(0, TAU);
      const d = Math.sqrt(rng.next()) * 0.62;
      dots.push([cx(mid) + Math.cos(a) * rx * d, mid + Math.sin(a) * ry * d]);
    }
    return { pts, dots };
  });

  // Water runs right across the hole. The banks wander, but not on the line of play.
  const waters = hole.hazards.filter((h) => h.type === 'water').map((h) => {
    const x0 = cx((h.from + h.to) / 2);
    const p1 = rng.range(0, TAU);
    const p2 = rng.range(0, TAU);
    const l1 = rng.range(34, 52);
    const l2 = rng.range(34, 52);
    const far = [];
    const near = [];
    for (let x = -660; x <= 660; x += 12) {
      far.push([x0 + x, h.to + 3 * (Math.sin(x / l1 + p1) - Math.sin(p1))]);
      near.push([x0 + x, h.from + 3 * (Math.sin(x / l2 + p2) - Math.sin(p2))]);
    }
    const ripples = [];
    for (let i = 0; i < 26; i++) {
      ripples.push([x0 + rng.range(-420, 420), rng.range(h.from + 5, h.to - 5), rng.range(3, 7)]);
    }
    return { pts: far.concat(near.slice().reverse()), far, near, ripples };
  });

  // Whatever lies more than 40 yards past the pin.
  const bx = cx(pin + BEYOND);
  const bp = rng.range(0, TAU);
  const bl = rng.range(30, 46);
  const beyondEdge = [];
  for (let x = -660; x <= 660; x += 12) {
    beyondEdge.push([bx + x, pin + BEYOND + 0.5 + 3 * (Math.sin(x / bl + bp) - Math.sin(bp))]);
  }
  const beyond = beyondEdge.concat([[bx + 660, pin + 1400], [bx - 660, pin + 1400]]);
  const beyondMarks = [];
  for (let i = 0; i < 260; i++) {
    beyondMarks.push([bx + rng.range(-420, 420), pin + BEYOND + rng.range(8, 330), rng.range(2, 6), rng.next()]);
  }

  // Trees keep clear of the line of play and of the water.
  const blocked = (x, y, r) => {
    if (y > -24 && y < pin + BEYOND + 2 && Math.abs(x - cx(y)) < Math.max(fw(y) + 9, 30) + r) return true;
    for (const h of hole.hazards) {
      if (h.type === 'water' && y > h.from - 7 - r && y < h.to + 7 + r) return true;
    }
    return y > pin + BEYOND - 4 - r;
  };
  const trees = [];
  const cell = 21;
  for (let gy = -90; gy < pin + BEYOND; gy += cell) {
    for (let gx = -360; gx < 360; gx += cell) {
      const keep = rng.chance(0.5);
      const x = gx + rng.range(2, cell - 2);
      const y = gy + rng.range(2, cell - 2);
      const r = rng.range(4.2, 7.6);
      if (keep && !blocked(x, y, r)) trees.push({ x, y, r, pine: false });
    }
  }
  if (hole.beyond === 'pines') {
    for (let gy = pin + BEYOND + 6; gy < pin + BEYOND + 340; gy += 14) {
      for (let gx = -360; gx < 360; gx += 14) {
        const keep = rng.chance(0.86);
        const x = bx + gx + rng.range(1, 13);
        const y = gy + rng.range(1, 13);
        if (keep) trees.push({ x, y, r: rng.range(4, 6.4), pine: true });
      }
    }
  }

  // Mottling in the rough.
  const dabs = [];
  for (let i = 0; i < 300; i++) {
    dabs.push([rng.range(-360, 360), rng.range(-90, pin + BEYOND + 20), rng.range(3, 9), rng.chance(0.5)]);
  }

  return { pin, pinX: cx(pin), teeX: cx(0), fw, fairway, bunkers, waters, beyond, beyondEdge, beyondMarks, trees, dabs };
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 1;
  let H = 1;
  let vertical = true;
  let hole = null;
  let scene = null;
  let scale = 1; // pixels per yard
  let mid = 0;

  const cam = { lo: -30, hi: 200, cx: 0 };
  const goal = { lo: -30, hi: 200, cx: 0 };
  let want = { lo: -30, hi: 200 };
  const ball = { x: 0, y: 0, lift: 0, alpha: 1, size: 1, show: false };
  let zones = null; // { pos, dir, list }
  let trail = null; // { x, y, alpha }
  let wiggle = 0;
  const effects = [];
  const tweens = [];

  let raf = 0;
  let last = 0;
  let dirty = true;
  let dead = false;

  // ---- camera -------------------------------------------------------------

  const px = (x, y) => (vertical ? W / 2 + (x - cam.cx) * scale : W / 2 + (y - mid) * scale);
  const py = (x, y) => (vertical ? H / 2 - (y - mid) * scale : H / 2 + (x - cam.cx) * scale);

  function fit(ys) {
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const pad = Math.max(12, (hi - lo) * 0.08);
    return { lo: lo - pad, hi: hi + pad };
  }

  /** Turn the wanted window into a camera target that suits the canvas. */
  function applyGoal() {
    if (!hole) return;
    const long = vertical ? H : W;
    const short = vertical ? W : H;
    // Never zoom in so far that the fairway no longer fits across the canvas.
    const minSpan = Math.max(104, (long * 76) / short);
    let { lo, hi } = want;
    if (hi - lo < minSpan) {
      const m = (lo + hi) / 2;
      lo = m - minSpan / 2;
      hi = m + minSpan / 2;
    }
    goal.lo = lo;
    goal.hi = hi;
    const a = clamp(lo, -10, hole.length + BEYOND);
    const b = clamp(hi, -10, hole.length + BEYOND);
    goal.cx = (centerX(hole, a) + centerX(hole, (a + b) / 2) + centerX(hole, b)) / 3;
    dirty = true;
  }

  function look(win, snap = false) {
    want = win;
    applyGoal();
    if (snap || reduced) Object.assign(cam, goal);
  }

  function aimWindow(pos) {
    const pin = hole.length;
    if (Math.abs(pin - pos) <= GREEN_RADIUS) return fit([pin - 34, pin + 46]);
    return pos <= pin ? fit([pos - 6, pin + 46]) : fit([pin - 30, pos + 10]);
  }

  // ---- animation ----------------------------------------------------------

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
        dirty = true;
        resolve();
      };
      tw.timer = setTimeout(tw.finish, tw.dur + 150);
      tweens.push(tw);
    });
  }

  function ring(x, y, color, r1, dur = 700, delay = 0) {
    effects.push({ x, y, color, r1, dur, t0: performance.now() + delay });
  }

  function frame(now) {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(64, now - last);
    last = now;

    let moving = false;
    const k = 1 - Math.exp(-dt / 230);
    for (const key of ['lo', 'hi', 'cx']) {
      const diff = goal[key] - cam[key];
      if (Math.abs(diff) > 0.04) {
        cam[key] += diff * k;
        moving = true;
      } else {
        cam[key] = goal[key];
      }
    }
    for (const tw of tweens.slice()) {
      const t = (now - tw.t0) / tw.dur;
      if (t >= 1) tw.finish();
      else tw.step(t);
    }
    if (wiggle > 0) wiggle = Math.max(0, wiggle - dt / 900);
    if (moving || tweens.length || effects.length || wiggle > 0 || dirty) {
      dirty = false;
      draw(now);
    }
  }

  // ---- drawing ------------------------------------------------------------

  function poly(points) {
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      if (i) ctx.lineTo(px(x, y), py(x, y));
      else ctx.moveTo(px(x, y), py(x, y));
    }
    ctx.closePath();
  }

  function line(points) {
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      if (i) ctx.lineTo(px(x, y), py(x, y));
      else ctx.moveTo(px(x, y), py(x, y));
    }
  }

  function disc(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.1, r), 0, TAU);
  }

  function tag(text, x, y, { align = 'center', bold = false, color = INK } = {}) {
    ctx.font = `${bold ? 700 : 600} 11px ui-sans-serif, system-ui, "Segoe UI", sans-serif`;
    const w = ctx.measureText(text).width + 10;
    const left = align === 'right' ? x - w : align === 'left' ? x : x - w / 2;
    ctx.fillStyle = 'rgba(248,242,225,0.92)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(left, y - 8, w, 16, 8);
    else ctx.rect(left, y - 8, w, 16);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, left + 5, y + 0.5);
    return w;
  }

  function draw(now) {
    scale = (vertical ? H : W) / (cam.hi - cam.lo);
    mid = (cam.lo + cam.hi) / 2;
    const s = scale;

    ctx.fillStyle = C.rough;
    ctx.fillRect(0, 0, W, H);
    if (!scene) return;
    const { pin, pinX } = scene;

    // Rough.
    for (const [x, y, r, light] of scene.dabs) {
      const sx = px(x, y);
      const sy = py(x, y);
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
      ctx.fillStyle = light ? C.roughLight : C.roughDark;
      ctx.beginPath();
      ctx.ellipse(sx, sy, r * s, r * s * 0.6, 0, 0, TAU);
      ctx.fill();
    }

    // Behind the green.
    const kind = hole.beyond;
    ctx.fillStyle = kind === 'pond' ? C.water : kind === 'pines' ? C.pineGround : C.heather;
    poly(scene.beyond);
    ctx.fill();
    for (const [x, y, r, v] of scene.beyondMarks) {
      const sx = px(x, y);
      const sy = py(x, y);
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
      if (kind === 'pond') {
        ctx.strokeStyle = C.ripple;
        ctx.lineWidth = Math.max(1, 0.5 * s);
        ctx.beginPath();
        ctx.moveTo(sx - r * s, sy);
        ctx.lineTo(sx + r * s, sy);
        ctx.stroke();
      } else if (kind === 'heather') {
        ctx.fillStyle = v < 0.7 ? C.heatherDark : C.heatherGreen;
        disc(sx, sy, r * 0.55 * s);
        ctx.fill();
      }
    }
    ctx.strokeStyle = kind === 'pond' ? C.waterEdge : C.edge;
    ctx.lineWidth = 1.5;
    line(scene.beyondEdge);
    ctx.stroke();

    // Fairway, mown in stripes.
    ctx.fillStyle = C.fairway;
    poly(scene.fairway);
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = C.stripe;
    const band = 16;
    for (let n = Math.floor(cam.lo / band) - 1; n * band < cam.hi + band; n++) {
      if (((n % 2) + 2) % 2 === 0) continue;
      const y = n * band;
      const a = centerX(hole, y);
      const b = centerX(hole, y + band);
      poly([[a - 80, y], [a + 80, y], [b + 80, y + band], [b - 80, y + band]]);
      ctx.fill();
    }
    ctx.restore();
    ctx.strokeStyle = C.edge;
    ctx.lineWidth = 1;
    poly(scene.fairway);
    ctx.stroke();

    // Water cuts right across the hole, fairway and all.
    for (const w of scene.waters) {
      ctx.fillStyle = C.water;
      poly(w.pts);
      ctx.fill();
      ctx.strokeStyle = C.waterEdge;
      ctx.lineWidth = 1.5;
      line(w.far);
      ctx.stroke();
      line(w.near);
      ctx.stroke();
      ctx.strokeStyle = C.ripple;
      ctx.lineWidth = Math.max(1, 0.5 * s);
      for (const [x, y, r] of w.ripples) {
        ctx.beginPath();
        ctx.moveTo(px(x - r, y), py(x - r, y));
        ctx.lineTo(px(x + r, y), py(x + r, y));
        ctx.stroke();
      }
    }

    // Sand.
    for (const b of scene.bunkers) {
      ctx.fillStyle = C.sand;
      poly(b.pts);
      ctx.fill();
      ctx.strokeStyle = C.sandEdge;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = C.sandDot;
      for (const [x, y] of b.dots) {
        disc(px(x, y), py(x, y), Math.max(0.8, 0.45 * s));
        ctx.fill();
      }
    }

    // Green.
    const gx = px(pinX, pin);
    const gy = py(pinX, pin);
    ctx.fillStyle = C.fringe;
    disc(gx, gy, (GREEN_RADIUS + 3.5) * s);
    ctx.fill();
    ctx.fillStyle = C.green;
    disc(gx, gy, GREEN_RADIUS * s);
    ctx.fill();
    ctx.strokeStyle = C.edge;
    ctx.lineWidth = 1;
    ctx.stroke();
    const reach = zones?.list.find((z) => z.reach);
    if (reach) {
      ctx.strokeStyle = TIER_COLORS[reach.tiers.at(-1) - 1];
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      disc(gx, gy, (GREEN_RADIUS + 1.6) * s);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Tee.
    ctx.fillStyle = C.tee;
    poly([[scene.teeX - 6, -4.5], [scene.teeX + 6, -4.5], [scene.teeX + 6, 4.5], [scene.teeX - 6, 4.5]]);
    ctx.fill();
    ctx.strokeStyle = C.edge;
    ctx.stroke();
    ctx.fillStyle = C.paper;
    for (const dx of [-4, 4]) {
      disc(px(scene.teeX + dx, 0), py(scene.teeX + dx, 0), Math.max(1.2, 0.7 * s));
      ctx.fill();
    }

    // Trees.
    for (const t of scene.trees) {
      const sx = px(t.x, t.y);
      const sy = py(t.x, t.y);
      const r = t.r * s;
      if (sx < -r - 4 || sx > W + r + 4 || sy < -r - 4 || sy > H + r + 4) continue;
      ctx.fillStyle = C.shadow;
      disc(sx + r * 0.22, sy + r * 0.26, r);
      ctx.fill();
      ctx.fillStyle = t.pine ? C.pineDark : C.treeDark;
      disc(sx, sy, r);
      ctx.fill();
      ctx.fillStyle = t.pine ? C.pine : C.tree;
      disc(sx - r * 0.16, sy - r * 0.16, r * 0.74);
      ctx.fill();
      ctx.fillStyle = t.pine ? C.pineLight : C.treeLight;
      disc(sx - r * 0.3, sy - r * 0.3, r * 0.34);
      ctx.fill();
    }

    // Yardage markers: distance to the pin, every 50 yards.
    const every = 50 * s >= 46 ? 50 : 100;
    for (let d = every; pin - d > 14; d += every) {
      const y = pin - d;
      const x = centerX(hole, y) - Math.max(scene.fw(y), 12) - 4;
      const sx = px(x, y);
      const sy = py(x, y);
      if (sx < 24 || sx > W - 24 || sy < 30 || sy > H - 24) continue;
      ctx.fillStyle = C.paper;
      disc(sx, sy, 3);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1;
      ctx.stroke();
      if (vertical) tag(String(d), sx - 7, sy, { align: 'right' });
      else tag(String(d), sx, sy - 14);
    }

    if (zones) drawZones();

    // Flag.
    const fl = clamp(9 * s, 20, 46);
    const sway = Math.sin(now / 90) * 3 * wiggle;
    ctx.fillStyle = INK;
    disc(gx, gy, clamp(0.9 * s, 1.8, 4));
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy - fl);
    ctx.stroke();
    ctx.fillStyle = C.flag;
    ctx.beginPath();
    ctx.moveTo(gx, gy - fl);
    ctx.lineTo(gx + fl * 0.56, gy - fl * 0.8 + sway);
    ctx.lineTo(gx, gy - fl * 0.6);
    ctx.closePath();
    ctx.fill();

    // Flight line.
    if (trail && ball.show) {
      ctx.strokeStyle = `rgba(248,242,225,${0.85 * trail.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(px(trail.x, trail.y), py(trail.x, trail.y));
      ctx.lineTo(px(ball.x, ball.y), py(ball.x, ball.y));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Splashes and the like.
    for (let i = effects.length - 1; i >= 0; i--) {
      const e = effects[i];
      const t = (now - e.t0) / e.dur;
      if (t >= 1) {
        effects.splice(i, 1);
        continue;
      }
      if (t < 0) continue;
      ctx.strokeStyle = e.color;
      ctx.globalAlpha = 1 - t;
      ctx.lineWidth = 2;
      disc(px(e.x, e.y), py(e.x, e.y), 3 + e.r1 * (1 - (1 - t) * (1 - t)));
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Ball.
    if (ball.show && ball.alpha > 0.01 && ball.size > 0.01) {
      const bxp = px(ball.x, ball.y);
      const byp = py(ball.x, ball.y);
      const base = clamp(1.25 * s, 3.4, 6.5) * ball.size;
      ctx.globalAlpha = ball.alpha;
      ctx.fillStyle = 'rgba(20,36,26,0.3)';
      ctx.beginPath();
      ctx.ellipse(bxp + 1.5, byp + 2, base * (1 - 0.25 * ball.lift), base * 0.7 * (1 - 0.25 * ball.lift), 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      disc(bxp, byp - ball.lift * 34, base * (1 + 0.5 * ball.lift));
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  /** Coloured landing zones along the edge of the map, one per club in play. */
  function drawZones() {
    const { pos, dir, list } = zones;
    const along = (y) => (vertical ? py(0, y) : px(0, y));
    const limit = vertical ? H : W;
    for (const z of list) {
      const a = along(pos + dir * (z.lo - 0.5));
      const b = along(pos + dir * (z.hi + 0.5));
      const from = clamp(Math.min(a, b), 0, limit);
      const to = clamp(Math.max(a, b), 0, limit);
      if (to - from < 2) continue;
      const colors = z.tiers.map((t) => TIER_COLORS[t - 1]);
      const thick = z.reach ? 9 : 6;

      // Faint lines across the map at each end of the zone.
      ctx.strokeStyle = colors.at(-1);
      ctx.globalAlpha = z.reach ? 0.5 : 0.22;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      for (const edge of [a, b]) {
        if (edge < 1 || edge > limit - 1) continue;
        ctx.beginPath();
        if (vertical) {
          ctx.moveTo(0, edge);
          ctx.lineTo(W, edge);
        } else {
          ctx.moveTo(edge, 0);
          ctx.lineTo(edge, H);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // The bar itself, split when two tiers share a club.
      colors.forEach((color, i) => {
        ctx.fillStyle = color;
        const part = thick / colors.length;
        if (vertical) ctx.fillRect(W - 5 - thick + part * i, from + 1, part, to - from - 2);
        else ctx.fillRect(from + 1, H - 5 - thick + part * i, to - from - 2, part);
      });

      const text = z.tiers.map((t) => CLUBS[t - 1].short).join(' / ') + (z.reach ? ' ✓' : '');
      ctx.font = `${z.reach ? 700 : 600} 11px ui-sans-serif, system-ui, "Segoe UI", sans-serif`;
      const need = vertical ? 18 : ctx.measureText(text).width + 8;
      if (to - from < need) continue;
      const m = (from + to) / 2;
      if (vertical) tag(text, W - 10 - thick, clamp(m, 12, H - 12), { align: 'right', bold: z.reach, color: colors.at(-1) });
      else tag(text, m, H - 16 - thick, { bold: z.reach, color: colors.at(-1) });
    }
  }

  // ---- public -------------------------------------------------------------

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const was = vertical;
    vertical = H >= W * 0.95;
    applyGoal();
    if (was !== vertical) Object.assign(cam, goal);
    // Resizing wipes a canvas, so repaint now rather than a frame later.
    dirty = false;
    draw(performance.now());
  }

  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  observer?.observe(canvas);
  resize();
  last = performance.now();
  raf = requestAnimationFrame(frame);

  return {
    /** Show a new hole from above, ball on the tee. */
    setHole(next) {
      hole = next;
      scene = buildScene(next);
      zones = null;
      trail = null;
      effects.length = 0;
      Object.assign(ball, { x: scene.teeX, y: 0, lift: 0, alpha: 1, size: 1, show: true });
      look(fit([-16, next.length + 46]), true);
      dirty = false;
      draw(performance.now());
    },

    /** Frame the next shot. `list` comes from zonesFor(); null on the green. */
    aim(pos, list) {
      Object.assign(ball, { x: centerX(hole, pos), y: pos, lift: 0, alpha: 1, size: 1, show: true });
      zones = list ? { pos, dir: pos <= hole.length ? 1 : -1, list } : null;
      look(aimWindow(pos));
    },

    /** Take the landing zones off the map. */
    clearZones() {
      zones = null;
      dirty = true;
    },

    /** Fly (or roll) the ball for a resolved shot. Resolves when it is over. */
    async play(out) {
      const pin = hole.length;
      const from = out.from;
      const x0 = centerX(hole, from);
      const x1 = out.kind === 'holed' ? scene.pinX : centerX(hole, out.landed);
      zones = null;
      look(fit([from, out.landed, pin, from <= pin ? pin + 20 : pin - 20]));
      Object.assign(ball, { x: x0, y: from, lift: 0, alpha: 1, size: 1, show: true });
      trail = out.putt ? null : { x: x0, y: from, alpha: 1 };

      const dur = reduced ? 220 : out.putt ? 520 + out.carry * 22 : 760 + out.carry * 3.4;
      const arc = Math.min(1, 0.35 + out.carry / 180);
      await tween(dur, (t) => {
        const e = out.putt ? 1 - (1 - t) ** 2.2 : t;
        ball.y = from + (out.landed - from) * e;
        ball.x = x0 + (x1 - x0) * e;
        ball.lift = out.putt || reduced ? 0 : Math.sin(Math.PI * t) * arc;
      });
      if (dead) return;
      ball.lift = 0;

      if (out.kind === 'holed') {
        wiggle = 1;
        ring(scene.pinX, pin, '#f5d36b', 26, 800);
        ring(scene.pinX, pin, '#ffffff', 40, 900, 120);
        await tween(reduced ? 60 : 380, (t) => {
          ball.size = 1 - t;
        });
        ball.show = false;
      } else if (out.penalty) {
        const wet = out.kind === 'water' || (out.kind === 'beyond' && hole.beyond === 'pond');
        ring(ball.x, ball.y, wet ? '#ffffff' : INK, 22, 700);
        ring(ball.x, ball.y, wet ? '#ffffff' : INK, 34, 800, 140);
        await tween(reduced ? 60 : 560, (t) => {
          ball.alpha = 1 - t;
        });
        if (dead) return;
        ball.y = out.to;
        ball.x = centerX(hole, out.to);
        trail = null;
        look(aimWindow(out.to));
        await tween(reduced ? 60 : 320, (t) => {
          ball.alpha = t;
        });
      } else if (out.kind === 'sand') {
        ring(ball.x, ball.y, C.sandEdge, 16, 600);
      }

      if (trail) {
        const fading = trail;
        tween(reduced ? 60 : 420, (t) => {
          fading.alpha = 1 - t;
        }).then(() => {
          if (trail === fading) trail = null;
        });
      }
      await tween(reduced ? 40 : 260, () => {});
    },

    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      for (const tw of tweens.slice()) tw.finish();
    },
  };
}
