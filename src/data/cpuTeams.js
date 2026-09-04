// The other 11 PBA franchises your Dream Team has to face. These are real
// franchise names/colors, but since the challenge pits your hand-built
// historical roster against "the league at large" rather than one fixed
// historical season, each gets a randomized strength rating every time you
// start a new challenge — so the 12-game gauntlet and the playoff bracket
// are different every run, just like the prompt asks for "random generated"
// opponents.

export const FRANCHISE_POOL = [
  { name: "San Miguel Beermen", short: "San Miguel", colors: ["#C8102E", "#FDB927"] },
  { name: "Barangay Ginebra San Miguel", short: "Ginebra", colors: ["#CE1126", "#002868"] },
  { name: "TNT Tropang Giga", short: "TNT", colors: ["#FF6A13", "#111111"] },
  { name: "Magnolia Hotshots", short: "Magnolia", colors: ["#7A1F2B", "#F4C430"] },
  { name: "Meralco Bolts", short: "Meralco", colors: ["#7B2D8E", "#F2A900"] },
  { name: "Rain or Shine Elasto Painters", short: "Rain or Shine", colors: ["#F58220", "#1B3A6B"] },
  { name: "Alaska Aces", short: "Alaska", colors: ["#002F6C", "#E4E7EB"] },
  { name: "NLEX Road Warriors", short: "NLEX", colors: ["#00693E", "#FFC72C"] },
  { name: "Phoenix Super LPG", short: "Phoenix", colors: ["#F7941D", "#0A0A0A"] },
  { name: "Converge FiberXers", short: "Converge", colors: ["#E4002B", "#1B1B1B"] },
  { name: "Terrafirma Dyip", short: "Terrafirma", colors: ["#8B5A2B", "#003049"] },
  { name: "Blackwater Bossing", short: "Blackwater", colors: ["#111111", "#E4E7EB"] },
];

// Deterministic-ish pseudo random helper so a "session seed" can reproduce
// a run if desired, while still feeling random each time you start over.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateOpponents(seed = Date.now()) {
  const rand = mulberry32(seed);
  return FRANCHISE_POOL.map((f) => ({
    ...f,
    id: f.short.toLowerCase().replace(/\s+/g, "-"),
    // Overall team strength, randomized 62-94 each session.
    overall: Math.round(62 + rand() * 32),
  }));
}
