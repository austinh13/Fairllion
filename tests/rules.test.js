import assert from 'node:assert/strict';
import { test } from 'node:test';

import { makeRng } from '../src/rng.js';
import {
  BEYOND, CLUBS, GREEN_RADIUS, HOLE_OUT, TEE_BACK,
  clubFor, describeRel, formatRel, lieAt, outlook, resolveShot, scoreName, zonesFor,
} from '../src/rules.js';

const hole = { length: 400, hazards: [{ type: 'sand', from: 120, to: 140 }, { type: 'water', from: 250, to: 275 }] };

/** A hash value that makes a club fly exactly `yards`. */
const carry = (club, yards) => yards - club.carryLo;

test('clubs cover every distance from 1 to 300 with no gaps or overlaps', () => {
  assert.equal(CLUBS[0].lo, 1);
  for (let i = 1; i < CLUBS.length; i++) assert.equal(CLUBS[i].lo, CLUBS[i - 1].hi + 1);
  assert.equal(CLUBS.at(-1).hi, 300);
  for (const c of CLUBS) assert.ok(c.carryLo >= c.lo && c.carryLo <= c.hi);
});

test('lieAt reads the ground', () => {
  assert.equal(lieAt(hole, 60), 'fairway');
  assert.equal(lieAt(hole, 120), 'sand');
  assert.equal(lieAt(hole, 140), 'sand');
  assert.equal(lieAt(hole, 141), 'fairway');
  assert.equal(lieAt(hole, 260), 'water');
  assert.equal(lieAt(hole, 385), 'green');
  assert.equal(lieAt(hole, 415), 'green');
  assert.equal(lieAt(hole, 416), 'rough');
  assert.equal(lieAt(hole, -5), 'rough');
});

test('the right club finds the green', () => {
  const short = { length: 150, hazards: [] };
  const out = resolveShot(short, 0, 'tee', 3, carry(CLUBS[2], 120));
  assert.equal(out.kind, 'green');
  assert.equal(out.inRange, true);
  assert.equal(out.penalty, 0);
  assert.ok(out.leave >= 2 && out.leave <= GREEN_RADIUS);
  assert.equal(out.to, 150 - out.leave, 'a short natural distance finishes short of the pin');
  assert.equal(out.lie, 'green');
});

test('a natural distance within three yards of the pin drops', () => {
  const short = { length: 150, hazards: [] };
  for (const d of [147, 150, 153]) {
    const out = resolveShot(short, 0, 'tee', 3, carry(CLUBS[2], d));
    assert.equal(out.kind, 'holed', `${d} yards`);
    assert.equal(out.to, 150);
    assert.equal(out.leave, 0);
  }
  assert.equal(resolveShot(short, 0, 'tee', 3, carry(CLUBS[2], 146)).kind, 'green');
  assert.equal(HOLE_OUT, 3);
});

test('the wrong club flies its natural distance and takes what it finds', () => {
  const fairway = resolveShot(hole, 0, 'tee', 2, carry(CLUBS[1], 90));
  assert.deepEqual([fairway.kind, fairway.to, fairway.lie, fairway.penalty, fairway.leave], ['fairway', 90, 'fairway', 0, 310]);

  const sand = resolveShot(hole, 0, 'tee', 3, carry(CLUBS[2], 130));
  assert.deepEqual([sand.kind, sand.to, sand.lie, sand.penalty], ['sand', 130, 'sand', 0]);

  const water = resolveShot(hole, 0, 'tee', 5, carry(CLUBS[4], 260));
  assert.deepEqual([water.kind, water.to, water.lie, water.penalty, water.landed], ['water', 0, 'tee', 1, 260]);
});

test('sand costs a club', () => {
  assert.equal(clubFor(3, 'sand').key, 'wedge');
  assert.equal(clubFor(1, 'sand').key, 'chip');
  assert.equal(clubFor(2, 'sand').key, 'chip');
  assert.equal(clubFor(5, 'fairway').key, 'driver');
  const zones = zonesFor(hole, 130, 'sand');
  assert.equal(zones.length, 4);
  assert.deepEqual(zones[0].tiers, [1, 2]);
  assert.equal(zones.at(-1).hi, 230);
  // 130 yards out of sand, a Sharp answer plays as a wedge and comes up short.
  const out = resolveShot({ length: 260, hazards: [{ type: 'sand', from: 120, to: 140 }] }, 130, 'sand', 3, 0);
  assert.equal(out.club, 'wedge');
  assert.equal(out.kind, 'fairway');
});

test('flying the green by more than 40 yards is a penalty', () => {
  const short = { length: 120, hazards: [] };
  const out = resolveShot(short, 0, 'tee', 5, carry(CLUBS[4], 240));
  assert.deepEqual([out.kind, out.penalty, out.to, out.lie], ['beyond', 1, 0, 'tee']);

  // 171 yards is 51 past a 120-yard pin: gone. 160 is exactly 40 past: playable.
  assert.equal(resolveShot(short, 0, 'tee', 4, carry(CLUBS[3], 171)).kind, 'beyond');
  const edge = { length: 131, hazards: [] };
  const stay = resolveShot(edge, 0, 'tee', 4, carry(CLUBS[3], 171));
  assert.deepEqual([stay.kind, stay.to, stay.leave], ['rough', 171, BEYOND]);
});

