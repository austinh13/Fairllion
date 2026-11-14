// The spoiler-free scorecard a player can copy after a round.
// Marks follow the paper-scorecard habit: circles under par, squares over.

import { formatRel } from './rules.js';

export function holeMark(strokes, par) {
  if (strokes === 1) return '★';
  const diff = strokes - par;
  if (diff <= -2) return '◎';
  if (diff === -1) return '○';
  if (diff === 0) return '•';
  if (diff === 1) return '□';
  return '▣';
}

/**
 * @param title  e.g. "Fairllion Daily No. 12"
 * @param pars   par for each hole
 * @param scores strokes for each hole
 * @param extra  optional lines to append (streak, link)
 */
export function shareText({ title, pars, scores, extra = [] }) {
  const strokes = scores.reduce((a, b) => a + b, 0);
  const par = pars.reduce((a, b) => a + b, 0);
  const marks = scores.map((s, i) => holeMark(s, pars[i])).join(' ');
  return [title, `${strokes} strokes (${formatRel(strokes - par)})`, marks, ...extra].join('\n');
}
