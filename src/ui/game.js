// The round in play: map, prompt, shot clock and club guide.

import { describeHazards } from '../course.js';
import { dailyNumber, dailySeed, dateKey as todayKey, unlimitedSeed } from '../daily.js';
import { findAnswer, suggest } from '../match.js';
import { moodFor } from '../mood.js';
import { PROMPTS, cardFor, promptById } from '../prompts.js';
import { createRenderer } from '../render.js';
import { settingOf } from '../setting.js';
import { createRound, currentHole, currentPromptId, nextHole, restore, snapshot, swing, totals, whiff } from '../round.js';
import { BEYOND, CLUBS, GREEN_RADIUS, SHOT_CLOCK, formatRel, outlook, remaining, scoreName, zonesFor } from '../rules.js';
import { sfx } from '../sfx.js';
import { store } from '../store.js';
import { $, clubTable, esc, rarityMeter, scoreClass, scoreMark, tierChip, wait } from './dom.js';

const BEYOND_NAME = { pond: 'the pond', pines: 'the pines', heather: 'the heather' };

/**
 * One sentence on what a shot did.
 * `over` is true when the shot ended the hole, so nothing is played again.
 */
function describe(out, hole, over) {
  const pin = hole.length;
  const penalty = over ? 'One-stroke penalty.' : 'One-stroke penalty; play it again.';
  if (out.kind === 'holed') return out.putt ? 'It drops!' : `Holed from ${out.carry} yards!`;
  if (out.putt) {
    if (out.kind === 'green') return `Too firm. It rolls ${out.leave} yards past the hole.`;
    if (out.kind === 'water') return `Putted clean off the green and into the water. ${penalty}`;
    if (out.kind === 'sand') return `Putted off the green and into the sand, ${out.leave} yards away.`;
    return `Far too firm. It runs off the green, ${out.leave} yards away.`;
  }
  switch (out.kind) {
    case 'green':
      return out.inRange ? `On the green, ${out.leave} yards from the hole.` : `It runs onto the green, ${out.leave} yards from the hole.`;
    case 'fairway':
      return out.from > pin ? `Back over the green. ${out.leave} yards short of the pin now.` : `${out.carry} yards down the fairway. ${out.leave} to go.`;
    case 'rough':
      return out.to > pin ? `Through the green, ${out.leave} yards past the pin.` : `Back behind the tee. ${out.leave} yards to go.`;
    case 'sand':
      return `In the sand, ${out.leave} yards out.${over ? '' : ' The next shot plays a club short.'}`;
    case 'water':
      return `Splash. It came down in the water at ${out.landed} yards. ${penalty}`;
    case 'beyond':
      return `Too much club. ${out.landed - pin} yards long and into ${BEYOND_NAME[hole.beyond]}. ${penalty}`;
    default:
      return `Back past the tee and out of bounds. ${penalty}`;
  }
}

/** A few words on a past shot, for the list under the club guide. */
function brief(shot) {
  switch (shot.kind) {
    case 'holed': return 'in the hole';
    case 'green': return `green, ${shot.leave} yds away`;
    case 'water': return 'water, +1';
    case 'beyond': return 'over the back, +1';
    case 'ob': return 'out of bounds, +1';
    case 'timeout': return 'shot clock, +1';
    default: return `${shot.kind}, ${shot.leave} to go`;
  }
}

function lieLabel(round) {
  const hole = currentHole(round);
  if (remaining(hole, round.pos) <= GREEN_RADIUS) return 'On the green';
  if (round.lie === 'tee') return 'On the tee';
  if (round.lie === 'sand') return 'In the sand';
  if (round.lie === 'rough') return round.pos > hole.length ? 'Behind the green' : 'In the rough';
  return 'On the fairway';
}

function bagText(o, hole, pos) {
  if (o.status === 'drops') return 'Drops the putt';
  if (o.status === 'past') return 'Rolls past the hole';
  if (o.status === 'reach') return 'Reaches the green';
  if (o.status === 'short') return 'Lays up short';
  if (pos > hole.length) return 'Back down the fairway';
  return o.club.carryLo - (hole.length - pos) > BEYOND ? 'Over the back: penalty' : 'Long of the green';
}

