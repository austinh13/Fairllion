// Turning what a player typed into an answer on the card.

const FOLD = { 'æ': 'ae', 'œ': 'oe', 'ø': 'o', 'ß': 'ss', 'ł': 'l', 'đ': 'd', 'ð': 'd', 'þ': 'th', 'ı': 'i' };

/**
 * Lower-case words with accents, punctuation and a leading article removed.
 * Pass keepArticle for cards where the article matters ("A tempo").
 */
export function words(text, keepArticle = false) {
  const list = String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[æœøßłđðþı]/g, (c) => FOLD[c])
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/#/g, ' sharp ')
    .replace(/['’‘`´ʻʼ.·]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  if (!keepArticle && list.length > 1 && (list[0] === 'the' || list[0] === 'a' || list[0] === 'an')) list.shift();
  return list;
}

/** Comparison key: capitals, accents, punctuation and spacing all ignored. */
export function norm(text) {
  return words(text).join('');
}

/** The key with a plural "s" taken off, so "violins" finds "violin". */
export function loose(key) {
  return key.length > 3 && key.endsWith('s') ? key.slice(0, -1) : key;
}

/** Words of `text` without the card's filler words ("Sahara Desert" -> "sahara"). */
function contentWords(text, card) {
  const list = words(text, card.keepArticle);
  if (!card.strip.size) return list;
  const kept = list.filter((w) => !card.strip.has(w));
  return kept.length ? kept : list;
}

/**
 * Build the lookup for one prompt.
 * Each tier is a comma-separated string; "Aubergine|Eggplant" lists
 * alternative spellings of one answer, the first being the one displayed.
 * `prompt.strip` lists filler words ignored on both sides; `prompt.people`
 * lets a full name find a surname; `prompt.keepArticle` keeps a leading
 * "a" or "the" as part of the answer.
 */
export function buildCard(prompt) {
  const card = {
    id: prompt.id,
    people: Boolean(prompt.people),
    keepArticle: Boolean(prompt.keepArticle),
    strip: new Set(prompt.strip || []),
    answers: [],
    byKey: new Map(),
  };
  const { answers, byKey } = card;
  const keyOf = (text) => contentWords(text, card).join('');
  prompt.tiers.forEach((line, i) => {
    for (const entry of line.split(',')) {
      const names = entry.split('|').map((s) => s.trim()).filter(Boolean);
      if (!names.length) continue;
      answers.push({ name: names[0], tier: i + 1, key: keyOf(names[0]), keys: [...new Set(names.map(keyOf))] });
    }
  });
  // Exact spellings first, so a plural-insensitive key can never shadow one.
  for (const answer of answers) {
    for (const key of answer.keys) {
      if (!byKey.has(key)) byKey.set(key, answer);
    }
  }
  for (const answer of answers) {
    for (const key of answer.keys) {
      const l = loose(key);
      if (!byKey.has(l)) byKey.set(l, answer);
    }
  }
  return card;
}

/** Find the answer a player meant, or null if it is not on the card. */
export function findAnswer(card, input) {
  const list = contentWords(input, card);
  const key = list.join('');
  if (!key) return null;

  const tries = [key, loose(key)];
  if (key.length > 4 && key.endsWith('es')) tries.push(key.slice(0, -2));
  // For people, a full name finds the surname: "Claude Monet" -> "Monet".
  if (card.people && list.length > 1) {
    tries.push(list.slice(-1).join(''));
    if (list.length > 2) tries.push(list.slice(-2).join(''));
  }
  for (const t of tries) {
    const hit = card.byKey.get(t);
    if (hit) return hit;
  }
  return null;
}

/**
 * A single close match for a probable typo, or null when nothing is close
 * or when two different answers are equally close.
 */
export function suggest(card, input) {
  const key = contentWords(input, card).join('');
  if (key.length < 4) return null;
  const max = key.length >= 7 ? 2 : 1;
  let best = null;
  let bestDist = max + 1;
  let tie = false;
  for (const answer of card.answers) {
    for (const k of answer.keys) {
      if (Math.abs(k.length - key.length) > max) continue;
      const d = editDistance(key, k);
      if (d < bestDist) {
        best = answer;
        bestDist = d;
        tie = false;
      } else if (d === bestDist && answer !== best) {
        tie = true;
      }
    }
  }
  return best && !tie ? best : null;
}

/** Edit distance where swapping two neighbouring letters counts as one. */
export function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev2 = null;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      cur.push(v);
    }
    prev2 = prev;
    prev = cur;
  }
  return prev[n];
}
