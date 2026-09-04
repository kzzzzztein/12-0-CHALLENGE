// ---------------------------------------------------------------------------
// SIMULATION ENGINE
// One box-score-flavored single game sim, series sims, and a PBA-style
// playoff bracket (twice-to-beat QF, best-of-5 SF, best-of-7 F).
// ---------------------------------------------------------------------------

function gaussian(rand) {
  // Box-Muller, using the supplied PRNG so results are reproducible per seed.
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simulate one game between two overall ratings. Returns {aScore, bScore, aWin}.
export function simulateGame(overallA, overallB, rand = Math.random) {
  const base = 96; // typical PBA team point total
  const gap = (overallA - overallB) * 0.75;
  const noiseA = gaussian(rand) * 8.5;
  const noiseB = gaussian(rand) * 8.5;
  let aScore = Math.round(base + gap / 2 + noiseA);
  let bScore = Math.round(base - gap / 2 + noiseB);
  aScore = Math.max(68, aScore);
  bScore = Math.max(68, bScore);
  if (aScore === bScore) aScore += 1; // no ties in basketball
  return { aScore, bScore, aWin: aScore > bScore };
}

// Simulate a full 12-game elimination-round slate against 11 CPU opponents
// (repeat-schedule padded/trimmed to exactly 12 games).
export function simulateEliminationRound(userOverall, opponents, rand) {
  const games = [];
  const schedule = [...opponents];
  while (schedule.length < 12) schedule.push(opponents[schedule.length % opponents.length]);
  const twelve = schedule.slice(0, 12);
  twelve.forEach((opp) => {
    const g = simulateGame(userOverall, opp.overall, rand);
    games.push({ opponent: opp, ...g, userWin: g.aWin });
  });
  return games;
}

// Best-of-N series simulator. Returns {winner: 'A'|'B', gamesA, gamesB, log}
function simulateSeries(overallA, overallB, winsNeeded, rand, teamAName, teamBName) {
  let gamesA = 0, gamesB = 0;
  const log = [];
  while (gamesA < winsNeeded && gamesB < winsNeeded) {
    const g = simulateGame(overallA, overallB, rand);
    if (g.aWin) gamesA++; else gamesB++;
    log.push({ ...g, teamAName, teamBName });
  }
  return { winner: gamesA > gamesB ? "A" : "B", gamesA, gamesB, log };
}

// Twice-to-beat: higher seed needs 1 win, lower seed needs 2 wins.
function simulateTwiceToBeat(overallHigh, overallLow, rand, highName, lowName) {
  let highWins = 0, lowWins = 0;
  const log = [];
  while (highWins < 1 && lowWins < 2) {
    const g = simulateGame(overallHigh, overallLow, rand);
    if (g.aWin) highWins++; else lowWins++;
    log.push({ ...g, teamAName: highName, teamBName: lowName });
  }
  return { winner: highWins >= 1 ? "high" : "low", highWins, lowWins, log };
}

// Build an 8-team playoff bracket from final standings (array sorted best->worst,
// each {name, overall, isUser}), run twice-to-beat QF -> Bo5 SF -> Bo7 F.
export function simulatePlayoffs(standingsTop8, rand) {
  const seeds = standingsTop8; // index 0 = 1 seed ... index 7 = 8 seed
  const pairs = [
    [0, 7], [3, 4], [1, 6], [2, 5],
  ]; // 1v8, 4v5, 2v7, 3v6 - standard bracket

  const qfResults = pairs.map(([hi, lo]) => {
    const high = seeds[hi], low = seeds[lo];
    const res = simulateTwiceToBeat(high.overall, low.overall, rand, high.name, low.name);
    return {
      round: "Quarterfinals",
      high, low,
      winner: res.winner === "high" ? high : low,
      score: `${res.winner === "high" ? res.highWins : res.lowWins}-${res.winner === "high" ? res.lowWins : res.highWins}`,
      log: res.log,
    };
  });

  const sfPairs = [
    [qfResults[0].winner, qfResults[1].winner],
    [qfResults[2].winner, qfResults[3].winner],
  ];
  const sfResults = sfPairs.map(([a, b]) => {
    const res = simulateSeries(a.overall, b.overall, 3, rand, a.name, b.name); // Bo5
    return {
      round: "Semifinals",
      a, b,
      winner: res.winner === "A" ? a : b,
      score: `${res.gamesA}-${res.gamesB}`,
      log: res.log,
    };
  });

  const finalsRes = simulateSeries(
    sfResults[0].winner.overall,
    sfResults[1].winner.overall,
    4,
    rand,
    sfResults[0].winner.name,
    sfResults[1].winner.name
  ); // Bo7
  const finals = {
    round: "Finals",
    a: sfResults[0].winner,
    b: sfResults[1].winner,
    winner: finalsRes.winner === "A" ? sfResults[0].winner : sfResults[1].winner,
    score: `${finalsRes.gamesA}-${finalsRes.gamesB}`,
    log: finalsRes.log,
  };

  return { qfResults, sfResults, finals };
}
