// The scorecard shown when a round is over.

import { dailyNumber, dateKey as todayKey, msToMidnight } from '../daily.js';
import { cardFor, promptById } from '../prompts.js';
import { totals } from '../round.js';
import { CLUBS, describeRel, formatRel, scoreName } from '../rules.js';
import { shareText } from '../share.js';
import { computeStats, computeUnlimitedStats } from '../stats.js';
import { store } from '../store.js';
import { $, copyText, esc, scoreMark, tierChip } from './dom.js';

function verdict(diff) {
  if (diff <= -9) return 'Nearly flawless. Very few rounds go this low.';
  if (diff <= -6) return 'A fine round: the right club, hole after hole.';
  if (diff <= -3) return 'Comfortably under par.';
  if (diff <= 0) return 'Tidy golf. A sharper answer here and there and this goes lower.';
  if (diff <= 4) return 'A few loose shots. The cards below show what you could have said.';
  return 'A rough day out. Read the cards below and come back swinging.';
}

function resultText(shot) {
  switch (shot.kind) {
    case 'holed': return shot.putt ? 'Holed the putt' : `Holed from ${shot.carry} yards`;
    case 'green': return shot.putt ? `Putt ran ${shot.leave} yards past` : `On the green, ${shot.leave} yards away`;
    case 'water': return 'In the water, one-stroke penalty';
    case 'beyond': return 'Over the back, one-stroke penalty';
    case 'ob': return 'Out of bounds, one-stroke penalty';
    case 'timeout': return 'Shot clock ran out';
    case 'sand': return `In the sand, ${shot.leave} yards out`;
    case 'rough': return `In the rough, ${shot.leave} yards away`;
    default: return `${shot.carry} yards to the fairway, ${shot.leave} to go`;
  }
}

/** Every answer on a prompt's card, tier by tier, with the player's marked. */
function wholeCard(promptId, given) {
  const card = cardFor(promptId);
  return CLUBS.map((c) => {
    const names = card.answers
      .filter((a) => a.tier === c.tier)
      .map((a) => (a.name === given ? `<mark>${esc(a.name)}</mark>` : esc(a.name)))
      .join(', ');
    return `<p class="tier-line">${tierChip(c.tier)} <span>${names}</span></p>`;
  }).join('');
}

/** "Unlimited rounds played: 12. Best: 4 under par." */
function unlimitedLine() {
  const s = computeUnlimitedStats(store.unlimitedResults());
  if (!s.played) return '';
  return `Unlimited rounds played: <b>${s.played}</b>. Best: ${esc(describeRel(s.best))}. Average: ${esc(formatRel(Math.round(s.average * 10) / 10))}.`;
}

function fmtCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const two = (n) => String(n).padStart(2, '0');
  return `${two(Math.floor(total / 3600))}:${two(Math.floor((total % 3600) / 60))}:${two(total % 60)}`;
}

/**
 * @param options { round, mode: 'daily' | 'unlimited', dateKey, code }
 * @returns cleanup function
 */
