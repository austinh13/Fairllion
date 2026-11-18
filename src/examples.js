// One answer from each tier of a familiar card, to show how rare each tier is.
// The shot guide never uses the card being played, so it gives nothing away.
// tests/examples.test.js checks every example still sits in its tier.

export const EXAMPLES = [
  { prompt: 'fruit', noun: 'a fruit', answers: ['Apple', 'Mango', 'Pomegranate', 'Kumquat', 'Rambutan'] },
  { prompt: 'elements', noun: 'an element', answers: ['Oxygen', 'Calcium', 'Cobalt', 'Gallium', 'Yttrium'] },
];

/** An example answer of this tier, from a card other than the one in play. */
export function exampleFor(tier, promptId) {
  const set = EXAMPLES.find((e) => e.prompt !== promptId);
  return { answer: set.answers[tier - 1], noun: set.noun };
}
