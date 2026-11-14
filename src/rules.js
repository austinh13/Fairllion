// The rules of Fairllion: clubs, lies, and what happens to a ball when it is hit.
// Pure functions only. Positions are whole yards measured from the tee along
// the hole; the pin sits at `hole.length`.

/** A ball within this many yards of the pin is on the green. */
export const GREEN_RADIUS = 15;
/** More than this many yards past the pin is the trouble behind the green. */
export const BEYOND = 40;
/** More than this many yards behind the tee is out of bounds. */
export const TEE_BACK = 10;
/** A shot whose natural distance is this close to the pin drops in. */
export const HOLE_OUT = 3;
/** The most a hole can cost is par plus this. */
export const MAX_OVER_PAR = 3;
/** Seconds allowed per shot. */
export const SHOT_CLOCK = 30;

/**
 * One club per rarity tier. `lo`–`hi` is the reach: if the pin is inside it,
 * the shot finds the green. `carryLo`–`hi` is the natural distance the ball
 * flies when the pin is out of reach.
 */
export const CLUBS = [
  { tier: 1, key: 'chip', club: 'Chip', rarity: 'Crowd', short: 'Crowd', lo: 1, hi: 50, carryLo: 20, hint: 'The answer everybody gives.' },
  { tier: 2, key: 'wedge', club: 'Wedge', rarity: 'Familiar', short: 'Familiar', lo: 51, hi: 110, carryLo: 51, hint: 'Well known, just not said first.' },
  { tier: 3, key: 'iron', club: 'Iron', rarity: 'Sharp', short: 'Sharp', lo: 111, hi: 170, carryLo: 111, hint: 'You had to stop and think.' },
  { tier: 4, key: 'wood', club: 'Wood', rarity: 'Deep cut', short: 'Deep cut', lo: 171, hi: 230, carryLo: 171, hint: 'Most people never get there.' },
  { tier: 5, key: 'driver', club: 'Driver', rarity: 'One in a million', short: 'Million', lo: 231, hi: 300, carryLo: 231, hint: 'Hardly anyone would say it.' },
];

/** How far a misjudged putt runs past the cup, by tier. */
export const PUTT_RUN = { 2: [4, 9], 3: [10, 15], 4: [18, 26], 5: [28, 38] };

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** The club an answer of this tier plays as. Sand costs one club. */
export function clubFor(tier, lie) {
  const effective = lie === 'sand' ? Math.max(1, tier - 1) : tier;
  return CLUBS[effective - 1];
}

export function remaining(hole, pos) {
  return Math.abs(hole.length - pos);
}

export function onGreen(hole, pos) {
  return remaining(hole, pos) <= GREEN_RADIUS;
}

/** What the ground is like at a spot on the hole. */
export function lieAt(hole, y) {
  if (Math.abs(hole.length - y) <= GREEN_RADIUS) return 'green';
  for (const h of hole.hazards) {
    if (y >= h.from && y <= h.to) return h.type;
  }
  if (y > hole.length || y < 0) return 'rough';
  return 'fairway';
}

/**
 * Landing zones from a spot off the green, one per club in play.
 * In sand two tiers share the chip, so a zone can carry more than one tier.
 * Returns null on the green, where every answer is a putt.
 */
export function zonesFor(hole, pos, lie) {
  const r = remaining(hole, pos);
  if (r <= GREEN_RADIUS) return null;
  const zones = [];
  for (const c of CLUBS) {
    const club = clubFor(c.tier, lie);
    let zone = zones.find((z) => z.club === club);
    if (!zone) {
      zone = { club, lo: club.lo, hi: club.hi, tiers: [], reach: r >= club.lo && r <= club.hi };
      zones.push(zone);
    }
    zone.tiers.push(c.tier);
  }
  return zones;
}

/**
 * What an answer of a given tier will do from here, for the club guide.
 * status: 'drops' | 'past' (on the green) or 'reach' | 'short' | 'long'.
 */
export function outlook(hole, pos, lie, tier) {
  const r = remaining(hole, pos);
  if (r <= GREEN_RADIUS) {
    return { putt: true, club: null, status: tier === 1 ? 'drops' : 'past' };
  }
  const club = clubFor(tier, lie);
  const status = r > club.hi ? 'short' : r < club.lo ? 'long' : 'reach';
  return { putt: false, club, status };
}

