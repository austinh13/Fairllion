// Entry point: a small hash router over the screens.

import { cleanCode, dailySeed, dateKey, randomCode } from './daily.js';
import { PROMPTS } from './prompts.js';
import { restore } from './round.js';
import { sfx } from './sfx.js';
import { store } from './store.js';
import { mountGame } from './ui/game.js';
import { renderHome } from './ui/home.js';
import { renderHow, renderStats } from './ui/pages.js';
import { renderSummary } from './ui/summary.js';

const main = document.getElementById('main');
let cleanup = null;
let shown = 0;

function show(title, mount) {
  cleanup?.();
  cleanup = null;
  const mine = ++shown;
  main.innerHTML = '';
  window.scrollTo(0, 0);
  document.title = title ? `${title} · Fairllion` : 'Fairllion · Word golf';
  const undo = mount(main) || null;
  // A screen may hand over to another while it mounts; keep the newer one's cleanup.
  if (mine === shown) cleanup = undo;
  else undo?.();
  const here = (location.hash || '#/').split('/').slice(0, 2).join('/');
  for (const a of document.querySelectorAll('.masthead nav a')) {
    a.toggleAttribute('aria-current', a.getAttribute('href') === here);
  }
}

function showDaily() {
  const key = dateKey();
  const saved = restore(store.getDaily(key), PROMPTS);
  if (saved && saved.done && saved.seed === dailySeed(key)) {
    show('Scorecard', (root) => renderSummary(root, { round: saved, mode: 'daily', dateKey: key }));
    return;
  }
  show('Daily round', (root) =>
    mountGame(root, {
      mode: 'daily',
      dateKey: key,
      onFinish: (round) => show('Scorecard', (r) => renderSummary(r, { round, mode: 'daily', dateKey: key })),
    }),
  );
}

/**
 * Unlimited rounds, one after another.
 *   #/unlimited       carry on with the round in play, or start a new one
 *   #/unlimited/new   start a new one
 *   #/unlimited/CODE  play the round with that code (a friend's, say)
 */
function showUnlimited(arg) {
  if (arg === 'new') {
    location.replace(`#/unlimited/${randomCode()}`);
    return;
  }
  const code = cleanCode(arg);
  if (!code) {
    const saved = restore(store.getUnlimited(), PROMPTS);
    const going = saved && !saved.done ? cleanCode(saved.seed.split('|')[1]) : null;
    location.replace(`#/unlimited/${going || randomCode()}`);
    return;
  }
  show('Unlimited', (root) =>
    mountGame(root, {
      mode: 'unlimited',
      code,
      onFinish: (round) => show('Scorecard', (r) => renderSummary(r, { round, mode: 'unlimited', code })),
    }),
  );
}

function route() {
  const [head, arg] = location.hash.replace(/^#\/?/, '').split('/');
  switch (head) {
    case 'daily':
      return showDaily();
    case 'unlimited':
      return showUnlimited(arg);
    case 'practice':
      // Unlimited rounds used to be practice rounds; keep old links working.
      return location.replace(arg ? `#/unlimited/${arg}` : '#/unlimited');
    case 'how':
      return show('How to play', renderHow);
    case 'stats':
      return show('Stats', renderStats);
    default:
      return show('', renderHome);
  }
}

// Sound switch in the masthead.
const sound = document.getElementById('sound');
function paintSound() {
  sound.textContent = sfx.enabled ? 'Sound on' : 'Sound off';
  sound.setAttribute('aria-pressed', String(sfx.enabled));
}
sound.addEventListener('click', () => {
  sfx.setEnabled(!sfx.enabled);
  paintSound();
  if (sfx.enabled) sfx.putt();
});
paintSound();

window.addEventListener('hashchange', route);
route();