test('from behind the green the ball is played back towards the pin', () => {
  const short = { length: 120, hazards: [] };
  const chip = resolveShot(short, 150, 'rough', 1, carry(CLUBS[0], 40));
  assert.equal(chip.kind, 'green');
  assert.ok(chip.to >= 120 - GREEN_RADIUS && chip.to <= 120 + GREEN_RADIUS);

  const back = resolveShot(short, 150, 'rough', 2, carry(CLUBS[1], 100));
  assert.deepEqual([back.kind, back.to], ['fairway', 50]);

  const gone = resolveShot(short, 150, 'rough', 5, carry(CLUBS[4], 280));
  assert.deepEqual([gone.kind, gone.penalty, gone.to], ['ob', 1, 150]);
  assert.equal(TEE_BACK, 10);
});

test('on the green only a Crowd answer drops', () => {
  const short = { length: 120, hazards: [] };
  const drop = resolveShot(short, 112, 'green', 1, 12345);
  assert.deepEqual([drop.kind, drop.putt, drop.to, drop.carry], ['holed', true, 120, 8]);

  for (let u = 0; u < 40; u++) {
    const t2 = resolveShot(short, 112, 'green', 2, u);
    assert.equal(t2.kind, 'green');
    assert.ok(t2.leave >= 4 && t2.leave <= 9);
    assert.ok(t2.to > 120, 'the putt runs past the cup');

    const t3 = resolveShot(short, 112, 'green', 3, u);
    assert.equal(t3.kind, 'green');
    assert.ok(t3.leave >= 10 && t3.leave <= 15);

    const t4 = resolveShot(short, 112, 'green', 4, u);
    assert.equal(t4.kind, 'rough');
    assert.ok(t4.leave >= 18 && t4.leave <= 26);

    const t5 = resolveShot(short, 112, 'green', 5, u);
    assert.equal(t5.kind, 'rough');
    assert.ok(t5.leave >= 28 && t5.leave <= 38, 'never far enough for the hazard');
    assert.equal(t5.penalty, 0);
  }
});

test('the club guide says what each tier will do', () => {
  const at = (pos, lie, tier) => outlook(hole, pos, lie, tier).status;
  assert.equal(at(250, 'fairway', 3), 'reach'); // 150 to go
  assert.equal(at(250, 'fairway', 2), 'short');
  assert.equal(at(250, 'fairway', 4), 'long');
  assert.equal(at(395, 'green', 1), 'drops');
  assert.equal(at(395, 'green', 3), 'past');
  assert.equal(zonesFor(hole, 395, 'green'), null);
  assert.equal(zonesFor(hole, 250, 'fairway').filter((z) => z.reach).length, 1);
});

test('scores have their golf names', () => {
  assert.equal(scoreName(1, 3), 'Hole in one');
  assert.equal(scoreName(2, 5), 'Albatross');
  assert.equal(scoreName(2, 4), 'Eagle');
  assert.equal(scoreName(3, 4), 'Birdie');
  assert.equal(scoreName(4, 4), 'Par');
  assert.equal(scoreName(5, 4), 'Bogey');
  assert.equal(scoreName(6, 4), 'Double bogey');
  assert.equal(scoreName(7, 4), 'Triple bogey');
  assert.equal(formatRel(0), 'E');
  assert.equal(formatRel(3), '+3');
  assert.equal(formatRel(-2), '−2');
  assert.equal(describeRel(-2), '2 under par');
  assert.equal(describeRel(0), 'level par');
  assert.equal(describeRel(1), '1 over par');
});

test('every possible shot leaves the ball somewhere legal', () => {
  const rng = makeRng('rules-fuzz');
  for (let i = 0; i < 40000; i++) {
    const length = rng.int(105, 520);
    const hazards = [];
    if (length > 160 && rng.chance(0.7)) {
      const from = rng.int(60, length - 60);
      hazards.push({ type: rng.chance(0.5) ? 'water' : 'sand', from, to: from + rng.int(14, 30) });
    }
    const h = { length, hazards };
    let pos;
    do {
      pos = rng.int(-TEE_BACK, length + BEYOND);
    } while (lieAt(h, pos) === 'water' || pos === length); // a ball never rests in water or on the pin
    const lie = pos === 0 ? 'tee' : lieAt(h, pos);
    const tier = rng.int(1, 5);
    const out = resolveShot(h, pos, lie, tier, Math.floor(rng.next() * 2 ** 32));

    assert.ok(Number.isInteger(out.to) && Number.isInteger(out.landed) && Number.isInteger(out.carry));
    assert.ok(out.carry >= 1, 'the ball always moves');
    assert.ok(out.to >= -TEE_BACK && out.to <= length + BEYOND, `ball at ${out.to} on a ${length}-yard hole`);
    assert.equal(out.leave, Math.abs(length - out.to));
    if (out.kind === 'holed') {
      assert.equal(out.to, length);
      assert.equal(out.penalty, 0);
    } else if (out.penalty) {
      assert.ok(['water', 'beyond', 'ob'].includes(out.kind));
      assert.equal(out.to, pos, 'a penalty is replayed from the same spot');
      assert.equal(out.lie, lie);
    } else {
      assert.equal(out.lie, lieAt(h, out.to));
      assert.equal(out.kind, out.lie);
      assert.notEqual(out.lie, 'water');
    }
  }
});
