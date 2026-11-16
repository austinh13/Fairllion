// Dates, daily numbering and round codes.

/** The day of Daily No. 1. */
export const EPOCH = '2026-11-13';

const pad = (n) => String(n).padStart(2, '0');

/** Local calendar date as YYYY-MM-DD. */
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toUtc(key) {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Whole days from one date key to another. */
export function daysBetween(fromKey, toKey) {
  return Math.round((toUtc(toKey) - toUtc(fromKey)) / 86400000);
}

export function dailyNumber(key) {
  return daysBetween(EPOCH, key) + 1;
}

export function shiftKey(key, days) {
  const d = new Date(toUtc(key) + days * 86400000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export const dailySeed = (key) => `daily|${key}`;
// Unlimited rounds were called practice rounds at first. The seed keeps the
// old prefix so codes shared back then still deal the same holes.
export const unlimitedSeed = (code) => `practice|${code}`;

/** "Friday 13 November 2026" */
export function longDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/** Milliseconds until the next local midnight. */
export function msToMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** A five-character code that names an unlimited round. */
export function randomCode(random = Math.random) {
  let code = '';
  for (let i = 0; i < 5; i++) code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  return code;
}

/** Tidy a typed or linked code; null if it cannot be one. */
export function cleanCode(text) {
  const code = String(text || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return code.length >= 3 && code.length <= 12 ? code : null;
}
