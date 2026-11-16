// Figures for the stats page, worked out from the stored results.
// Daily results: { 'YYYY-MM-DD': { scores: [..], pars: [..] } }

import { shiftKey } from './daily.js';

export function computeStats(results, todayKey) {
  const keys = Object.keys(results).sort();
  const rounds = keys.map((key) => {
    const { scores, pars } = results[key];
    return { key, scores, pars, ...tally(scores, pars) };
  });

  // Current streak: consecutive days ending today, or yesterday if today is unplayed.
  let streak = 0;
  let cursor = results[todayKey] ? todayKey : shiftKey(todayKey, -1);
  while (results[cursor]) {
    streak += 1;
    cursor = shiftKey(cursor, -1);
  }

  let bestStreak = 0;
  let run = 0;
  let prev = null;
  for (const key of keys) {
    run = prev && shiftKey(prev, 1) === key ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    prev = key;
  }

  return { streak, bestStreak, ...summarise(rounds) };
}

/**
 * Figures for unlimited rounds. There are no streaks: play as many as you like.
 * rounds: [{ code, scores, pars, course, date }], oldest first.
 */
export function computeUnlimitedStats(rounds) {
  return summarise(rounds.map((r) => ({ ...r, ...tally(r.scores, r.pars) })));
}

function tally(scores, pars) {
  const strokes = scores.reduce((a, b) => a + b, 0);
  const par = pars.reduce((a, b) => a + b, 0);
  return { strokes, par, diff: strokes - par };
}

/** Played, best, average, hole-by-hole counts and the last ten, newest first. */
function summarise(rounds) {
  const holes = { ace: 0, eagle: 0, birdie: 0, par: 0, bogey: 0, worse: 0 };
  for (const r of rounds) {
    r.scores.forEach((s, i) => {
      const d = s - r.pars[i];
      if (s === 1) holes.ace += 1;
      else if (d <= -2) holes.eagle += 1;
      else if (d === -1) holes.birdie += 1;
      else if (d === 0) holes.par += 1;
      else if (d === 1) holes.bogey += 1;
      else holes.worse += 1;
    });
  }

  const played = rounds.length;
  return {
    played,
    best: played ? Math.min(...rounds.map((r) => r.diff)) : null,
    average: played ? rounds.reduce((a, r) => a + r.diff, 0) / played : null,
    holes,
    recent: rounds.slice(-10).reverse(),
  };
}
