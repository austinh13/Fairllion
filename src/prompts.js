// The prompt bank: every category a shot can ask for.

import arts from './bank/arts.js';
import everyday from './bank/everyday.js';
import life from './bank/life.js';
import places from './bank/places.js';
import science from './bank/science.js';
import { buildCard } from './match.js';

export const PROMPTS = [...everyday, ...places, ...science, ...arts, ...life];

const byId = new Map(PROMPTS.map((p) => [p.id, p]));
const cards = new Map();

export function promptById(id) {
  return byId.get(id) ?? null;
}

/** The answer card for a prompt, built once and kept. */
export function cardFor(id) {
  let card = cards.get(id);
  if (!card) {
    const prompt = byId.get(id);
    if (!prompt) return null;
    card = buildCard(prompt);
    cards.set(id, card);
  }
  return card;
}
