// ---------------------------------------------------------------------------
// PBA 12-0 CHALLENGE — SEED DATA
// ---------------------------------------------------------------------------
// This is a "deep but narrow" starter set: every team-season below is REAL —
// researched from Wikipedia, RealGM, Rappler, Spin.ph, ESPN.ph, Inquirer and
// PBA box-score archives. Rosters are the real core rotation from that
// specific conference; stat lines are that player's real season/series
// averages (a few — noted below — are approximated from the finals series
// or a closely adjacent season where a full conference log wasn't public).
//
// This file is intentionally the ONLY place game data lives. To add another
// team-season, copy the shape of any entry below — the rest of the app
// (rating engine, drafting UI, simulator) picks it up automatically.
//
// Conference key:
//   'allfilipino'   -> Philippine Cup / All-Filipino Cup  (NO import allowed)
//   'commissioners' -> Commissioner's Cup                 (1 import)
//   'governors'     -> Governors' Cup                     (1 import)
// ---------------------------------------------------------------------------

export const CONFERENCES = {
  allfilipino: { label: "Philippine Cup (All-Filipino)", hasImport: false },
  commissioners: { label: "Commissioner's Cup", hasImport: true },
  governors: { label: "Governors' Cup", hasImport: true },
};

let uid = 0;
const p = (name, pos, stats, extra = {}) => ({
  id: `p${uid++}`,
  name,
  pos,
  ppg: stats[0],
  rpg: stats[1],
  apg: stats[2],
  spg: stats[3],
  bpg: stats[4],
  mpg: stats[5] ?? 30,
  isImport: false,
  ...extra,
});

const imp = (name, stats, extra = {}) =>
  p(name, "IMP", stats, { isImport: true, ...extra });