export function renderSummary(root, { round, mode, dateKey, code }) {
  const holes = round.course.holes;
  const t = totals(round);
  const pars = holes.map((h) => h.par);
  const scores = round.cards.map((c) => c.score);
  const title = mode === 'daily' ? `Daily No. ${dailyNumber(dateKey)}` : `Unlimited round ${code}`;
  const base = location.href.split('#')[0];
  const link = mode === 'daily' ? base : `${base}#/unlimited/${code}`;

  const rows = holes
    .map(
      (h, i) => `<tr>
        <td class="num">${h.number}</td>
        <td>${esc(h.name)}</td>
        <td class="num">${h.par}</td>
        <td class="num">${h.length}</td>
        <td class="num">${scoreMark(scores[i], h.par)}</td>
        <td class="muted">${round.cards[i].pickedUp ? 'Picked up' : esc(scoreName(scores[i], h.par))}</td>
      </tr>`,
    )
    .join('');

  const review = holes
    .map((h, i) => {
      const shots = round.cards[i].shots
        .map((s) => {
          const prompt = promptById(s.prompt);
          if (!prompt) return '';
          const said = s.answer
            ? `<b>${esc(s.answer)}</b> ${tierChip(s.tier)}`
            : '<b>No answer</b>';
          return `<li>
            <p class="q">${esc(prompt.q)}</p>
            <p class="a">${said} <span class="muted">${esc(resultText(s))}</span></p>
            <details><summary>See the whole card</summary>${wholeCard(s.prompt, s.answer)}</details>
          </li>`;
        })
        .join('');
      return `<section class="hole-review">
        <h3><span>No. ${h.number} · ${esc(h.name)}</span> <span class="muted">Par ${h.par} · ${h.length} yds</span> ${scoreMark(scores[i], h.par)}</h3>
        <ol>${shots}</ol>
      </section>`;
    })
    .join('');

  root.innerHTML = `
  <section class="summary page">
    <p class="eyebrow">${esc(title)} · ${esc(round.course.name)}</p>
    <h1>${t.strokes} strokes, ${describeRel(t.diff)}</h1>
    <p class="lede">${verdict(t.diff)}</p>
    <div class="actions">
      ${
        mode === 'daily'
          ? `<button class="btn" type="button" id="s-share">Copy scorecard</button>
             <a class="btn btn-ghost" href="#/unlimited">Play unlimited</a>`
          : `<a class="btn" href="#/unlimited/new" id="s-next">Next round</a>
             <button class="btn btn-ghost" type="button" id="s-share">Copy scorecard</button>
             <button class="btn btn-ghost" type="button" id="s-link">Copy a link to this round</button>`
      }
      <a class="btn btn-ghost" href="#/">Home</a>
    </div>
    ${mode === 'unlimited' ? `<p class="fine">${unlimitedLine()}</p>` : ''}
    <p class="fine" id="s-note" role="status" aria-live="polite">${mode === 'daily' ? 'The next daily round starts in <b id="s-count"></b>.' : 'Send the link to a friend: the same code deals the same six holes and categories.'}</p>
    <textarea class="manual" id="s-manual" rows="5" readonly hidden aria-label="Text to copy"></textarea>

    <div class="table-wrap">
      <table class="scorecard">
        <thead><tr><th class="num">Hole</th><th>Name</th><th class="num">Par</th><th class="num">Yards</th><th class="num">Score</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr>
          <td></td><td>Total</td>
          <td class="num">${t.par}</td>
          <td class="num">${holes.reduce((n, h) => n + h.length, 0)}</td>
          <td class="num"><b>${t.strokes}</b></td>
          <td><b>${formatRel(t.diff)}</b></td>
        </tr></tfoot>
      </table>
    </div>

    <h2>Shot by shot</h2>
    <p class="muted">Open any card to see everything that was on it, from what everybody says to what hardly anyone would.</p>
    ${review}
  </section>`;

  const note = $('#s-note', root);
  const manual = $('#s-manual', root);
  const say = (text) => {
    note.textContent = text;
  };
  /** Copy, or if the browser refuses, show the text ready to be copied by hand. */
  const copy = async (text, done) => {
    if (await copyText(text)) {
      manual.hidden = true;
      say(done);
      return;
    }
    manual.hidden = false;
    manual.value = text;
    manual.focus();
    manual.select();
    say('This browser would not copy it for you. It is selected below: copy it from there.');
  };

  $('#s-share', root).addEventListener('click', async () => {
    const extra = [];
    if (mode === 'daily') {
      const { streak } = computeStats(store.results(), todayKey());
      if (streak > 1) extra.push(`${streak}-day streak`);
    }
    extra.push(link);
    const text = shareText({
      title: mode === 'daily' ? `Fairllion Daily No. ${dailyNumber(dateKey)}` : `Fairllion unlimited round ${code}`,
      pars,
      scores,
      extra,
    });
    await copy(text, 'Scorecard copied. It gives nothing away about the answers.');
  });

  $('#s-link', root)?.addEventListener('click', () => copy(link, 'Link copied.'));

  let timer = 0;
  const count = $('#s-count', root);
  if (count) {
    const paint = () => {
      const el = $('#s-count', root);
      if (el) el.textContent = fmtCountdown(msToMidnight());
    };
    paint();
    timer = setInterval(paint, 1000);
  }
  return () => clearInterval(timer);
}
