// Entry point: a small hash router over the five screens.

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
  for (const a of document.querySelectorAll('.masthead nav a')) {
    a.toggleAttribute('aria-current', a.getAttribute('href') === (location.hash || '#/'));
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

function showPractice(arg) {
  const code = cleanCode(arg);
  if (!code) {
    location.replace(`#/practice/${randomCode()}`);
    return;
  }
  show('Practice round', (root) =>
    mountGame(root, {
      mode: 'practice',
      code,
      onFinish: (round) => show('Scorecard', (r) => renderSummary(r, { round, mode: 'practice', code })),
    }),
  );
}

function route() {
  const [head, arg] = location.hash.replace(/^#\/?/, '').split('/');
  switch (head) {
    case 'daily':
      return showDaily();
    case 'practice':
      return showPractice(arg);
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
