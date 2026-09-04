# PBA 12–0 Challenge

A PBA (Philippine Basketball Association) spin on the "NBA 82-0" fantasy challenge.

Spin into a real PBA year + team + conference, draft one import (locked to that
team/season) plus a starting five and sixth man from that team's **real**
historical roster, then simulate a 12-game elimination round and a randomly
generated, PBA-format playoff bracket (twice-to-beat QF → best-of-5 SF →
best-of-7 Finals). Try to run the table.

## Running it locally

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL. To produce a production build:

```bash
npm run build
npm run preview   # sanity-check the build locally
```

## Publishing with GitHub Desktop

1. In GitHub Desktop: **File → Add Local Folder** → select this folder.
2. Publish the repository (public or private, your call).
3. To host it live for free on **GitHub Pages**:
   - Push a `dist/` build, or better, add a `gh-pages` deploy step (e.g. the
     `gh-pages` npm package, or a GitHub Actions workflow that runs
     `npm run build` and publishes `dist/`).
   - In your repo's Settings → Pages, point Pages at the branch that has the
     built `dist/` contents.
   - `vite.config.js` already uses `base: './'` (relative paths), so the
     build works from a GitHub Pages project subpath without extra config.

## Project structure

```
src/
  data/
    seasons.js      <- ALL real PBA season/roster/stat data lives here
    cpuTeams.js      <- the 11 CPU opponent franchises + randomizer
  lib/
    ratings.js       <- turns real stat lines into 0-99 overalls
    simulate.js       <- game / series / playoff-bracket simulation
  components/
    PlayerAvatar.jsx  <- stylized player badge (see "About player photos")
    PlayerCard.jsx
    SpinDial.jsx
  App.jsx             <- the whole game flow (spin -> draft -> season -> playoffs -> recap)
```

## About the data — "deep but narrow"

Real, verified stats for every PBA team/conference/import from the 2000s to
today would be thousands of data points — more than could responsibly be
hand-verified in one pass. So this starter set ships **8 real, researched
championship team-seasons**, spanning 2003–2024 and all three conference
types (Philippine/All-Filipino, Commissioner's, Governors'):

| Year | Team | Conference | Import |
|---|---|---|---|
| 2003 | Talk 'N Text Phone Pals | All-Filipino | — (no import) |
| 2012 | Rain or Shine Elasto Painters | Governors' | Marqus Blakely |
| 2013 | Alaska Aces | Commissioner's | Robert Dozier |
| 2016 | Barangay Ginebra San Miguel | Governors' | Justin Brownlee |
| 2017 | San Miguel Beermen | Commissioner's | Charles Rhodes |
| 2018 | Magnolia Hotshots | Governors' | Romeo Travis |
| 2021 | TNT Tropang Giga | All-Filipino | — (no import) |
| 2024 | San Miguel Beermen | Commissioner's | Bennie Boatwright |

Each entry's `sourceNote` in `src/data/seasons.js` says exactly which numbers
are a real box score / series average vs. an approximate season average
compiled from public records (full per-game logs for older conferences
aren't all publicly archived).

**To add more seasons:** copy the shape of any object in the `SEASONS` array
in `src/data/seasons.js`. Nothing else needs to change — the drafting UI,
rating engine, and simulator all read from that array automatically.

## About player photos

Real PBA player photos are copyrighted, so this build renders every player
as a stylized, team-colored initials badge (`PlayerAvatar.jsx`) instead of a
photo — safe to publish publicly on GitHub as-is.

When you're ready to add your own **licensed** photos:
1. Drop image files into `public/players/` (e.g. `public/players/brownlee.jpg`).
2. Pass a `photoSrc` prop to `<PlayerAvatar />` (e.g. in `PlayerCard.jsx` and
   the spots in `App.jsx` that render avatars) pointing at `/players/brownlee.jpg`.
3. The badge automatically falls back to the stylized initials if an image
   is missing or fails to load, so you can migrate players one at a time.

## Extending the simulation

- `src/lib/ratings.js` — tune how stat lines translate to 0-99 overalls, or
  how much weight the import gets vs. the starting five.
- `src/lib/simulate.js` — tune scoring variance, or change the playoff
  format (currently modern-PBA-style: twice-to-beat QF, Bo5 SF, Bo7 F).
- `src/data/cpuTeams.js` — add/remove the CPU opponent pool, or change how
  their random strength ratings are generated.

---
Unofficial fan project — not affiliated with the PBA.