/** The same, in a word, for the compact bag on small screens. */
function bagWord(o, hole, pos) {
  if (o.status === 'drops') return '✓ Drops';
  if (o.status === 'past') return 'Rolls past';
  if (o.status === 'reach') return '✓ Green';
  if (o.status === 'short') return 'Short';
  if (pos > hole.length) return 'Back';
  return o.club.carryLo - (hole.length - pos) > BEYOND ? 'Penalty' : 'Long';
}

/** The one line under the prompt: how rare an answer reaches the green from here. */
function advice(hole, pos, lie) {
  const r = remaining(hole, pos);
  const name = (c) => `${tierChip(c.tier)} ${rarityMeter(c.tier)}`;
  if (r <= GREEN_RADIUS) return { lead: `${r} yds, on the green.`, rest: `Only ${name(CLUBS[0])} drops.` };
  const all = CLUBS.map((c) => ({ c, o: outlook(hole, pos, lie, c.tier) }));
  const good = all.filter((x) => x.o.status === 'reach');
  if (good.length) return { lead: `${r} to the pin.`, rest: `Go ${good.map((x) => name(x.c)).join(' or ')}` };
  const best = all.filter((x) => x.o.status === 'short').at(-1);
  return { lead: `${r} to the pin.`, rest: best ? `Nothing reaches. ${name(best.c)} gets closest.` : 'Every club runs long from here.' };
}

/**
 * @param root      element to render into
 * @param options   { mode: 'daily' | 'unlimited', dateKey, code, onFinish(round) }
 * @returns cleanup function
 */
