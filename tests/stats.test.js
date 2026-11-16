import assert from 'node:assert/strict';
import { test } from 'node:test';

import { dailySeed, unlimitedSeed } from '../src/daily.js';
import { computeStats, computeUnlimitedStats } from '../src/stats.js';

const PARS = [3, 4, 5, 3, 4, 5];

test('daily stats keep streaks across consecutive days', () => {
  const results = {
    '2026-11-13': { scores: [3, 4, 5, 3, 4, 5], pars: PARS },
    '2026-11-14': { scores: [2, 4, 5, 3, 4, 5], pars: PARS },
    '2026-11-16': { scores: [4, 4, 5, 3, 4, 5], pars: PARS },
  };
  const s = computeStats(results, '2026-11-16');
  assert.equal(s.played, 3);
  assert.equal(s.streak, 1);
  assert.equal(s.bestStreak, 2);
  assert.equal(s.best, -1);
  assert.equal(s.recent[0].key, '2026-11-16');
});

test('unlimited stats count every round, with no streaks', () => {
  const rounds = [
    { code: 'AAAAA', scores: [3, 4, 5, 3, 4, 5], pars: PARS, course: 'One', date: '2026-11-16' },
    { code: 'BBBBB', scores: [1, 3, 6, 3, 4, 5], pars: PARS, course: 'Two', date: '2026-11-16' },
    { code: 'AAAAA', scores: [4, 5, 5, 3, 4, 5], pars: PARS, course: 'One', date: '2026-11-16' },
  ];
  const s = computeUnlimitedStats(rounds);
  assert.equal(s.played, 3);
  assert.equal(s.best, -2);
  assert.equal(s.average, 0);
  assert.equal('streak' in s, false);
  assert.equal(s.holes.ace, 1);
  assert.equal(s.holes.birdie, 1);
  assert.equal(s.holes.bogey, 3);
  assert.equal(s.recent[0].diff, 2);
  assert.equal(s.recent[0].code, 'AAAAA');
});

test('unlimited stats with no rounds', () => {
  const s = computeUnlimitedStats([]);
  assert.equal(s.played, 0);
  assert.equal(s.best, null);
  assert.equal(s.average, null);
});

test('unlimited seeds keep the old practice prefix so shared codes still work', () => {
  assert.equal(unlimitedSeed('K7Q2M'), 'practice|K7Q2M');
  assert.notEqual(unlimitedSeed('2026-11-16'), dailySeed('2026-11-16'));
});
