// Everything Fairllion remembers lives in this browser, under one key.
// If storage is unavailable the game still runs; it just forgets on reload.

const KEY = 'fairllion.v1';
/** How many finished unlimited rounds to remember. */
const UNLIMITED_KEEP = 200;
let cache = null;

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function load() {
  if (cache) return cache;
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem(KEY));
  } catch {
    data = null;
  }
  cache = isObject(data) ? data : {};
  for (const part of ['settings', 'daily', 'results', 'unlimited']) {
    if (!isObject(cache[part])) cache[part] = {};
  }
  if (!Array.isArray(cache.unlimited.rounds)) cache.unlimited.rounds = [];
  return cache;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Private mode or a full disk: carry on in memory.
  }
}

export const store = {
  getSetting(name, fallback) {
    const value = load().settings[name];
    return value === undefined ? fallback : value;
  },
  setSetting(name, value) {
    load().settings[name] = value;
    save();
  },

  /** The saved state of a day's round, finished or not. */
  getDaily(key) {
    return load().daily[key] ?? null;
  },
  setDaily(key, snap) {
    const data = load();
    // Only the latest few days are worth keeping in full.
    const keep = Object.keys(data.daily).filter((k) => k !== key).sort().slice(-2);
    data.daily = Object.fromEntries([...keep.map((k) => [k, data.daily[k]]), [key, snap]]);
    save();
  },

  /** Final scores by day: { scores, pars, course }. */
  getResult(key) {
    const r = load().results[key];
    return r && Array.isArray(r.scores) && Array.isArray(r.pars) && r.scores.length === r.pars.length ? r : null;
  },
  setResult(key, result) {
    load().results[key] = result;
    save();
  },
  results() {
    const out = {};
    for (const key of Object.keys(load().results)) {
      const r = this.getResult(key);
      if (r && /^\d{4}-\d{2}-\d{2}$/.test(key)) out[key] = r;
    }
    return out;
  },

  /** The unlimited round in play (one at a time), or null. */
  getUnlimited() {
    return load().unlimited.current ?? null;
  },
  setUnlimited(snap) {
    load().unlimited.current = snap;
    save();
  },

  /** Finished unlimited rounds, oldest first: { code, scores, pars, course, date }. */
  unlimitedResults() {
    return load().unlimited.rounds.filter(
      (r) => r && typeof r.code === 'string' && Array.isArray(r.scores) && Array.isArray(r.pars) && r.scores.length === r.pars.length,
    );
  },
  addUnlimitedResult(result) {
    const data = load();
    data.unlimited.rounds = [...data.unlimited.rounds, result].slice(-UNLIMITED_KEEP);
    save();
  },
};