/**
 * Resolve one swing.
 *
 * @param hole  { length, hazards: [{ type: 'sand' | 'water', from, to }] }
 * @param pos   where the ball lies, yards from the tee
 * @param lie   'tee' | 'fairway' | 'rough' | 'sand' | 'green'
 * @param tier  rarity tier of the answer, 1–5
 * @param u     unsigned 32-bit hash of prompt + answer; fixes the distance
 *
 * @returns {
 *   tier, from, putt, club, inRange,
 *   kind: 'holed' | 'green' | 'fairway' | 'rough' | 'sand' | 'water' | 'beyond' | 'ob',
 *   carry,   yards the ball travelled
 *   landed,  where it came down (in the hazard, for a penalty)
 *   to,      where the next shot is played from
 *   lie,     the lie for the next shot ('hole' when holed)
 *   penalty, 0 or 1
 *   leave,   yards from `to` to the pin
 * }
 */
export function resolveShot(hole, pos, lie, tier, u) {
  const pin = hole.length;
  const r = Math.abs(pin - pos);
  const dir = pos <= pin ? 1 : -1;
  const shot = { tier, from: pos, penalty: 0 };

  // On the green every answer is a putt: only a Crowd answer drops.
  if (r <= GREEN_RADIUS) {
    if (tier === 1) {
      return { ...shot, putt: true, club: 'putter', inRange: true, kind: 'holed', carry: r, landed: pin, to: pin, lie: 'hole', leave: 0 };
    }
    const [lo, hi] = PUTT_RUN[tier];
    const past = lo + (u % (hi - lo + 1));
    return settle({ ...shot, putt: true, club: 'putter', inRange: false, carry: r + past, landed: pin + dir * past }, hole, pos, lie);
  }

  const club = clubFor(tier, lie);
  const natural = club.carryLo + (u % (club.hi - club.carryLo + 1));
  const inRange = r >= club.lo && r <= club.hi;

  // Dead on: the natural distance is the distance to the pin.
  if (Math.abs(natural - r) <= HOLE_OUT) {
    return { ...shot, putt: false, club: club.key, inRange, kind: 'holed', carry: r, landed: pin, to: pin, lie: 'hole', leave: 0 };
  }

  // Right club: the ball finds the green. The closer the natural distance
  // was to the real one, the closer it finishes.
  if (inRange) {
    const leave = clamp(Math.round(Math.abs(natural - r) / 4), 2, GREEN_RADIUS);
    const landed = natural < r ? pin - dir * leave : pin + dir * leave;
    return { ...shot, putt: false, club: club.key, inRange: true, kind: 'green', carry: Math.abs(landed - pos), landed, to: landed, lie: 'green', leave };
  }

  // Wrong club: the ball flies its natural distance and takes what it finds.
  return settle({ ...shot, putt: false, club: club.key, inRange: false, carry: natural, landed: pos + dir * natural }, hole, pos, lie);
}

/** Decide the fate of a ball that came down at `shot.landed`. */
function settle(shot, hole, pos, lie) {
  const pin = hole.length;
  let kind;
  if (shot.landed > pin + BEYOND) kind = 'beyond';
  else if (shot.landed < -TEE_BACK) kind = 'ob';
  else kind = lieAt(hole, shot.landed);

  if (kind === 'beyond' || kind === 'ob' || kind === 'water') {
    // One-stroke penalty; replay from the same spot and the same lie.
    return { ...shot, kind, penalty: 1, to: pos, lie, leave: Math.abs(pin - pos) };
  }
  return { ...shot, kind, to: shot.landed, lie: kind, leave: Math.abs(pin - shot.landed) };
}

/** Golf's name for a score on a hole. */
export function scoreName(strokes, par) {
  if (strokes === 1) return 'Hole in one';
  const diff = strokes - par;
  if (diff <= -3) return 'Albatross';
  if (diff === -2) return 'Eagle';
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Double bogey';
  return 'Triple bogey';
}

/** "+2", "−1" or "E" for a score relative to par. */
export function formatRel(diff) {
  if (diff === 0) return 'E';
  return diff > 0 ? `+${diff}` : `−${Math.abs(diff)}`;
}

/** "2 under par", "level par", "1 over par". */
export function describeRel(diff) {
  if (diff === 0) return 'level par';
  return `${Math.abs(diff)} ${diff < 0 ? 'under' : 'over'} par`;
}
