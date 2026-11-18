import assert from 'node:assert/strict';
import { test } from 'node:test';

import { EXAMPLES, exampleFor } from '../src/examples.js';
import { findAnswer } from '../src/match.js';
import { cardFor } from '../src/prompts.js';
import { CLUBS } from '../src/rules.js';

test('every rarity example sits in the tier it stands for', () => {
  for (const set of EXAMPLES) {
    const card = cardFor(set.prompt);
    assert.ok(card, `no card called ${set.prompt}`);
    assert.equal(set.answers.length, CLUBS.length);
    set.answers.forEach((name, i) => {
      assert.equal(findAnswer(card, name)?.tier, i + 1, `${set.prompt}: ${name} should be tier ${i + 1}`);
    });
  }
});

test('the guide never takes its example from the card in play', () => {
  for (const set of EXAMPLES) {
    for (const c of CLUBS) assert.ok(!set.answers.includes(exampleFor(c.tier, set.prompt).answer));
  }
});
