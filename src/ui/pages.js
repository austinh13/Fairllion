// The rules page and the stats page.

import { PARS } from '../course.js';
import { dateKey, dailyNumber } from '../daily.js';
import { PROMPTS, cardFor } from '../prompts.js';
import { BEYOND, GREEN_RADIUS, HOLE_OUT, MAX_OVER_PAR, PUTT_RUN, SHOT_CLOCK, formatRel } from '../rules.js';
import { computeStats, computeUnlimitedStats } from '../stats.js';
import { store } from '../store.js';
import { clubTable, esc, scoreMark, tierChip } from './dom.js';

export function renderHow(root) {
  const answers = PROMPTS.reduce((n, p) => n + cardFor(p.id).answers.length, 0);
  root.innerHTML = `
  <article class="page prose">
    <p class="eyebrow">The rules</p>
    <h1>How Fairllion works</h1>
    <p class="lede">Fairllion is six holes of golf played with words. Each shot gives you a category. You type one thing that belongs in it, and how unusual your answer is decides which club you just swung.</p>

    <h2>The bag</h2>
    <p>Every answer on a category's card sits in one of five tiers, and each tier is a club.</p>
    ${clubTable()}
    <p>Take <em>Name a chemical element</em>. Oxygen is a ${tierChip(1)} answer and a chip. Calcium is ${tierChip(2)}, a wedge. Cobalt is ${tierChip(3)}, an iron. Gallium is a ${tierChip(4)}, a wood. Yttrium is ${tierChip(5)}, and that is the driver.</p>

    <h2>Reading a shot</h2>
    <p>The number to watch is the yards to the pin. The map shows where each club lands from where you stand, and the guide under the prompt says the same in words.</p>
    <ul>
      <li><b>Right club.</b> If the pin is inside your club's reach, the ball finds the green.</li>
      <li><b>Too little club.</b> The ball flies its own distance and stops short. You play again from there.</li>
      <li><b>Too much club.</b> The ball flies past the pin. Up to ${BEYOND} yards long is playable; any further is trouble.</li>
      <li><b>Dead on.</b> Every answer has its own exact distance inside its club's range. If that lands within ${HOLE_OUT} yards of the pin, the ball drops in from wherever you are.</li>
    </ul>
    <p>The same answer to the same category always flies the same distance, for everyone.</p>

    <h2>On the green</h2>
    <p>Within ${GREEN_RADIUS} yards of the pin you are putting, and the game turns upside down: only a ${tierChip(1)} answer drops. Anything rarer is hit too hard. A ${tierChip(2)} answer rolls ${PUTT_RUN[2][0]} to ${PUTT_RUN[2][1]} yards past, a ${tierChip(3)} one ${PUTT_RUN[3][0]} to ${PUTT_RUN[3][1]}, and the two rarest tiers run right off the green. So on the green, say the most obvious thing you can think of.</p>

    <h2>Trouble</h2>
    <ul>
      <li><b>Water</b> crosses some holes between two yardages. Land in it and you take a one-stroke penalty and play again from the same spot.</li>
      <li><b>Sand</b> costs a club: from a bunker every answer plays one club shorter, so a ${tierChip(3)} answer flies like a wedge.</li>
      <li><b>Behind the green</b>, more than ${BEYOND} yards past the pin, there is always a pond, pines or heather. One-stroke penalty, same spot.</li>
      <li><b>Out of bounds</b> is back past the tee, which takes some doing. Same penalty.</li>
    </ul>

    <h2>The shot clock</h2>
    <p>You have ${SHOT_CLOCK} seconds for each shot. The clock starts when the category appears, and stops while the rules are open.</p>
    <ul>
      <li>An answer that is not on the card costs nothing but time. Type another.</li>
      <li>If the clock runs out, that is a stroke, and the next shot brings a new category.</li>
      <li>Close misspellings get a suggestion. Press Enter again to accept it.</li>
    </ul>
    <p>Capitals, accents, punctuation, spacing, a leading &ldquo;the&rdquo; and a plural &ldquo;s&rdquo; are all ignored, so &ldquo;The Bagpipes&rdquo; and &ldquo;bagpipe&rdquo; are the same answer.</p>

    <h2>Scoring</h2>
    <p>A round is six holes: par ${PARS.join(', ')}, for a par of ${PARS.reduce((a, b) => a + b, 0)}. Each hole is scored the usual golf way, and the most a hole can cost is ${MAX_OVER_PAR} over its par. After that you pick up and walk to the next tee.</p>
    <div class="table-wrap"><table class="clubs">
      <thead><tr><th>Par 3</th><th>Par 4</th><th>Par 5</th></tr></thead>
      <tbody><tr><td>105&ndash;170 yards</td><td>240&ndash;330 yards</td><td>410&ndash;520 yards</td></tr></tbody>
    </table></div>
    <p>On the scorecard a circle is a birdie, a double circle is an eagle or better, a square is a bogey and a filled square is worse.</p>
    <p class="marks">${scoreMark(1, 3)} ${scoreMark(2, 4)} ${scoreMark(3, 4)} ${scoreMark(4, 4)} ${scoreMark(5, 4)} ${scoreMark(7, 4)}</p>

    <h2>Two ways to play</h2>
    <p><b>Daily</b> is one round a day, new at midnight where you are. Everyone gets the same six holes and the same category on the same shot, so scores compare fairly, and playing on consecutive days builds a streak.</p>
    <p><b>Unlimited</b> deals a fresh course every round, as many rounds as you like, and keeps its own record apart from the daily. Each round has a short code; anyone who plays the same code gets the same round, so you can send one to a friend. In unlimited you can also switch the shot clock off.</p>
    <p>Both modes save your round in this browser as you go, so you can close the tab and carry on later.</p>

    <h2>Where the rarities come from</h2>
    <p>The bank holds ${PROMPTS.length} categories and ${answers.toLocaleString('en-GB')} answers. Every card was sorted into its five tiers by hand, as an editorial judgement of how readily each answer comes to mind. It is not measured from what players type, and nothing you type leaves your browser.</p>

    <div class="actions">
      <a class="btn" href="#/daily">Play today's round</a>
      <a class="btn btn-ghost" href="#/unlimited/new">Play unlimited</a>
    </div>
  </article>`;
  return () => {};
}

