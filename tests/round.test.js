import assert from 'node:assert/strict';
import { test } from 'node:test';

import { PARS, centerX, describeHazards, generateCourse } from '../src/course.js';
import { EPOCH, cleanCode, dailyNumber, dailySeed, dateKey, daysBetween, msToMidnight, randomCode, shiftKey } from '../src/daily.js';
import { PROMPTS, cardFor } from '../src/prompts.js';
import { makeRng } from '../src/rng.js';
import { createRound, currentHole, currentPromptId, nextHole, restore, snapshot, swing, totals, whiff } from '../src/round.js';
import { GREEN_RADIUS, MAX_OVER_PAR } from '../src/rules.js';
import { holeMark, shareText } from '../src/share.js';
import { computeStats } from '../src/stats.js';

test('a seed always builds the same course, and different seeds differ', () => {
  const a = generateCourse('daily|2026-11-13');
  const b = generateCourse('daily|2026-11-13');
  const c = generateCourse('daily|2026-11-14');
  assert.deepEqual(a, b);
  assert.notDeepEqual(a.holes.map((h) => h.length), c.holes.map((h) => h.length));
});

test('every generated hole is playable', () => {
  for (let i = 0; i < 400; i++) {
    const course = generateCourse(`seed-${i}`);
    assert.equal(course.par, 24);
    assert.equal(course.holes.length, 6);
    assert.ok(course.name.length > 4);
    assert.equal(new Set(course.holes.flatMap((h) => h.name.split(' '))).size, 12, 'no word repeats in the hole names');
    course.holes.forEach((h, n) => {
      assert.equal(h.par, PARS[n]);
      assert.equal(h.number, n + 1);
      const [lo, hi] = { 3: [105, 170], 4: [240, 330], 5: [410, 520] }[h.par];
      assert.ok(h.length >= lo && h.length <= hi, `par ${h.par} of ${h.length} yards`);
      let prev = 0;
      for (const z of h.hazards) {
        assert.ok(['sand', 'water'].includes(z.type));
        assert.ok(Number.isInteger(z.from) && Number.isInteger(z.to) && z.to > z.from);
        assert.ok(z.from >= 60, 'hazards leave the tee clear');
        assert.ok(z.to <= h.length - GREEN_RADIUS - 5, 'hazards leave the green clear');
        assert.ok(z.from > prev, 'hazards do not overlap');
        prev = z.to;
      }
      assert.ok(Number.isFinite(centerX(h, 0)) && Math.abs(centerX(h, h.length)) < 30);
      assert.equal(describeHazards(h).length, h.hazards.length + 1);
    });
  }
});

test('prompts are dealt per hole and never repeat in a round', () => {
  const round = createRound('daily|2026-11-13', PROMPTS);
  const all = round.plan.flat();
  assert.equal(new Set(all).size, all.length);
  round.plan.forEach((ids, i) => assert.equal(ids.length, PARS[i] + MAX_OVER_PAR));
  assert.deepEqual(round.plan, createRound('daily|2026-11-13', PROMPTS).plan);
  assert.throws(() => createRound('x', PROMPTS.slice(0, 10)), /at least/);
});

/** Play a whole round with seeded random answers and the odd timeout. */
function playOut(seed) {
  const rng = makeRng(`player|${seed}`);
  const round = createRound(seed, PROMPTS);
  let guard = 0;
  while (!round.done) {
    assert.ok(guard++ < 500, 'the round ends');
    if (round.holeOver) {
      nextHole(round);
      continue;
    }
    const before = round.strokes;
    const id = currentPromptId(round);
    assert.ok(id, 'there is a prompt for every shot');
    if (rng.chance(0.08)) {
      whiff(round);
    } else {
      const out = swing(round, rng.pick(cardFor(id).answers));
      assert.equal(round.strokes, before + 1 + out.penalty);
    }
    assert.ok(round.strokes > before);
  }
  return round;
}

test('any round can be played to the end with sane scores', () => {
  for (let i = 0; i < 300; i++) {
    const round = playOut(`fuzz-${i}`);
    round.cards.forEach((card, n) => {
      const par = round.course.holes[n].par;
      assert.ok(card.score >= 1 && card.score <= par + MAX_OVER_PAR, `hole ${n + 1} scored ${card.score}`);
      assert.ok(card.shots.length >= 1 && card.shots.length <= par + MAX_OVER_PAR);
      const holed = card.shots.at(-1).kind === 'holed';
      assert.equal(card.pickedUp, !holed);
      if (card.pickedUp) assert.equal(card.score, par + MAX_OVER_PAR);
    });
    const t = totals(round);
    assert.equal(t.holes, 6);
    assert.equal(t.par, 24);
    assert.equal(t.strokes, round.cards.reduce((a, c) => a + c.score, 0));
  }
});

test('the same answers give every player the same round', () => {
  const a = playOut('daily|2026-12-25');
  const b = playOut('daily|2026-12-25');
  assert.deepEqual(a.cards, b.cards);
});

