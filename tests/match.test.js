import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildCard, editDistance, findAnswer, norm, suggest } from '../src/match.js';
import { cardFor } from '../src/prompts.js';

test('norm ignores capitals, accents, punctuation, spacing and a leading article', () => {
  assert.equal(norm('The Beatles!'), 'beatles');
  assert.equal(norm('  côte d’Ivoire '), 'cotedivoire');
  assert.equal(norm('St. Paul'), 'stpaul');
  assert.equal(norm("A Midsummer Night's Dream"), 'midsummernightsdream');
  assert.equal(norm('Trinidad & Tobago'), 'trinidadandtobago');
  assert.equal(norm('C++'), 'cplusplus');
  assert.equal(norm('C#'), 'csharp');
  assert.equal(norm('C'), 'c');
  assert.equal(norm('The'), 'the');
  assert.equal(norm('---'), '');
});

test('answers are found whatever the capitals, accents or plural', () => {
  const elements = cardFor('elements');
  assert.equal(findAnswer(elements, 'oxygen').name, 'Oxygen');
  assert.equal(findAnswer(elements, '  OXYGEN ').tier, 1);
  assert.equal(findAnswer(elements, 'aluminum').name, 'Aluminium');
  assert.equal(findAnswer(elements, 'sulphur').name, 'Sulfur');
  assert.equal(findAnswer(elements, 'unobtainium'), null);
  assert.equal(findAnswer(elements, ''), null);
  assert.equal(findAnswer(elements, '!!!'), null);

  const instruments = cardFor('instruments');
  assert.equal(findAnswer(instruments, 'violins').name, 'Violin');
  assert.equal(findAnswer(instruments, 'a guitar').name, 'Guitar');
  assert.equal(findAnswer(instruments, 'the bagpipes').name, 'Bagpipes');
});

test('filler words are ignored where a card says so', () => {
  assert.equal(findAnswer(cardFor('deserts'), 'Sahara Desert').name, 'Sahara');
  assert.equal(findAnswer(cardFor('deserts'), 'the gobi').name, 'Gobi');
  assert.equal(findAnswer(cardFor('rivers'), 'River Thames').name, 'Thames');
  assert.equal(findAnswer(cardFor('rivers'), 'Nile river').name, 'Nile');
  assert.equal(findAnswer(cardFor('seas'), 'the red sea').name, 'Red Sea');
  assert.equal(findAnswer(cardFor('seas'), 'Japan Sea').name, 'Sea of Japan');
  assert.equal(findAnswer(cardFor('cheese'), 'blue cheese').name, 'Blue cheese');
  assert.equal(findAnswer(cardFor('cheese'), 'cheddar cheese').name, 'Cheddar');
  assert.equal(findAnswer(cardFor('trees'), 'oak tree').name, 'Oak');
  assert.equal(findAnswer(cardFor('dances'), 'tap dancing').name, 'Tap');
  assert.equal(findAnswer(cardFor('punctuation'), 'exclamation point').name, 'Exclamation mark');
  assert.equal(findAnswer(cardFor('bones'), 'thigh bone').name, 'Femur');
});

test('a full name finds a surname on people cards only', () => {
  assert.equal(findAnswer(cardFor('painters'), 'Claude Monet').name, 'Monet');
  assert.equal(findAnswer(cardFor('painters'), 'Vincent van Gogh').name, 'Van Gogh');
  assert.equal(findAnswer(cardFor('composers'), 'Ludwig van Beethoven').name, 'Beethoven');
  assert.equal(findAnswer(cardFor('composers'), 'Ralph Vaughan Williams').name, 'Vaughan Williams');
  assert.equal(findAnswer(cardFor('presidents'), 'Martin Van Buren').name, 'Van Buren');
  assert.equal(findAnswer(cardFor('presidents'), 'Abraham Lincoln').name, 'Lincoln');
  assert.equal(findAnswer(cardFor('philosophers'), 'Simone de Beauvoir').name, 'De Beauvoir');
  assert.equal(findAnswer(cardFor('us-states'), 'South Texas'), null);
});

test('look-alike answers stay apart', () => {
  assert.equal(findAnswer(cardFor('programming-languages'), 'C').name, 'C');
  assert.equal(findAnswer(cardFor('programming-languages'), 'c++').name, 'C++');
  assert.equal(findAnswer(cardFor('programming-languages'), 'C sharp').name, 'C#');
  assert.equal(findAnswer(cardFor('africa'), 'Niger').name, 'Niger');
  assert.equal(findAnswer(cardFor('africa'), 'Nigeria').name, 'Nigeria');
  assert.equal(findAnswer(cardFor('americas'), 'Dominica').name, 'Dominica');
  assert.equal(findAnswer(cardFor('americas'), 'Dominican Republic').name, 'Dominican Republic');
  assert.equal(findAnswer(cardFor('shakespeare'), 'Henry V').name, 'Henry V');
  assert.equal(findAnswer(cardFor('shakespeare'), 'Henry VI').name, 'Henry VI');
});

test('edit distance counts a swap of neighbours as one', () => {
  assert.equal(editDistance('kitten', 'sitting'), 3);
  assert.equal(editDistance('oxygne', 'oxygen'), 1);
  assert.equal(editDistance('', 'abc'), 3);
  assert.equal(editDistance('same', 'same'), 0);
});

test('typos get one suggestion, and only when it is unambiguous', () => {
  const elements = cardFor('elements');
  assert.equal(suggest(elements, 'oxigen').name, 'Oxygen');
  assert.equal(suggest(elements, 'hydrogne').name, 'Hydrogen');
  assert.equal(suggest(elements, 'zzzzzz'), null);
  assert.equal(suggest(elements, 'tim'), null, 'too short to guess at');

  const card = buildCard({ id: 't', tiers: ['Manet', 'Monet', 'Degas', 'Rodin', 'Ernst'] });
  assert.equal(suggest(card, 'Menet'), null, 'two answers are equally close');
});

test('an exact spelling always beats a plural-insensitive one', () => {
  const card = buildCard({ id: 't', tiers: ['Mars', 'Mar', 'Alpha', 'Beta', 'Gamma'] });
  assert.equal(findAnswer(card, 'Mar').name, 'Mar');
  assert.equal(findAnswer(card, 'Mars').name, 'Mars');
});