export function mountGame(root, { mode, dateKey, code, onFinish }) {
  const seed = mode === 'daily' ? dailySeed(dateKey) : unlimitedSeed(code);
  let round = restore(mode === 'daily' ? store.getDaily(dateKey) : store.getUnlimited(), PROMPTS);
  if (!round || round.seed !== seed) round = createRound(seed, PROMPTS);
  if (round.done) {
    onFinish(round);
    return () => {};
  }

  let relaxed = mode === 'unlimited' && store.getSetting('relaxed', false) === true;
  let phase = 'intro';
  let pending = null; // a typo suggestion waiting for a second Enter
  let dead = false;

  const mood = moodFor(seed);

  root.innerHTML = `
  <section class="game" data-mood="${mood.key}">
    <div class="stage">
      <canvas class="map" aria-hidden="true"></canvas>
    </div>
    <div class="hud">
      <header class="hud-top">
        <h1 class="hud-where">
          <span>${mode === 'daily' ? `Daily No. ${dailyNumber(dateKey)}` : `Unlimited ${esc(code)}`}</span>
          <span class="hud-course">${esc(round.course.name)}</span>
          <span id="g-hole"></span>
        </h1>
        <div class="hud-right">
          <ol class="holes" id="g-holes" aria-label="Scorecard so far"></ol>
          ${mode === 'unlimited' ? '<button class="hud-btn" id="g-relax" type="button"></button>' : ''}
          <button class="hud-btn" id="g-rules" type="button">Rules</button>
        </div>
      </header>
      <div class="ask" id="g-ask">
        <p class="ask-eyebrow" id="g-status"></p>
        <h2 class="prompt" id="g-prompt"></h2>
        <details class="ask-more" id="g-more">
          <summary id="g-advice"></summary>
          <div class="ask-drop">
            <ul class="bag" id="g-bag" aria-label="What each kind of answer will do from here"></ul>
            <ol class="log" id="g-log" aria-label="Shots on this hole"></ol>
          </div>
        </details>
      </div>
      <div class="shot" id="g-play">
        <p class="toast" id="g-feedback" role="status" aria-live="polite"></p>
        <form class="answer" id="g-form" autocomplete="off" novalidate>
          <div class="clock" id="g-clock">
            <span class="clock-num" id="g-secs" role="timer" aria-label="Seconds left on the shot clock"></span>
          </div>
          <label class="sr-only" for="g-input">Your answer</label>
          <input id="g-input" name="answer" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" maxlength="60" placeholder="type one answer…">
          <button class="btn btn-swing" id="g-swing" type="submit">Swing</button>
        </form>
      </div>
    </div>
    <div class="overlay" id="g-overlay" hidden></div>
    <dialog class="dialog" id="g-dialog" aria-labelledby="g-dialog-title">
      <h2 id="g-dialog-title">The rules in brief</h2>
      <p>Each shot gives you a category. Type one thing that belongs in it. The rarer your answer, the bigger the club.</p>
      ${clubTable()}
      <ul class="rules-list">
        <li>If the pin is inside your club's reach, the ball finds the green. If not, it flies its own distance.</li>
        <li>On the green, only a <b>Crowd</b> answer drops. Anything rarer rolls past.</li>
        <li>Water, the trouble 40 yards behind the green, and out of bounds each cost a stroke, and you play again from the same spot.</li>
        <li>From sand, every answer plays one club shorter.</li>
        <li>An answer that isn't on the card costs nothing but time. Running out of time costs a stroke.</li>
        <li>The most a hole can cost is three over its par.</li>
      </ul>
      <form method="dialog"><button class="btn" type="submit">Back to the round</button></form>
    </dialog>
  </section>`;

  const el = {
    hole: $('#g-hole', root),
    overlay: $('#g-overlay', root),
    holes: $('#g-holes', root),
    clock: $('#g-clock', root),
    secs: $('#g-secs', root),
    advice: $('#g-advice', root),
    more: $('#g-more', root),
    status: $('#g-status', root),
    prompt: $('#g-prompt', root),
    form: $('#g-form', root),
    input: $('#g-input', root),
    swing: $('#g-swing', root),
    feedback: $('#g-feedback', root),
    bag: $('#g-bag', root),
    log: $('#g-log', root),
    dialog: $('#g-dialog', root),
    relax: $('#g-relax', root),
    game: $('.game', root),
    stage: $('.stage', root),
    top: $('.hud-top', root),
    ask: $('#g-ask', root),
    play: $('#g-play', root),
  };
  const renderer = createRenderer($('.map', root));
  document.body.classList.add('is-playing');

  // The course fills the screen; tell the camera which parts the interface covers.
  // (The open club list drops over the course and does not count.)
  function measure() {
    if (dead) return;
    const s = el.stage.getBoundingClientRect();
    const top = el.ask.getBoundingClientRect();
    const form = el.form.getBoundingClientRect();
    renderer.setInsets?.({
      top: Math.max(0, top.bottom - s.top),
      bottom: Math.max(0, s.bottom - form.top),
    });
    // On wide screens the club guide sits down the left edge, just under the prompt.
    el.game.style.setProperty('--drop-top', `${Math.round(top.bottom - s.top + 10)}px`);
  }
  const watcher = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
  for (const node of [el.stage, el.top, el.ask, el.form]) watcher?.observe(node);

  // Keep the round above an on-screen keyboard.
  const vv = window.visualViewport;
  function fitViewport() {
    if (!vv) return;
    el.game.style.height = `${Math.round(vv.height)}px`;
    el.game.style.transform = vv.offsetTop ? `translateY(${Math.round(vv.offsetTop)}px)` : '';
  }
  vv?.addEventListener('resize', fitViewport);
  vv?.addEventListener('scroll', fitViewport);
  fitViewport();

  // ---- shot clock ---------------------------------------------------------

  const clock = { total: SHOT_CLOCK * 1000, left: SHOT_CLOCK * 1000, running: false, last: 0 };

  function paintClock() {
    el.clock.hidden = relaxed;
    // The ring empties in chunky steps, like everything else here.
    const ratio = Math.max(0, clock.left / clock.total);
    el.clock.style.setProperty('--left', String(Math.ceil(ratio * 30) / 30));
    const secs = Math.max(0, Math.ceil(clock.left / 1000));
    if (el.secs.textContent !== String(secs)) el.secs.textContent = String(secs);
    el.clock.classList.toggle('is-low', clock.running && secs <= 7);
  }

  function startClock() {
    clock.left = clock.total;
    clock.last = performance.now();
    clock.running = !relaxed;
    paintClock();
  }

  function stopClock() {
    clock.running = false;
    paintClock();
  }

  const ticker = setInterval(() => {
    if (!clock.running) return;
    const now = performance.now();
    if (!el.dialog.open) clock.left -= now - clock.last;
    clock.last = now;
    paintClock();
    if (clock.left <= 0) {
      clock.running = false;
      timeUp();
    }
  }, 100);

  // ---- painting -----------------------------------------------------------

  function persist() {
    if (mode === 'daily') store.setDaily(dateKey, snapshot(round));
    else store.setUnlimited(snapshot(round));
  }

  function setFeedback(html, tone = '') {
    el.feedback.className = `toast ${tone ? `is-${tone}` : ''}`;
    el.feedback.innerHTML = html;
  }

  function lock(locked) {
    el.input.disabled = locked;
    el.swing.disabled = locked;
  }

  function paintHoles() {
    const t = totals(round);
    el.holes.innerHTML =
      round.course.holes
        .map((h, i) => {
          const card = round.cards[i];
          const mark = card.score != null ? scoreMark(card.score, h.par) : '<span class="mark mark-empty">&ndash;</span>';
          return `<li class="${i === round.hole ? 'is-current' : ''}"><span class="h-no">${h.number}</span><span class="h-par">Par ${h.par}</span>${mark}</li>`;
        })
        .join('') +
      `<li class="h-total"><span class="h-no">Total</span><span class="h-par">${t.holes ? formatRel(t.diff) : '&ndash;'}</span><span class="mark mark-plain">${t.holes ? t.strokes : '&ndash;'}</span></li>`;
  }

  function paintHud() {
    const hole = currentHole(round);
    el.hole.textContent = `Hole ${hole.number} of ${round.course.holes.length}`;
    el.status.textContent = `Hole ${hole.number} · Par ${hole.par} · Shot ${round.strokes + 1} · ${lieLabel(round)}`;
    const a = advice(hole, round.pos, round.lie);
    el.advice.innerHTML = `<b>${esc(a.lead)}</b> ${a.rest}`;
  }

  function paintBag() {
    const hole = currentHole(round);
    el.bag.innerHTML = CLUBS.map((c) => {
      const o = outlook(hole, round.pos, round.lie, c.tier);
      const club = o.putt ? 'Putter' : `${o.club.club} · ${o.club.lo}–${o.club.hi} yds`;
      const good = o.status === 'reach' || o.status === 'drops';
      return `<li class="${good ? 'is-good' : ''}" data-tier="${c.tier}" title="${esc(club)}">
        <span class="swatch"></span>
        <span class="bag-rarity">${esc(c.rarity)}</span>
        ${rarityMeter(c.tier).replace('class="meter"', 'class="meter bag-meter"')}
        <span class="bag-short" aria-hidden="true">${esc(c.short)}</span>
        <span class="bag-word" aria-hidden="true">${esc(bagWord(o, hole, round.pos))}</span>
        <span class="bag-club">${esc(club)}</span>
        <span class="bag-status">${esc(bagText(o, hole, round.pos))}</span>
      </li>`;
    }).join('');
  }

  function paintLog() {
    const shots = round.cards[round.hole].shots;
    el.log.hidden = shots.length === 0;
    el.log.innerHTML = shots
      .map((s) => `<li>${s.answer ? `<b>${esc(s.answer)}</b> ${tierChip(s.tier)}` : '<b>No answer</b>'} <span>${esc(brief(s))}</span></li>`)
      .join('');
  }

  function showOverlay(html, buttonId, onClick) {
    el.overlay.innerHTML = `<div class="overlay-card card">${html}</div>`;
    el.overlay.hidden = false;
    el.game.classList.add('has-card');
    const button = $(`#${buttonId}`, el.overlay);
    button.addEventListener('click', () => {
      el.overlay.hidden = true;
      el.overlay.innerHTML = '';
      el.game.classList.remove('has-card');
      onClick();
    });
    button.focus({ preventScroll: true });
  }

  // ---- flow ---------------------------------------------------------------

  function showIntro() {
    phase = 'intro';
    const hole = currentHole(round);
    renderer.setHole(hole);
    stopClock();
    clock.left = clock.total;
    paintClock();
    lock(true);
    el.input.value = '';
    setFeedback('');
    paintHoles();
    paintHud();
    paintBag();
    paintLog();
    el.prompt.textContent = 'Ready when you are.';
    const notes = describeHazards(hole).map((l) => `<li>${esc(l)}</li>`).join('');
    showOverlay(
      `<p class="eyebrow">Hole ${hole.number} of ${round.course.holes.length} · Par ${hole.par} · ${esc(settingOf(hole).name)}</p>
       <h2>${esc(hole.name)}</h2>
       ${hole.after ? `<p class="after">Modelled on ${esc(hole.after)}</p>` : ''}
       <p class="yards">${hole.length}<span> yards</span></p>
       <ul class="notes">${notes}</ul>
       <button class="btn" type="button" id="g-go">Tee off</button>
       <p class="fine">${relaxed ? 'The shot clock is off for this round.' : `${SHOT_CLOCK} seconds a shot. The clock starts when you tee off.`}</p>`,
      'g-go',
      beginShot,
    );
  }

  function beginShot() {
    if (dead) return;
    phase = 'aim';
    pending = null;
    const hole = currentHole(round);
    el.prompt.textContent = promptById(currentPromptId(round)).q;
    el.input.value = '';
    lock(false);
    paintHoles();
    paintHud();
    paintBag();
    paintLog();
    renderer.aim(round.pos, zonesFor(hole, round.pos, round.lie));
    startClock();
    el.input.focus({ preventScroll: true });
  }

  async function takeShot(answer) {
    phase = 'busy';
    stopClock();
    lock(true);
    el.more.open = false;
    const hole = currentHole(round);
    const fromSand = round.lie === 'sand' && remaining(hole, round.pos) > GREEN_RADIUS;
    const out = swing(round, answer);
    persist();

    const club = out.putt ? 'Putt' : CLUBS.find((c) => c.key === out.club).club;
    const head = `<b>${esc(answer.name)}</b> ${tierChip(answer.tier)} <span class="muted">${esc(club)}${fromSand && answer.tier > 1 ? ', a club short from sand' : ''}</span>`;
    setFeedback(head);
    if (out.putt) sfx.putt();
    else sfx.swing();

    await renderer.play(out);
    if (dead) return;

    if (out.kind === 'holed') sfx.holed();
    else if (out.kind === 'water' || (out.kind === 'beyond' && hole.beyond === 'pond')) sfx.splash();
    else if (out.penalty) sfx.lost();
    else if (out.kind === 'sand') sfx.sand();
    else sfx.land();

    const tone = out.kind === 'holed' || (out.kind === 'green' && !out.putt) ? 'good' : out.penalty ? 'bad' : '';
    setFeedback(`${head}<br>${esc(describe(out, hole, round.holeOver))}`, tone);
    paintHoles();
    paintLog();
    if (!round.holeOver) {
      paintHud();
      paintBag();
    }
    await wait(round.holeOver ? 900 : 700);
    if (dead) return;
    if (round.holeOver) showHoleResult();
    else beginShot();
  }

  async function timeUp() {
    if (phase !== 'aim' || dead) return;
    phase = 'busy';
    lock(true);
    renderer.clearZones();
    whiff(round);
    persist();
    sfx.bad();
    setFeedback('The shot clock ran out. That costs a stroke.', 'bad');
    paintHoles();
    paintLog();
    await wait(1300);
    if (dead) return;
    if (round.holeOver) showHoleResult();
    else beginShot();
  }

  function showHoleResult() {
    phase = 'result';
    stopClock();
    lock(true);
    renderer.clearZones();
    const hole = currentHole(round);
    const card = round.cards[round.hole];
    const t = totals(round);
    const last = round.hole === round.course.holes.length - 1;
    paintHoles();
    el.prompt.textContent = card.pickedUp ? 'Ball in pocket.' : 'In the hole.';
    showOverlay(
      `<p class="eyebrow">Hole ${hole.number} · ${esc(hole.name)}</p>
       <h2 class="result-name" data-score="${card.pickedUp ? 'double' : scoreClass(card.score, hole.par)}">${card.pickedUp ? 'Picked up' : esc(scoreName(card.score, hole.par))}</h2>
       <p>${card.pickedUp ? `That is the limit: ${card.score} on a par ${hole.par}.` : `${card.score} ${card.score === 1 ? 'stroke' : 'strokes'} on a par ${hole.par}.`}</p>
       <p class="running">Round so far: <b>${t.strokes}</b> (${formatRel(t.diff)}) through ${t.holes}</p>
       <button class="btn" type="button" id="g-next">${last ? 'See the scorecard' : `On to hole ${hole.number + 1}`}</button>`,
      'g-next',
      () => {
        nextHole(round);
        persist();
        if (!round.done) return showIntro();
        const result = {
          scores: round.cards.map((c) => c.score),
          pars: round.course.holes.map((h) => h.par),
          course: round.course.name,
        };
        if (mode === 'daily') store.setResult(dateKey, result);
        else store.addUnlimitedResult({ ...result, code, date: todayKey() });
        onFinish(round);
      },
    );
  }

  // ---- events -------------------------------------------------------------

  el.form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (phase !== 'aim') return;
    const raw = el.input.value.trim();
    if (!raw) return;
    const card = cardFor(currentPromptId(round));
    let answer = findAnswer(card, raw);
    if (!answer && pending && pending.raw === raw) answer = pending.answer;
    if (answer) return void takeShot(answer);

    const guess = suggest(card, raw);
    el.form.classList.remove('shake');
    void el.form.offsetWidth; // restart the animation
    el.form.classList.add('shake');
    if (guess) {
      // Put the answer in the box, so Enter plays exactly what is shown and
      // a near miss can be edited from the right spelling.
      el.input.value = guess.name;
      pending = { raw: guess.name, answer: guess };
      setFeedback(`${esc(raw)} → <b>${esc(guess.name)}</b>. Press Enter to play it, or edit.`, 'hint');
    } else {
      pending = null;
      sfx.bad();
      setFeedback(`<b>${esc(raw)}</b> is not on the card. No stroke lost: try another.`, 'bad');
    }
  });

  el.input.addEventListener('input', () => {
    if (pending && el.input.value.trim() !== pending.raw) pending = null;
  });

  $('#g-rules', root).addEventListener('click', () => {
    if (typeof el.dialog.showModal === 'function') el.dialog.showModal();
  });
  el.dialog.addEventListener('close', () => {
    clock.last = performance.now();
    if (phase === 'aim') el.input.focus({ preventScroll: true });
  });

  function paintRelax() {
    if (!el.relax) return;
    el.relax.textContent = `Shot clock: ${relaxed ? 'off' : 'on'}`;
    el.relax.setAttribute('aria-pressed', String(!relaxed));
  }
  el.relax?.addEventListener('click', () => {
    relaxed = !relaxed;
    store.setSetting('relaxed', relaxed);
    paintRelax();
    if (phase === 'aim') startClock();
    else paintClock();
  });
  paintRelax();

  // ---- start --------------------------------------------------------------

  if (round.holeOver) {
    renderer.setHole(currentHole(round));
    paintHud();
    paintBag();
    paintLog();
    showHoleResult();
  } else if (round.shot === 0) {
    showIntro();
  } else {
    renderer.setHole(currentHole(round));
    setFeedback('Welcome back. The clock has started again.', 'hint');
    beginShot();
  }

  return () => {
    dead = true;
    clearInterval(ticker);
    renderer.destroy();
    if (el.dialog.open) el.dialog.close();
    watcher?.disconnect();
    vv?.removeEventListener('resize', fitViewport);
    vv?.removeEventListener('scroll', fitViewport);
    document.body.classList.remove('is-playing');
  };
}
