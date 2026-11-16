# Fairllion

Word golf. Six holes, one category per shot, and the rarer your answer, the farther the ball flies.

Fairllion is an original game in the word-golf genre. It is a static site with no build step and no server-side code: everything runs in the browser, and rounds are saved in `localStorage`. The courses are drawn as 3D voxel landscapes with [three.js](https://threejs.org), which is vendored in `vendor/` along with the two pixel fonts, so nothing is fetched from other sites.

## Play it

```bash
node serve.mjs
```

Then open http://localhost:5173. (Any static file server works; the files just need to be served over HTTP rather than opened from disk, because the game uses ES modules.)

To publish it, upload `index.html`, `styles.css`, `src/` and `vendor/` to any static host.

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
- **Modes.** *Daily* is one round a day, seeded by the local date, the same for everyone, with a streak. *Unlimited* deals a new course every round for as long as you like; each round is seeded by a short code that can be shared, and its scores are kept apart from the daily record.

The full rules are on the How to play page in the game.

## Layout

| Path | What it holds |
| --- | --- |
| `src/rules.js` | Clubs, lies and shot resolution |
| `src/course.js` | Seeded course generation |
| `src/round.js` | Round state, saving and restoring |
| `src/match.js` | Turning typed text into an answer |
| `src/bank/` | The answer cards |
| `src/render.js` | The 3D course: voxel terrain, the golfer, camera moves, ball flight (three.js, WebGL) |
| `src/render2d.js` | The flat map, used when WebGL is unavailable |
| `src/mood.js` | The light and sky each course is played under, picked from its seed |
| `src/setting.js` | The country a hole is laid out in: parkland, links, heathland, mountain, desert, tropical coast, blossom garden or winter fell |
| `src/ui/` | The screens |
| `tests/` | Node test suite |
| `vendor/` | three.js and the fonts, with their licences |

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

- The 3D course is drawn at a low resolution and scaled up with hard edges, so the pixels stay chunky on any screen. Each course gets one of six moods (clear morning, high noon, golden hour, dusk, sea mist, autumn afternoon); everyone playing the same seed sees the same one.
- A course's name gives its country: a "Links" or "Dunes" is a links, a "Heath" or "Moor" is heathland, "Hills" and "Pines" are mountain courses, a "Mesa" is desert, a "Bay" or "Cove" is a tropical coast, a "Garden" is in blossom, a "Fell" is under snow, and the rest are parkland.
- One hole on every course (sometimes two) is modelled on a famous real hole, such as the island green at TPC Sawgrass or the Road Hole at St Andrews. The hole card says which. Hazards sit where the originals' do, but yardages are scaled to fit the game's clubs. The list is `CLASSICS` in `src/course.js`.

- The rarity tiers are editorial: each card was sorted by hand. They are not measured from player data.
- There is no multiplayer and no account system. Comparing scores works by sharing the copied scorecard or an unlimited round's code.
- Daily No. 1 is 13 November 2026 (`EPOCH` in `src/daily.js`).
- Unlimited rounds were first called practice rounds. Their seeds still start `practice|`, and `#/practice/CODE` links redirect to `#/unlimited/CODE`, so old codes deal the same holes.
