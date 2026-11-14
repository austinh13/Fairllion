// Small DOM helpers shared by the screens.

import { CLUBS, formatRel, scoreName } from '../rules.js';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Make any text safe to place in HTML. */
export const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ESCAPES[c]);

export const $ = (selector, root = document) => root.querySelector(selector);

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** A rarity name in its tier's colour. */
export function tierChip(tier) {
  return `<span class="chip" data-tier="${tier}">${esc(CLUBS[tier - 1].rarity)}</span>`;
}

/** How a hole score is marked on the card: circles under par, squares over. */
export function scoreClass(strokes, par) {
  if (strokes === 1) return 'ace';
  const diff = strokes - par;
  if (diff <= -2) return 'eagle';
  if (diff === -1) return 'birdie';
  if (diff === 0) return 'par';
  if (diff === 1) return 'bogey';
  return 'double';
}

/** A hole score drawn the way it would be pencilled on a scorecard. */
export function scoreMark(strokes, par) {
  return `<span class="mark mark-${scoreClass(strokes, par)}" title="${esc(scoreName(strokes, par))}">${strokes}</span>`;
}

export { formatRel };

/** Copy text to the clipboard; resolves to whether it worked. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** The table of clubs, used on the home and rules pages. */
export function clubTable() {
  const rows = CLUBS.map(
    (c) => `<tr>
      <td>${tierChip(c.tier)}</td>
      <td>${esc(c.club)}</td>
      <td class="num">${c.lo}&ndash;${c.hi} yds</td>
      <td class="muted">${esc(c.hint)}</td>
    </tr>`,
  ).join('');
  return `<div class="table-wrap"><table class="clubs">
    <thead><tr><th>Your answer is</th><th>Club</th><th class="num">Reaches</th><th>In plain terms</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}
