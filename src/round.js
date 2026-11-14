// A round of Fairllion as plain data plus the functions that advance it.
// Nothing here touches the DOM, so the same code runs in the tests.

import { generateCourse } from './course.js';
import { hashString, makeRng } from './rng.js';
import { MAX_OVER_PAR, resolveShot } from './rules.js';

/**
 * Deal the prompts. Each hole gets as many as it could ever need (one per
 * stroke up to the cap), so every player meets the same prompt on the same
 * shot of the same hole.
 */
export function planPrompts(seed, course, bank) {
  const need = course.holes.reduce((n, h) => n + h.par + MAX_OVER_PAR, 0);
  if (bank.length < need) throw new Error(`The prompt bank needs at least ${need} prompts; it has ${bank.length}.`);
  const ids = makeRng(`${seed}|prompts`).shuffle(bank.map((p) => p.id));
  let i = 0;
  return course.holes.map((h) => {
    const n = h.par + MAX_OVER_PAR;
    const slice = ids.slice(i, i + n);
    i += n;
    return slice;
  });
}

export function createRound(seed, bank) {
  const course = generateCourse(seed);
  return {
    seed,
    course,
    plan: planPrompts(seed, course, bank),
    hole: 0, // index of the hole being played
    pos: 0, // yards from the tee
    lie: 'tee',
    strokes: 0, // strokes taken on this hole, penalties included
    shot: 0, // prompts used on this hole
    holeOver: false,
    done: false,
    cards: course.holes.map(() => ({ shots: [], score: null, pickedUp: false })),
  };
}

export const currentHole = (round) => round.course.holes[round.hole];

/** Id of the prompt for the next shot, or null between holes. */
export function currentPromptId(round) {
  if (round.done || round.holeOver) return null;
  return round.plan[round.hole][round.shot] ?? null;
}

/** Play an answer ({ name, tier, key } from the card). Returns the outcome. */
export function swing(round, answer) {
  const promptId = currentPromptId(round);
  if (!promptId) throw new Error('No shot to play.');
  const hole = currentHole(round);
  const u = hashString(`${promptId}|${answer.key}`);
  const out = resolveShot(hole, round.pos, round.lie, answer.tier, u);

  round.strokes += 1 + out.penalty;
  round.shot += 1;
  round.pos = out.to;
  if (out.kind !== 'holed') round.lie = out.lie;

  round.cards[round.hole].shots.push({
    prompt: promptId,
    answer: answer.name,
    tier: answer.tier,
    club: out.club,
    kind: out.kind,
    putt: out.putt,
    carry: out.carry,
    leave: out.leave,
    penalty: out.penalty,
  });
  finishIfOver(round, out.kind === 'holed');
  return out;
}

/** The shot clock ran out: a stroke is spent and the prompt is gone. */
export function whiff(round) {
  const promptId = currentPromptId(round);
  if (!promptId) throw new Error('No shot to play.');
  round.strokes += 1;
  round.shot += 1;
  round.cards[round.hole].shots.push({ prompt: promptId, answer: null, tier: 0, club: null, kind: 'timeout', putt: false, carry: 0, leave: Math.abs(currentHole(round).length - round.pos), penalty: 0 });
  finishIfOver(round, false);
}

function finishIfOver(round, holed) {
  const cap = currentHole(round).par + MAX_OVER_PAR;
  const card = round.cards[round.hole];
  if (holed) {
    card.score = Math.min(round.strokes, cap);
    round.holeOver = true;
  } else if (round.strokes >= cap) {
    card.score = cap;
    card.pickedUp = true;
    round.holeOver = true;
  }
}

/** Move on after a finished hole. */
export function nextHole(round) {
  if (!round.holeOver) throw new Error('The hole is still in play.');
  if (round.hole >= round.course.holes.length - 1) {
    round.done = true;
    return;
  }
  round.hole += 1;
  round.pos = 0;
  round.lie = 'tee';
  round.strokes = 0;
  round.shot = 0;
  round.holeOver = false;
}

/** Strokes and par over the holes finished so far. */
export function totals(round) {
  let strokes = 0;
  let par = 0;
  let holes = 0;
  round.cards.forEach((card, i) => {
    if (card.score == null) return;
    strokes += card.score;
    par += round.course.holes[i].par;
    holes += 1;
  });
  return { strokes, par, diff: strokes - par, holes };
}

/**
 * Everything needed to pick the round up again later. The course and the
 * prompt deal are saved too, so a round in progress is not disturbed if a
 * later version of the game generates courses differently.
 */
export function snapshot(round) {
  const { seed, course, plan, hole, pos, lie, strokes, shot, holeOver, done, cards } = round;
  return JSON.parse(JSON.stringify({ seed, course, plan, hole, pos, lie, strokes, shot, holeOver, done, cards }));
}

const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);

function validCourse(course) {
  return Boolean(
    course && typeof course.name === 'string' && isNumber(course.par) &&
    Array.isArray(course.holes) && course.holes.length > 0 &&
    course.holes.every((h) =>
      h && typeof h.id === 'string' && typeof h.name === 'string' && typeof h.beyond === 'string' &&
      Number.isInteger(h.number) && Number.isInteger(h.par) && Number.isInteger(h.length) && h.length > 0 &&
      isNumber(h.halfWidth) && h.shape && ['a1', 'w1', 'p1', 'a2', 'w2', 'p2'].every((k) => isNumber(h.shape[k])) &&
      Array.isArray(h.hazards) &&
      h.hazards.every((z) => z && (z.type === 'sand' || z.type === 'water') && Number.isInteger(z.from) && Number.isInteger(z.to))),
  );
}

function validPlan(plan, course, bank) {
  const ids = new Set(bank.map((p) => p.id));
  return (
    Array.isArray(plan) && plan.length === course.holes.length &&
    plan.every((list, i) =>
      Array.isArray(list) && list.length === course.holes[i].par + MAX_OVER_PAR && list.every((id) => ids.has(id)))
  );
}

/** Rebuild a round from a snapshot; null if the snapshot does not fit. */
export function restore(snap, bank) {
  try {
    if (!snap || typeof snap.seed !== 'string') return null;
    const round = createRound(snap.seed, bank);
    if (validCourse(snap.course) && validPlan(snap.plan, snap.course, bank)) {
      round.course = snap.course;
      round.plan = snap.plan;
    }
    const holes = round.course.holes.length;
    const ok =
      Number.isInteger(snap.hole) && snap.hole >= 0 && snap.hole < holes &&
      Number.isInteger(snap.pos) && Number.isInteger(snap.strokes) && snap.strokes >= 0 &&
      Number.isInteger(snap.shot) && snap.shot >= 0 && snap.shot <= round.plan[snap.hole].length &&
      typeof snap.lie === 'string' && Array.isArray(snap.cards) && snap.cards.length === holes &&
      snap.cards.every((c) => c && Array.isArray(c.shots));
    if (!ok) return null;
    return Object.assign(round, {
      hole: snap.hole,
      pos: snap.pos,
      lie: snap.lie,
      strokes: snap.strokes,
      shot: snap.shot,
      holeOver: Boolean(snap.holeOver),
      done: Boolean(snap.done),
      cards: snap.cards,
    });
  } catch {
    return null;
  }
}
