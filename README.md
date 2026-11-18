# Fairllion

Word golf. Three holes, one category per shot, and the rarer your answer, the farther the ball flies.

Fairllion is an original game in the word-golf genre. It is a static site with no build step, no dependencies and no server-side code: everything runs in the browser, and rounds are saved in `localStorage`.

## Play it

```bash
node serve.mjs
```

Then open http://localhost:5173. (Any static file server works; the files just need to be served over HTTP rather than opened from disk, because the game uses ES modules.)

To publish it, upload `index.html`, `styles.css` and the `src/` folder to any static host.

## Test it

```bash
npm test
```

The tests cover the rules, answer matching, every answer card (no clashes, every spelling findable, closed sets complete), course generation, and several hundred simulated rounds.

## How the game works

- **Clubs.** Every answer on a category's card sits in one of five tiers: Crowd (chip, 1–50 yds), Familiar (wedge, 51–110), Sharp (iron, 111–170), Deep cut (wood, 171–230) and One in a million (driver, 231–300).
- **Shots.** If the pin is inside the club's reach, the ball finds the green. Otherwise it flies its own distance, fixed by a hash of the category and the answer, so the same answer always does the same thing for everyone.
- **Putting.** Within 15 yards of the pin only a Crowd answer drops; rarer answers roll past.
- **Trouble.** Water and the hazard behind the green cost a stroke; sand costs a club.
- **Rounds.** The daily round is seeded by the local date; practice rounds are seeded by a short code that can be shared.

The full rules are on the How to play page in the game.

## Layout

| Path | What it holds |
| --- | --- |
| `src/rules.js` | Clubs, lies and shot resolution |
| `src/course.js` | Seeded course generation |
| `src/round.js` | Round state, saving and restoring |
| `src/match.js` | Turning typed text into an answer |
| `src/bank/` | The answer cards |
| `src/render.js` | The hole map and ball animation (canvas) |
| `src/ui/` | The screens |
| `tests/` | Node test suite |

## Adding a category

Add an entry to one of the files in `src/bank/`:

```js
{
  id: 'big-cats',
  q: 'Name a big cat',
  tiers: [
    'Lion, Tiger',            // Crowd
    'Leopard, Cheetah',       // Familiar
    'Jaguar, Cougar|Puma',    // Sharp ("A|B" lists alternative spellings)
    '...',                    // Deep cut
    '...',                    // One in a million
  ],
}
```

Each tier needs at least three answers. Optional fields: `strip` (filler words to ignore, such as `['river']`), `people` (a full name finds a surname) and `keepArticle`. Run `npm test` afterwards; it will flag clashes and anything unreachable.

## Worth knowing

- The rarity tiers are editorial: each card was sorted by hand. They are not measured from player data.
- There is no multiplayer and no account system. Comparing scores works by sharing the copied scorecard or a practice-round code.
- Daily No. 1 is 13 November 2026 (`EPOCH` in `src/daily.js`).