test('a hole is picked up at triple bogey', () => {
  const round = createRound('pickup', PROMPTS);
  const par = currentHole(round).par;
  for (let i = 0; i < par + MAX_OVER_PAR; i++) {
    assert.equal(round.holeOver, false);
    whiff(round);
  }
  assert.equal(round.holeOver, true);
  assert.equal(round.cards[0].score, par + MAX_OVER_PAR);
  assert.equal(round.cards[0].pickedUp, true);
  assert.equal(currentPromptId(round), null);
  assert.throws(() => whiff(round));
  nextHole(round);
  assert.deepEqual([round.hole, round.pos, round.lie, round.strokes, round.shot, round.holeOver], [1, 0, 'tee', 0, 0, false]);
  assert.throws(() => nextHole(round), /still in play/);
});

test('a round survives being saved and restored mid-hole', () => {
  const rng = makeRng('save');
  const round = createRound('daily|2026-11-20', PROMPTS);
  for (let i = 0; i < 7; i++) {
    if (round.holeOver) nextHole(round);
    else swing(round, rng.pick(cardFor(currentPromptId(round)).answers));
  }
  const copy = restore(JSON.parse(JSON.stringify(snapshot(round))), PROMPTS);
  assert.deepEqual(snapshot(copy), snapshot(round));
  assert.equal(currentPromptId(copy), currentPromptId(round));
  assert.equal(restore(null, PROMPTS), null);
  assert.equal(restore({ seed: 'x', hole: 99 }, PROMPTS), null);
  assert.equal(restore({ seed: 5 }, PROMPTS), null);

  // A saved round keeps the course it was played on, whatever the generator does now.
  const kept = JSON.parse(JSON.stringify(snapshot(round)));
  kept.course.name = 'Saved Links';
  kept.course.holes[5].length += 7;
  const again = restore(kept, PROMPTS);
  assert.equal(again.course.name, 'Saved Links');
  assert.equal(again.course.holes[5].length, round.course.holes[5].length + 7);

  // A damaged course or an unknown prompt falls back to a freshly generated one.
  const broken = JSON.parse(JSON.stringify(snapshot(round)));
  broken.course.holes[0].length = 'long';
  assert.equal(restore(broken, PROMPTS).course.holes[0].length, round.course.holes[0].length);
  const stale = JSON.parse(JSON.stringify(snapshot(round)));
  stale.plan[0][0] = 'no-such-prompt';
  assert.deepEqual(restore(stale, PROMPTS).plan, round.plan);
});

test('dates, daily numbers and codes', () => {
  assert.equal(dailyNumber(EPOCH), 1);
  assert.equal(dailyNumber('2026-11-14'), 2);
  assert.equal(dailyNumber('2027-11-13'), 366);
  assert.equal(daysBetween('2026-12-31', '2027-01-01'), 1);
  assert.equal(shiftKey('2026-12-31', 1), '2027-01-01');
  assert.equal(shiftKey('2027-03-01', -1), '2027-02-28');
  assert.equal(dateKey(new Date(2026, 10, 13, 23, 59)), '2026-11-13');
  assert.equal(dailySeed('2026-11-13'), 'daily|2026-11-13');
  assert.equal(msToMidnight(new Date(2026, 10, 13, 23, 0, 0)), 3600000);
  assert.match(randomCode(), /^[A-HJ-NP-Z2-9]{5}$/);
  assert.equal(cleanCode(' ab-12x '), 'AB12X');
  assert.equal(cleanCode('a'), null);
  assert.equal(cleanCode(null), null);
});

test('the shared scorecard uses circles under par and squares over', () => {
  assert.equal(holeMark(1, 3), '★');
  assert.equal(holeMark(2, 4), '◎');
  assert.equal(holeMark(3, 4), '○');
  assert.equal(holeMark(4, 4), '•');
  assert.equal(holeMark(5, 4), '□');
  assert.equal(holeMark(7, 4), '▣');
  const text = shareText({ title: 'Fairllion Daily No. 1', pars: PARS, scores: [3, 2, 5, 3, 5, 4], extra: ['example.test'] });
  assert.equal(text, 'Fairllion Daily No. 1\n22 strokes (−2)\n○ ○ • • □ ○\nexample.test');
});

test('stats count streaks across month ends', () => {
  const day = (scores) => ({ scores, pars: PARS });
  const results = {
    '2026-11-28': day([4, 3, 5, 3, 4, 5]),
    '2026-11-30': day([3, 2, 4, 3, 4, 5]),
    '2026-12-01': day([4, 1, 5, 3, 6, 5]),
    '2026-12-02': day([4, 3, 5, 3, 4, 8]),
  };
  const s = computeStats(results, '2026-12-02');
  assert.equal(s.played, 4);
  assert.equal(s.streak, 3);
  assert.equal(s.bestStreak, 3);
  assert.equal(s.best, -3);
  assert.equal(s.holes.ace, 1);
  assert.equal(s.holes.worse, 2);
  assert.equal(s.recent[0].key, '2026-12-02');
  assert.equal(computeStats(results, '2026-12-03').streak, 3, 'yesterday keeps the streak alive');
  assert.equal(computeStats(results, '2026-12-04').streak, 0);
  const empty = computeStats({}, '2026-12-04');
  assert.deepEqual([empty.played, empty.streak, empty.best, empty.average], [0, 0, null, null]);
});