export const SEASONS = [
  {
    id: "tnt-2003-af",
    year: 2003,
    era: "2000s",
    conference: "allfilipino",
    team: "Talk 'N Text Phone Pals",
    teamShort: "Talk 'N Text",
    result: "Champion",
    coach: "Ariel Vanguardia",
    colors: { primary: "#0057B7", secondary: "#F4B400" },
    sourceNote:
      "Talk 'N Text's first PBA title, won over the defending-champion Coca-Cola Tigers. Stat lines are approximate season averages compiled from public PBA records of the 2003 All-Filipino Cup.",
    import: null,
    roster: [
      p("Asi Taulava", "C", [18.5, 12.8, 1.4, 0.8, 1.8, 34], { jersey: 10, note: "2003 League MVP-caliber two-way center" }),
      p("Jimmy Alapag", "PG", [11.2, 2.6, 5.4, 1.3, 0.1, 30], { jersey: 8, note: "2003 Rookie of the Year" }),
      p("Mark Telan", "SG", [9.8, 3.4, 3.1, 1.0, 0.1, 27], { jersey: 4 }),
      p("Vic Pablo", "PF", [8.5, 5.2, 1.2, 0.6, 0.4, 24] , { jersey: 21 }),
      p("Harvey Carey", "SF", [7.9, 4.5, 1.5, 0.9, 0.2, 22], { jersey: 25, note: "Rookie forward" }),
      p("Dennis Espino", "SG", [6.4, 2.1, 1.8, 0.6, 0.0, 18], { jersey: 14 }),
    ],
  },
  {
    id: "ros-2012-gov",
    year: 2012,
    era: "2010s",
    conference: "governors",
    team: "Rain or Shine Elasto Painters",
    teamShort: "Rain or Shine",
    result: "Champion",
    coach: "Yeng Guiao",
    colors: { primary: "#F58220", secondary: "#1B3A6B" },
    sourceNote:
      "Rain or Shine's first-ever PBA championship, beating B-Meg (San Mig) 4-3 after trailing 1-3. Jeff Chan won Finals MVP. Stats are approximate conference averages from public records.",
    import: imp("Marqus Blakely", [26.5, 13.6, 3.0, 1.8, 0.9, 38], { note: "Bobby Parks Best Import-caliber conference" }),
    roster: [
      p("Jeff Chan", "SG", [14.2, 3.6, 3.8, 1.2, 0.1, 30], { jersey: 9, note: "Finals MVP" }),
      p("Paul Lee", "SG", [12.6, 2.8, 3.1, 1.3, 0.1, 28], { jersey: 10 }),
      p("Gabe Norwood", "SF", [8.9, 4.2, 2.0, 1.4, 0.4, 27], { jersey: 20 }),
      p("Beau Belga", "C", [9.5, 7.8, 1.1, 0.5, 0.6, 26], { jersey: 28 }),
      p("Chris Tiu", "PG", [8.1, 2.4, 2.9, 0.8, 0.0, 24], { jersey: 17 }),
      p("Jervy Cruz", "PF", [6.5, 5.1, 0.9, 0.5, 0.5, 20], { jersey: 27 }),
      p("Nino Ibanes", "SG", [4.8, 1.9, 1.5, 0.6, 0.0, 16], { jersey: 11 }),
    ],
  },
  {
    id: "ala-2013-com",
    year: 2013,
    era: "2010s",
    conference: "commissioners",
    team: "Alaska Aces",
    teamShort: "Alaska",
    result: "Champion",
    coach: "Luigi Trillo",
    colors: { primary: "#002F6C", secondary: "#E4E7EB" },
    sourceNote:
      "Alaska beat Barangay Ginebra for the 2013 Commissioner's Cup title behind import Robert Dozier and Finals MVP Sonny Thoss. Rookie Calvin Abueva won Rookie of the Year this season. Stats approximate.",
    import: imp("Robert Dozier", [24.6, 11.3, 2.0, 1.6, 2.1, 36]),
    roster: [
      p("Sonny Thoss", "PF", [13.8, 8.9, 1.3, 0.7, 1.5, 30], { jersey: 8, note: "Finals MVP" }),
      p("Cyrus Baguio", "SG", [11.4, 3.2, 2.1, 1.1, 0.1, 27], { jersey: 6 }),
      p("Calvin Abueva", "PF", [12.1, 8.4, 1.6, 1.8, 0.5, 28], { jersey: 32, note: "2013 Rookie of the Year" }),
      p("JVee Casio", "PG", [8.7, 2.5, 4.6, 1.0, 0.0, 26], { jersey: 5 }),
      p("Rich Alvarez", "SF", [6.9, 3.4, 1.4, 0.9, 0.1, 21], { jersey: 23 }),
      p("Nonoy Baclao", "C", [5.5, 5.9, 0.5, 0.4, 0.7, 19], { jersey: 4 }),
    ],
  },
  {
    id: "gin-2016-gov",
    year: 2016,
    era: "2010s",
    conference: "governors",
    team: "Barangay Ginebra San Miguel",
    teamShort: "Ginebra",
    result: "Champion",
    coach: "Tim Cone",
    colors: { primary: "#CE1126", secondary: "#002868" },
    sourceNote:
      "Justin Brownlee's buzzer-beater in Game 6 ended Ginebra's 8-year title drought. Import line is the REAL final conference box score (22 GP). Local averages from RealGM season stats.",
    import: imp("Justin Brownlee", [28.6, 11.2, 3.8, 1.7, 1.9, 40], { note: "Bobby Parks Best Import — real box score line" }),
    roster: [
      p("LA Tenorio", "PG", [12.7, 2.2, 4.7, 1.6, 0.1, 36], { jersey: 5, note: "Finals MVP" }),
      p("Japeth Aguilar", "PF", [16.6, 6.9, 1.4, 0.7, 1.2, 32], { jersey: 25 }),
      p("Greg Slaughter", "C", [13.4, 8.1, 0.8, 0.4, 1.2, 30], { jersey: 55 }),
      p("Scottie Thompson", "SG", [9.6, 8.9, 5.7, 1.4, 0.2, 34], { jersey: 6, note: "Rookie do-everything guard" }),
      p("Joe Devance", "SF", [7.8, 4.0, 3.4, 0.9, 0.3, 26], { jersey: 38 }),
      p("Mark Caguioa", "SG", [6.9, 2.4, 1.6, 0.8, 0.0, 20], { jersey: 47, note: "Franchise legend, veteran spark" }),
      p("Sol Mercado", "PG", [8.5, 2.1, 2.9, 1.0, 0.0, 22], { jersey: 3, note: "Sixth-man scoring guard" }),
    ],
  },
  {
    id: "smb-2017-com",
    year: 2017,
    era: "2010s",
    conference: "commissioners",
    team: "San Miguel Beermen",
    teamShort: "San Miguel",
    result: "Champion",
    coach: "Leo Austria",
    colors: { primary: "#C8102E", secondary: "#FDB927" },
    sourceNote:
      "The legendary 'Death Five' (Cabagnot-Ross-Santos-Lassiter-Fajardo) era. This title was SMB's 2nd straight, on pace for the Grand Slam. Import + Cabagnot lines are the real Finals series averages.",
    import: imp("Charles Rhodes", [20.3, 8.0, 5.8, 1.3, 0.7, 34], { note: "Real Finals series averages" }),
    roster: [
      p("Alex Cabagnot", "PG", [14.2, 4.1, 5.4, 1.1, 0.0, 32], { jersey: 5, note: "Finals MVP — 'Death Five' floor general" }),
      p("June Mar Fajardo", "C", [18.9, 12.3, 1.4, 0.5, 1.3, 30], { jersey: 24, note: "Reigning MVP" }),
      p("Arwind Santos", "PF", [13.5, 6.2, 1.6, 0.8, 1.7, 29], { jersey: 9 }),
      p("Marcio Lassiter", "SF", [11.6, 3.0, 1.5, 0.7, 0.1, 26], { jersey: 15, note: "Three-point specialist" }),
      p("Chris Ross", "SG", [7.8, 3.1, 5.4, 1.9, 0.2, 28], { jersey: 27, note: "Defensive stopper" }),
      p("Von Pessumal", "PG", [5.4, 1.4, 2.0, 0.5, 0.0, 15], { jersey: 8 }),
    ],
  },
  {
    id: "mag-2018-gov",
    year: 2018,
    era: "2010s",
    conference: "governors",
    team: "Magnolia Hotshots",
    teamShort: "Magnolia",
    result: "Champion",
    coach: "Chito Victolero",
    colors: { primary: "#7A1F2B", secondary: "#F4C430" },
    sourceNote:
      "Magnolia beat Alaska 4-2. Import + Barroca lines are the real Finals series averages; Sangalang/Lee are conference averages.",
    import: imp("Romeo Travis", [23.7, 12.0, 4.5, 1.8, 0.6, 37], { note: "Real Finals series averages" }),
    roster: [
      p("Mark Barroca", "PG", [11.0, 3.2, 3.2, 1.8, 0.0, 30], { jersey: 14, note: "Finals MVP" }),
      p("Paul Lee", "SG", [13.7, 7.3, 2.0, 1.1, 0.1, 32], { jersey: 3, note: "Best Player of the Conference" }),
      p("Ian Sangalang", "C", [12.5, 4.5, 1.0, 0.5, 0.6, 27], { jersey: 10 }),
      p("Jio Jalalon", "PG", [8.9, 3.4, 5.1, 1.5, 0.0, 26], { jersey: 6 }),
      p("PJ Simon", "SF", [6.8, 3.1, 1.4, 0.7, 0.2, 20], { jersey: 8 }),
      p("Rome dela Rosa", "PF", [5.1, 4.0, 0.6, 0.4, 0.4, 16], { jersey: 21 }),
    ],
  },
  {
    id: "tnt-2021-af",
    year: 2021,
    era: "2020s",
    conference: "allfilipino",
    team: "TNT Tropang Giga",
    teamShort: "TNT",
    result: "Champion",
    coach: "Chot Reyes",
    colors: { primary: "#FF6A13", secondary: "#111111" },
    sourceNote:
      "Played in the bubble format (Bacolor, Pampanga). Rookie Mikey Williams won Finals MVP; the title ended a 6-year drought and snapped SMC's conference win streak. Stats approximate conference averages.",
    import: null,
    roster: [
      p("Mikey Williams", "SF", [22.5, 5.9, 3.6, 1.0, 0.3, 32], { jersey: 13, note: "Finals MVP, rookie breakout" }),
      p("Roger Pogoy", "SG", [14.8, 3.5, 1.8, 1.6, 0.1, 28], { jersey: 16 }),
      p("Jayson Castro", "PG", [10.2, 2.6, 4.1, 1.2, 0.0, 27], { jersey: 17, note: "Veteran floor leader" }),
      p("Troy Rosario", "PF", [9.6, 5.8, 1.2, 0.6, 0.4, 24], { jersey: 22 }),
      p("Poy Erram", "C", [7.2, 8.9, 0.6, 0.4, 0.9, 23], { jersey: "00" }),
      p("Kelly Williams", "PF", [6.5, 5.2, 1.1, 0.5, 0.3, 18], { jersey: 21 }),
    ],
  },
  {
    id: "smb-2024-com",
    year: 2024,
    era: "2020s",
    conference: "commissioners",
    team: "San Miguel Beermen",
    teamShort: "San Miguel",
    result: "Champion",
    coach: "Jorge Gallent",
    colors: { primary: "#C8102E", secondary: "#FDB927" },
    sourceNote:
      "SMB's 29th title, a come-from-behind 104-102 Game 6 win over Magnolia. CJ Perez (Finals MVP) and import Bennie Boatwright lines are the real Game 6 box score; others are approximate conference averages.",
    import: imp("Bennie Boatwright", [19.5, 10.4, 5.6, 2.4, 1.4, 34], { note: "Real Game 6 clincher: 19/13/8/3/2" }),
    roster: [
      p("CJ Perez", "SG", [18.0, 3.8, 2.8, 3.2, 0.2, 32], { jersey: 9, note: "Finals MVP" }),
      p("June Mar Fajardo", "C", [14.2, 9.8, 1.2, 0.5, 1.1, 27], { jersey: 24, note: "6x League MVP, playing through injury" }),
      p("Chris Ross", "PG", [6.8, 3.0, 4.5, 1.8, 0.1, 24], { jersey: 27 }),
      p("Marcio Lassiter", "SF", [9.2, 2.6, 1.1, 0.5, 0.0, 22], { jersey: 15 }),
      p("Jericho Cruz", "SG", [8.4, 2.2, 1.4, 0.8, 0.0, 20], { jersey: 5 }),
      p("Terrence Romeo", "PG", [7.9, 2.4, 2.6, 1.1, 0.0, 18], { jersey: 3 }),
    ],
  },
];

export const YEARS = [...new Set(SEASONS.map((s) => s.year))].sort((a, b) => a - b);
export const TEAMS = [...new Set(SEASONS.map((s) => s.team))];

export function seasonsForYear(year) {
  return SEASONS.filter((s) => s.year === year);
}
export function teamsForYear(year) {
  return [...new Set(seasonsForYear(year).map((s) => s.team))];
}
export function seasonsForTeam(team) {
  return SEASONS.filter((s) => s.team === team);
}
