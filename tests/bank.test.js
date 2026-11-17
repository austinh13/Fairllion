import assert from 'node:assert/strict';
import { test } from 'node:test';

import { PARS } from '../src/course.js';
import { findAnswer } from '../src/match.js';
import { PROMPTS, cardFor } from '../src/prompts.js';
import { MAX_OVER_PAR } from '../src/rules.js';

/** Every spelling listed on a card, with the tier it sits in. */
function spellings(prompt) {
  const out = [];
  prompt.tiers.forEach((line, i) => {
    for (const entry of line.split(',')) {
      const names = entry.split('|').map((s) => s.trim());
      for (const name of names) out.push({ name, primary: names[0], tier: i + 1 });
    }
  });
  return out;
}

test('the bank is big enough to deal a full round', () => {
  const need = PARS.reduce((n, par) => n + par + MAX_OVER_PAR, 0);
  assert.ok(PROMPTS.length >= need, `${PROMPTS.length} prompts, ${need} needed`);
});

test('prompt ids are unique and every prompt is well formed', () => {
  const ids = new Set();
  for (const p of PROMPTS) {
    assert.match(p.id, /^[a-z0-9-]+$/);
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
    ids.add(p.id);
    assert.ok(typeof p.q === 'string' && p.q.startsWith('Name '), `${p.id}: question`);
    assert.equal(p.tiers.length, 5, `${p.id}: five tiers`);
  }
});

test('every tier of every card has at least three answers', () => {
  for (const p of PROMPTS) {
    const card = cardFor(p.id);
    for (let tier = 1; tier <= 5; tier++) {
      const n = card.answers.filter((a) => a.tier === tier).length;
      assert.ok(n >= 3, `${p.id} tier ${tier} has ${n} answers`);
    }
  }
});

test('no spelling is blank, and none carries stray characters', () => {
  for (const p of PROMPTS) {
    for (const s of spellings(p)) {
      assert.ok(s.name.length > 0, `${p.id}: blank spelling near "${s.primary}"`);
      assert.ok(!/[\n\t;?"()]/.test(s.name), `${p.id}: stray character in "${s.name}"`);
    }
  }
});

test('every spelling on a card finds its own answer, in its own tier', () => {
  for (const p of PROMPTS) {
    const card = cardFor(p.id);
    for (const s of spellings(p)) {
      const hit = findAnswer(card, s.name);
      assert.ok(hit, `${p.id}: "${s.name}" is not found`);
      assert.equal(hit.name, s.primary, `${p.id}: "${s.name}" finds "${hit.name}", expected "${s.primary}"`);
      assert.equal(hit.tier, s.tier, `${p.id}: "${s.name}" is in the wrong tier`);
    }
  }
});

test('no answer appears twice on a card', () => {
  for (const p of PROMPTS) {
    const seen = new Map();
    for (const a of cardFor(p.id).answers) {
      for (const key of a.keys) {
        assert.ok(!seen.has(key) || seen.get(key) === a, `${p.id}: "${a.name}" clashes with "${seen.get(key)?.name}"`);
        seen.set(key, a);
      }
    }
  }
});

test('closed sets are complete', () => {
  const count = (id) => cardFor(id).answers.length;
  assert.equal(count('elements'), 118);
  assert.equal(count('us-states'), 50);
  assert.equal(count('us-capitals'), 50);
  assert.equal(count('africa'), 54);
  assert.equal(count('americas'), 35);
  assert.equal(count('greek-letters'), 24);
  assert.equal(count('nato-alphabet'), 26);
  assert.equal(count('si-prefixes'), 24);
  assert.equal(count('constellations'), 88);
  assert.equal(count('presidents'), 40);
  assert.equal(count('asian-capitals'), 50);
  assert.equal(count('nfl-teams'), 32);
  assert.equal(count('nba-teams'), 30);
  assert.equal(count('tarot'), 78);
});

// Lists with a fixed, real-world size; every other card holds at least 60 answers.
const CLOSED = new Set([
  'us-states', 'us-capitals', 'africa', 'europe', 'asia', 'americas', 'euro-capitals', 'asian-capitals',
  'greek-letters', 'nato-alphabet', 'si-prefixes', 'nfl-teams', 'nba-teams', 'presidents',
]);

test('the bank holds 300 categories', () => {
  assert.equal(PROMPTS.length, 300);
});

test('every open category has at least 60 answers', () => {
  for (const p of PROMPTS) {
    if (CLOSED.has(p.id)) continue;
    const n = cardFor(p.id).answers.length;
    assert.ok(n >= 60, `${p.id} has ${n} answers`);
  }
});

test('the bank reports its size', () => {
  const answers = PROMPTS.reduce((n, p) => n + cardFor(p.id).answers.length, 0);
  assert.ok(answers > 40000, `${answers} answers`);
});
