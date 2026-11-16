// The front page.

import { generateCourse } from '../course.js';
import { cleanCode, dailyNumber, dailySeed, dateKey, longDate } from '../daily.js';
import { moodFor } from '../mood.js';
import { createRenderer } from '../render.js';
import { CLUBS, SHOT_CLOCK, describeRel, formatRel } from '../rules.js';
import { restore } from '../round.js';
import { PROMPTS } from '../prompts.js';
import { computeStats, computeUnlimitedStats } from '../stats.js';
import { store } from '../store.js';
import { $, clubTable, esc, scoreMark } from './dom.js';

export function renderHome(root) {
  const key = dateKey();
  const course = generateCourse(dailySeed(key));
  const first = course.holes[0];
  const result = store.getResult(key);
  const saved = store.getDaily(key);
  const started = !result && saved && saved.seed === dailySeed(key) && (saved.hole > 0 || saved.shot > 0);
  const { streak } = computeStats(store.results(), key);

  let today;
  if (result) {
    const strokes = result.scores.reduce((a, b) => a + b, 0);
    const par = result.pars.reduce((a, b) => a + b, 0);
    today = `
      <p class="today-score"><b>${strokes}</b> strokes, ${describeRel(strokes - par)}</p>
      <p class="marks">${result.scores.map((s, i) => scoreMark(s, result.pars[i])).join('')}</p>
      <div class="actions">
        <a class="btn" href="#/daily">See the scorecard</a>
      </div>`;
  } else {
    today = `
      <p class="muted">${started ? `You are on hole ${saved.hole + 1}. Pick up where you left off.` : 'Everyone gets the same six holes and the same categories today.'}</p>
      <div class="actions">
        <a class="btn" href="#/daily">${started ? 'Carry on with today’s round' : 'Play today’s round'}</a>
      </div>`;
  }

  // Unlimited: a round in play, if any, and the record so far.
  const live = restore(store.getUnlimited(), PROMPTS);
  const going = live && !live.done && (live.hole > 0 || live.shot > 0) ? live : null;
  const u = computeUnlimitedStats(store.unlimitedResults());
  const unlimited = `
      <p class="muted">${
        going
          ? `You are on hole ${going.hole + 1} of ${esc(going.course.name)}.`
          : 'A fresh course every round, as many rounds as you like. The shot clock can be switched off.'
      }</p>
      ${u.played ? `<p class="fine">${u.played} ${u.played === 1 ? 'round' : 'rounds'} played · best ${esc(formatRel(u.best))}</p>` : ''}
      <div class="actions">
        ${
          going
            ? `<a class="btn" href="#/unlimited">Carry on</a>
               <a class="btn btn-ghost" href="#/unlimited/new">New round</a>`
            : `<a class="btn" href="#/unlimited/new">Play unlimited</a>`
        }
      </div>`;

  root.innerHTML = `
  <section class="home page">
    <div class="hero">
      <p class="eyebrow">Word golf</p>
      <h1 class="wordmark">Fairllion</h1>
      <p class="lede">Six holes. One category per shot. The rarer your answer, the farther the ball flies.</p>
    </div>

    <figure class="plate">
      <canvas class="map" aria-hidden="true"></canvas>
      <figcaption>${esc(course.name)} · ${esc(moodFor(dailySeed(key)).name)} · No. 1, ${esc(first.name)}, par ${first.par}</figcaption>
    </figure>

    <div class="modes">
      <div class="card today mode">
        <p class="eyebrow">Daily No. ${dailyNumber(key)} · ${esc(longDate(key))}</p>
        <h2>Daily <span class="muted">${esc(course.name)}, par ${course.par}</span></h2>
        ${today}
        ${streak > 1 ? `<p class="fine">You are on a ${streak}-day streak.</p>` : ''}
      </div>
      <div class="card today mode">
        <p class="eyebrow">Play on</p>
        <h2>Unlimited</h2>
        ${unlimited}
      </div>
    </div>

    <div class="steps">
      <div class="card step">
        <p class="step-no">1</p>
        <h3>Read the category</h3>
        <p>Every shot asks for one thing: a chemical element, a river, a type of pasta. You have ${SHOT_CLOCK} seconds.</p>
      </div>
      <div class="card step">
        <p class="step-no">2</p>
        <h3>Choose how rare to go</h3>
        <p>An answer everybody gives is a chip. One hardly anyone would think of is a full drive. Match the club to the yards you have left.</p>
      </div>
      <div class="card step">
        <p class="step-no">3</p>
        <h3>Swing</h3>
        <p>Right club and you are on the green. On the green, the most obvious answer you can think of sinks the putt.</p>
      </div>
    </div>

    <h2>The bag</h2>
    <p class="muted">Five kinds of answer, five clubs. ${esc(CLUBS[0].rarity)} answers travel least, ${esc(CLUBS[4].rarity.toLowerCase())} answers most.</p>
    ${clubTable()}

    <div class="card code">
      <h2>Play a friend's round</h2>
      <p class="muted">Every unlimited round has a code. The same code deals the same holes and categories, so you can compare cards.</p>
      <form class="answer" id="h-code" novalidate>
        <label class="sr-only" for="h-code-input">Round code</label>
        <input id="h-code-input" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12" placeholder="Round code">
        <button class="btn btn-ghost" type="submit">Play this code</button>
      </form>
      <p class="feedback" id="h-code-note" role="status" aria-live="polite"></p>
    </div>
  </section>`;

  const renderer = createRenderer($('.map', root), { markers: false });
  renderer.setHole(first);

  $('#h-code', root).addEventListener('submit', (event) => {
    event.preventDefault();
    const code = cleanCode($('#h-code-input', root).value);
    if (!code) {
      $('#h-code-note', root).textContent = 'A round code is three to twelve letters and digits.';
      return;
    }
    location.hash = `#/unlimited/${code}`;
  });

  return () => renderer.destroy();
}