const tile = (label, value) => `<div class="card tile"><p class="tile-value">${value}</p><p class="tile-label">${label}</p></div>`;
const avg = (n) => formatRel(Math.round(n * 10) / 10);

function holeBars(holes) {
  const kinds = [
    ['Holes in one', holes.ace],
    ['Eagles or better', holes.eagle],
    ['Birdies', holes.birdie],
    ['Pars', holes.par],
    ['Bogeys', holes.bogey],
    ['Doubles or worse', holes.worse],
  ];
  const most = Math.max(1, ...kinds.map(([, n]) => n));
  return `<ul class="bars">${kinds
    .map(
      ([label, n]) => `<li>
        <span class="bar-label">${label}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${(n / most) * 100}%"></span></span>
        <span class="bar-count">${n}</span>
      </li>`,
    )
    .join('')}</ul>`;
}

function dailySection() {
  const s = computeStats(store.results(), dateKey());
  if (!s.played) {
    return `<p class="lede">No daily rounds finished yet. Play today's and it will show up here.</p>
      <div class="actions"><a class="btn" href="#/daily">Play today's round</a></div>`;
  }
  const recent = s.recent
    .map(
      (r) => `<tr>
        <td class="num">No. ${dailyNumber(r.key)}</td>
        <td>${esc(r.key)}</td>
        <td class="marks">${r.scores.map((sc, i) => scoreMark(sc, r.pars[i])).join('')}</td>
        <td class="num"><b>${r.strokes}</b></td>
        <td class="num">${formatRel(r.diff)}</td>
      </tr>`,
    )
    .join('');
  return `<div class="tiles">
      ${tile('Rounds played', s.played)}
      ${tile('Current streak', s.streak)}
      ${tile('Longest streak', s.bestStreak)}
      ${tile('Best round', formatRel(s.best))}
      ${tile('Average round', avg(s.average))}
    </div>
    <h3>Hole by hole</h3>
    ${holeBars(s.holes)}
    <h3>Recent rounds</h3>
    <div class="table-wrap"><table class="scorecard">
      <thead><tr><th class="num">Daily</th><th>Date</th><th>Holes</th><th class="num">Strokes</th><th class="num">To par</th></tr></thead>
      <tbody>${recent}</tbody>
    </table></div>`;
}

function unlimitedSection() {
  const s = computeUnlimitedStats(store.unlimitedResults());
  if (!s.played) {
    return `<p class="lede">No unlimited rounds finished yet.</p>
      <div class="actions"><a class="btn" href="#/unlimited/new">Play unlimited</a></div>`;
  }
  const recent = s.recent
    .map(
      (r) => `<tr>
        <td><a href="#/unlimited/${esc(r.code)}">${esc(r.code)}</a></td>
        <td>${esc(r.course || '')}</td>
        <td class="marks">${r.scores.map((sc, i) => scoreMark(sc, r.pars[i])).join('')}</td>
        <td class="num"><b>${r.strokes}</b></td>
        <td class="num">${formatRel(r.diff)}</td>
      </tr>`,
    )
    .join('');
  return `<div class="tiles">
      ${tile('Rounds played', s.played)}
      ${tile('Best round', formatRel(s.best))}
      ${tile('Average round', avg(s.average))}
    </div>
    <h3>Hole by hole</h3>
    ${holeBars(s.holes)}
    <h3>Recent rounds</h3>
    <div class="table-wrap"><table class="scorecard">
      <thead><tr><th>Code</th><th>Course</th><th>Holes</th><th class="num">Strokes</th><th class="num">To par</th></tr></thead>
      <tbody>${recent}</tbody>
    </table></div>`;
}

export function renderStats(root) {
  root.innerHTML = `
  <section class="page">
    <p class="eyebrow">Your record</p>
    <h1>Stats</h1>
    <h2>Daily</h2>
    ${dailySection()}
    <h2>Unlimited</h2>
    ${unlimitedSection()}
    <p class="fine">Daily and unlimited rounds are counted apart, and only the daily keeps a streak. Everything here is kept in this browser and nowhere else; clearing your browser data clears it.</p>
  </section>`;
  return () => {};
}
