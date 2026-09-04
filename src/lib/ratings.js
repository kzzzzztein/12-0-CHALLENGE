// ---------------------------------------------------------------------------
// RATING ENGINE
// Converts a real per-game stat line into a 0-99 "overall" so the simulator
// has a single number to compare. Tuned so a legendary import (Brownlee's
// real 28.6/11.2/3.8 line) lands ~99, a reigning MVP big man lands high-80s,
// and a solid role player lands mid-60s to low-70s.
// ---------------------------------------------------------------------------

export function playerOverall(player) {
  const { ppg = 0, rpg = 0, apg = 0, spg = 0, bpg = 0 } = player;
  const raw = 50 + ppg * 1.0 + rpg * 0.75 + apg * 1.05 + spg * 2.1 + bpg * 2.1;
  return Math.max(40, Math.min(99, Math.round(raw)));
}

// A 6-man unit (starting 5 + sixth man). Import gets extra weight since
// PBA reinforced conferences are historically import-dominated.
export function lineupOverall(players) {
  if (!players.length) return 0;
  let weightedSum = 0;
  let weightTotal = 0;
  players.forEach((pl, i) => {
    const ovr = playerOverall(pl);
    // Starters (first 5) count fully, sixth man counts a bit less,
    // imports get a 1.25x multiplier reflecting real-world impact.
    const roleWeight = i < 5 ? 1 : 0.65;
    const importWeight = pl.isImport ? 1.25 : 1;
    const w = roleWeight * importWeight;
    weightedSum += ovr * w;
    weightTotal += w;
  });
  return Math.round(weightedSum / weightTotal);
}

export function ratingTier(ovr) {
  if (ovr >= 95) return { label: "Legendary", color: "#f2d878" };
  if (ovr >= 88) return { label: "Elite", color: "#e8c14a" };
  if (ovr >= 80) return { label: "All-Star", color: "#d94f36" };
  if (ovr >= 72) return { label: "Starter", color: "#7fb37a" };
  if (ovr >= 64) return { label: "Rotation", color: "#8fb8d9" };
  return { label: "Role Player", color: "#cdbfa4" };
}
