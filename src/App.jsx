import { useMemo, useState } from "react";
import { SEASONS, CONFERENCES } from "./data/seasons";
import { generateOpponents } from "./data/cpuTeams";
import { playerOverall, lineupOverall } from "./lib/ratings";
import { mulberry32, simulateEliminationRound, simulatePlayoffs } from "./lib/simulate";
import PlayerAvatar from "./components/PlayerAvatar";
import PlayerCard from "./components/PlayerCard";
import SpinDial from "./components/SpinDial";

export default function App() {
  const [step, setStep] = useState("hero");
  const [yearSpinsLeft, setYearSpinsLeft] = useState(2);
  const [teamSpinsLeft, setTeamSpinsLeft] = useState(2);
  const [spinning, setSpinning] = useState(false);
  const [season, setSeason] = useState(null);

  const [starters, setStarters] = useState([]); // local player objects only
  const [sixthMan, setSixthMan] = useState(null);

  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [opponents] = useState(() => generateOpponents(sessionSeed));
  const [games, setGames] = useState([]);
  const [gamesRevealed, setGamesRevealed] = useState(0);
  const [standings, setStandings] = useState(null);
  const [playoffResult, setPlayoffResult] = useState(null);

  const rand = useMemo(() => mulberry32(sessionSeed), [sessionSeed]);

  const importReq = season?.import ? 1 : 0;
  const localStartersNeeded = 5 - importReq;
  const startingLineup = season?.import ? [season.import, ...starters] : starters;
  const fullLineup = sixthMan ? [...startingLineup, sixthMan] : startingLineup;
  const rosterComplete = starters.length === localStartersNeeded && !!sixthMan;
  const userOverall = rosterComplete ? lineupOverall(fullLineup) : 0;

  function resetAll() {
    window.location.reload(); // cheap full reset incl. new session seed
  }

  function togglePlayer(pl) {
    if (starters.find((s) => s.id === pl.id)) {
      setStarters(starters.filter((s) => s.id !== pl.id));
      return;
    }
    if (sixthMan?.id === pl.id) {
      setSixthMan(null);
      return;
    }
    if (starters.length < localStartersNeeded) {
      setStarters([...starters, pl]);
    } else if (!sixthMan) {
      setSixthMan(pl);
    }
  }

  function runSeason() {
    const eliminationGames = simulateEliminationRound(userOverall, opponents, rand);
    setGames(eliminationGames);
    setGamesRevealed(0);
    setStep("season");
  }

  function revealNextGame() {
    setGamesRevealed((n) => Math.min(n + 1, games.length));
  }
  function revealAll() {
    setGamesRevealed(games.length);
  }

  const userWins = games.slice(0, gamesRevealed).filter((g) => g.userWin).length;
  const seasonDone = gamesRevealed >= games.length && games.length > 0;
  const perfectElim = seasonDone && userWins === 12;

  function buildStandingsAndPlayoffs() {
    const cpuStandings = opponents.map((o) => {
      const winPct = Math.max(0.05, Math.min(0.95, (o.overall - 50) / 55));
      const noise = (rand() - 0.5) * 3;
      const wins = Math.max(0, Math.min(12, Math.round(winPct * 12 + noise)));
      return { name: o.name, overall: o.overall, colors: o.colors, wins, isUser: false };
    });
    const userRow = { name: "Your Dream Team", overall: userOverall, colors: ["#e8c14a", "#0d1b12"], wins: userWins, isUser: true };
    const all = [...cpuStandings, userRow].sort(
      (a, b) => b.wins - a.wins || b.overall - a.overall
    );
    setStandings(all);
    const top8 = all.slice(0, 8);
    const result = simulatePlayoffs(top8, rand);
    setPlayoffResult(result);
    setStep("playoffs");
  }

  return (
    <div className="min-h-screen court-lines">
      <Header onReset={step !== "hero" ? resetAll : null} />
      {step === "hero" && <Hero onStart={() => setStep("spin")} />}
      {step === "spin" && (
        <SpinScreen
          season={season}
          onLand={setSeason}
          yearSpinsLeft={yearSpinsLeft}
          teamSpinsLeft={teamSpinsLeft}
          setYearSpinsLeft={setYearSpinsLeft}
          setTeamSpinsLeft={setTeamSpinsLeft}
          spinning={spinning}
          setSpinning={setSpinning}
          onContinue={() => setStep("roster")}
        />
      )}
      {step === "roster" && season && (
        <RosterScreen
          season={season}
          starters={starters}
          sixthMan={sixthMan}
          localStartersNeeded={localStartersNeeded}
          togglePlayer={togglePlayer}
          rosterComplete={rosterComplete}
          userOverall={userOverall}
          onContinue={runSeason}
          onBack={() => setStep("spin")}
        />
      )}
      {step === "season" && (
        <SeasonScreen
          season={season}
          games={games}
          gamesRevealed={gamesRevealed}
          revealNextGame={revealNextGame}
          revealAll={revealAll}
          userWins={userWins}
          seasonDone={seasonDone}
          perfectElim={perfectElim}
          onContinue={buildStandingsAndPlayoffs}
        />
      )}
      {step === "playoffs" && playoffResult && (
        <PlayoffScreen
          season={season}
          standings={standings}
          result={playoffResult}
          onContinue={() => setStep("results")}
        />
      )}
      {step === "results" && playoffResult && (
        <ResultsScreen
          season={season}
          userOverall={userOverall}
          userWins={userWins}
          perfectElim={perfectElim}
          result={playoffResult}
          fullLineup={fullLineup}
          onRestart={resetAll}
        />
      )}
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
function Header({ onReset }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-[color:var(--color-court)]/85 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full grid place-items-center font-display text-sm" style={{ background: "var(--color-ember)" }}>
            12
          </div>
          <span className="font-display text-lg tracking-wide">PBA 12–0 CHALLENGE</span>
        </div>
        {onReset && (
          <button onClick={onReset} className="text-xs text-[color:var(--color-ink-dim)] hover:text-white transition">
            ↺ Start Over
          </button>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center text-[11px] text-[color:var(--color-ink-dim)]/60">
      Unofficial fan project. Not affiliated with the PBA. Player stats are real, researched season/series averages
      (see the note on each season card) — a few are approximated where full public logs weren't available.
      Player art is stylized (no photos) pending licensed images.
    </footer>
  );
}

// ---------------------------------------------------------------------------
function Hero({ onStart }) {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-16 pb-14 text-center">
      <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-paint)] mb-4">
        Build the roster. Run the table. Never lose.
      </div>
      <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] mb-6">
        CAN YOU GO
        <br />
        <span style={{ color: "var(--color-ember)" }}>12–0</span> IN THE PBA?
      </h1>
      <p className="text-[color:var(--color-ink-dim)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10">
        Spin into a real PBA conference from the 2000s to today, draft one import and a starting six from that
        team's actual roster, then simulate an undefeated elimination round — and try to survive a randomly
        generated playoff bracket to complete the perfect season.
      </p>
      <button
        onClick={onStart}
        className="font-display text-lg tracking-wide px-10 py-4 rounded-full bg-[color:var(--color-paint)] text-black hover:brightness-105 active:scale-95 transition shadow-xl shadow-black/40"
      >
        START THE CHALLENGE
      </button>
      <div className="mt-14 grid grid-cols-3 gap-4 text-left">
        <StepCallout n="1" title="Spin your era" body="Land on a real year, team, and conference." />
        <StepCallout n="2" title="Draft your six" body="One import + starting five + sixth man." />
        <StepCallout n="3" title="Run the table" body="12 games, then a random playoff gauntlet." />
      </div>
    </section>
  );
}
function StepCallout({ n, title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="font-display text-2xl text-[color:var(--color-paint)] mb-1">{n}</div>
      <div className="font-semibold text-sm mb-1">{title}</div>
      <div className="text-xs text-[color:var(--color-ink-dim)]">{body}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function SpinScreen({ season, onLand, yearSpinsLeft, teamSpinsLeft, setYearSpinsLeft, setTeamSpinsLeft, spinning, setSpinning, onContinue }) {
  const label = (s) => `${s.year}`;

  return (
    <section className="max-w-2xl mx-auto px-6 py-14">
      <SectionTitle eyebrow="Step 1" title="Spin your season" />
      <p className="text-sm text-[color:var(--color-ink-dim)] mb-8 text-center max-w-md mx-auto">
        Every landing spot is a real PBA year, team and conference. This starter set has {SEASONS.length} researched
        championship seasons spanning 2003–2024 — spin to land on one at random. Since each season here is a unique
        year+team+conference bundle, both re-spin buttons roll a new one.
      </p>

      <SpinDial
        items={SEASONS}
        labelFn={label}
        onLand={onLand}
        spinning={spinning}
        setSpinning={setSpinning}
        resultLabel={season ? `${season.year}` : undefined}
      />

      {season && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
          <div className="font-display text-2xl" style={{ color: season.colors.primary }}>{season.team}</div>
          <div className="text-sm text-[color:var(--color-ink-dim)] mt-1">
            {season.year} · {CONFERENCES[season.conference].label} · {season.result}
          </div>
          <div className="text-xs text-[color:var(--color-ink-dim)]/70 mt-3 italic max-w-md mx-auto">{season.sourceNote}</div>
          {season.import ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-ember)]/15 border border-[color:var(--color-ember)]/40 px-3 py-1.5 text-xs">
              🔒 Import locked in: <strong>{season.import.name}</strong>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs">
              All-Filipino Cup — no import this conference
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 mt-6">
        <ReSpinButton
          label="Re-spin Year"
          left={yearSpinsLeft}
          disabled={spinning || !season}
          onClick={() => setYearSpinsLeft((n) => n - 1)}
        />
        <ReSpinButton
          label="Re-spin Team"
          left={teamSpinsLeft}
          disabled={spinning || !season}
          onClick={() => setTeamSpinsLeft((n) => n - 1)}
        />
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={onContinue}
          disabled={!season}
          className="font-display text-base tracking-wide px-8 py-3 rounded-full bg-[color:var(--color-paint)] text-black disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-105 active:scale-95 transition"
        >
          LOCK IN & BUILD ROSTER →
        </button>
      </div>
    </section>
  );
}

function ReSpinButton({ label, left, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || left <= 0}
      className="text-xs px-4 py-2 rounded-full border border-white/15 text-[color:var(--color-ink-dim)] hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      {label} ({left} left)
    </button>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="text-center mb-8">
      <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-paint)] mb-2">{eyebrow}</div>
      <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
    </div>
  );
}

// ---------------------------------------------------------------------------
function RosterScreen({ season, starters, sixthMan, localStartersNeeded, togglePlayer, rosterComplete, userOverall, onContinue, onBack }) {
  const pool = season.roster;
  const colors = [season.colors.primary, season.colors.secondary];

  return (
    <section className="max-w-3xl mx-auto px-6 py-14">
      <SectionTitle eyebrow="Step 2" title="Draft your six" />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 mb-8">
        <div className="text-xs text-[color:var(--color-ink-dim)] mb-3 text-center">
          {season.team} · {season.year} {CONFERENCES[season.conference].label}. Pick {localStartersNeeded} more starter{localStartersNeeded === 1 ? "" : "s"}
          {season.import ? " (your import auto-starts) " : " "}
          and 1 sixth man from the real roster below.
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] mb-2">
          <div className="text-[color:var(--color-ink-dim)]">Starters ({(season.import ? 1 : 0) + starters.length}/5)</div>
          <div className="text-[color:var(--color-ink-dim)]">Sixth Man ({sixthMan ? 1 : 0}/1)</div>
          <div className="text-[color:var(--color-ink-dim)]">Team Overall</div>
        </div>
        <div className="grid grid-cols-3 gap-2 items-center text-center">
          <div className="flex justify-center gap-1 flex-wrap">
            {season.import && <PlayerAvatar player={season.import} colors={colors} size={34} />}
            {starters.map((s) => <PlayerAvatar key={s.id} player={s} colors={colors} size={34} />)}
          </div>
          <div className="flex justify-center">{sixthMan && <PlayerAvatar player={sixthMan} colors={colors} size={34} />}</div>
          <div className="font-display text-2xl" style={{ color: "var(--color-paint)" }}>
            {rosterComplete ? userOverall : "—"}
          </div>
        </div>
      </div>

      {season.import && (
        <div className="mb-4">
          <PlayerCard player={season.import} colors={colors} selected disabled roleLabel="Locked Import" />
        </div>
      )}

      <div className="space-y-2">
        {pool.map((pl) => {
          const isStarter = starters.find((s) => s.id === pl.id);
          const isSixth = sixthMan?.id === pl.id;
          const full = starters.length >= localStartersNeeded && sixthMan && !isStarter && !isSixth;
          return (
            <PlayerCard
              key={pl.id}
              player={pl}
              colors={colors}
              selected={!!isStarter || isSixth}
              disabled={full}
              roleLabel={isStarter ? "Starter" : isSixth ? "Sixth Man" : undefined}
              onClick={() => togglePlayer(pl)}
            />
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-10">
        <button onClick={onBack} className="text-xs text-[color:var(--color-ink-dim)] hover:text-white transition">← Back to spin</button>
        <button
          onClick={onContinue}
          disabled={!rosterComplete}
          className="font-display text-base tracking-wide px-8 py-3 rounded-full bg-[color:var(--color-paint)] text-black disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-105 active:scale-95 transition"
        >
          SIMULATE THE SEASON →
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function SeasonScreen({ season, games, gamesRevealed, revealNextGame, revealAll, userWins, seasonDone, perfectElim, onContinue }) {
  return (
    <section className="max-w-2xl mx-auto px-6 py-14">
      <SectionTitle eyebrow="Step 3" title="Elimination Round" />
      <p className="text-sm text-[color:var(--color-ink-dim)] mb-6 text-center">
        12 games. Can your {season.teamShort} squad run the table?
      </p>

      <div className="flex items-center justify-center gap-6 mb-6">
        <Scoreboard wins={userWins} losses={gamesRevealed - userWins} />
      </div>

      <div className="space-y-2 mb-8">
        {games.slice(0, gamesRevealed).map((g, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl px-4 py-2.5 border text-sm ${
              g.userWin ? "border-[color:var(--color-paint)]/30 bg-[color:var(--color-paint)]/5" : "border-[color:var(--color-ember)]/30 bg-[color:var(--color-ember)]/5"
            }`}
          >
            <span className="text-[color:var(--color-ink-dim)]">Game {i + 1}</span>
            <span className="font-medium">vs {g.opponent.short}</span>
            <span className="font-display">{g.aScore}–{g.bScore}</span>
            <span className={g.userWin ? "text-[color:var(--color-paint)]" : "text-[color:var(--color-ember)]"}>
              {g.userWin ? "W" : "L"}
            </span>
          </div>
        ))}
        {gamesRevealed < games.length && (
          <div className="text-center text-xs text-[color:var(--color-ink-dim)] py-2">
            {games.length - gamesRevealed} game{games.length - gamesRevealed === 1 ? "" : "s"} remaining…
          </div>
        )}
      </div>

      {!seasonDone ? (
        <div className="flex justify-center gap-3">
          <button onClick={revealNextGame} className="text-sm px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition">
            Play Next Game
          </button>
          <button onClick={revealAll} className="font-display text-sm px-6 py-3 rounded-full bg-[color:var(--color-paint)] text-black hover:brightness-105 transition">
            Sim Rest of Season
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className={`font-display text-2xl mb-2 ${perfectElim ? "text-[color:var(--color-paint)]" : ""}`}>
            {perfectElim ? "🏆 UNDEFEATED — 12-0!" : `Final Record: ${userWins}-${games.length - userWins}`}
          </div>
          <p className="text-xs text-[color:var(--color-ink-dim)] mb-6">
            {perfectElim
              ? "You ran the elimination round table. Now survive the randomly generated playoff bracket."
              : "The streak's broken, but you can still play out the playoffs and see how far this team goes."}
          </p>
          <button
            onClick={onContinue}
            className="font-display text-base tracking-wide px-8 py-3 rounded-full bg-[color:var(--color-ember)] hover:brightness-110 active:scale-95 transition"
          >
            GENERATE PLAYOFF BRACKET →
          </button>
        </div>
      )}
    </section>
  );
}

function Scoreboard({ wins, losses }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 px-8 py-4 flex items-center gap-6 animate-flicker">
      <div className="text-center">
        <div className="font-display text-4xl text-[color:var(--color-paint)]">{wins}</div>
        <div className="text-[10px] uppercase tracking-widest text-[color:var(--color-ink-dim)]">Wins</div>
      </div>
      <div className="text-2xl text-[color:var(--color-ink-dim)]">–</div>
      <div className="text-center">
        <div className="font-display text-4xl text-[color:var(--color-ember)]">{losses}</div>
        <div className="text-[10px] uppercase tracking-widest text-[color:var(--color-ink-dim)]">Losses</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function PlayoffScreen({ season, standings, result, onContinue }) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-14">
      <SectionTitle eyebrow="Step 4" title="Randomly Generated Playoffs" />
      <p className="text-sm text-[color:var(--color-ink-dim)] mb-8 text-center max-w-lg mx-auto">
        Top 8 of a randomly generated 12-team league. Quarterfinals are twice-to-beat, semis are best-of-5, the finals are best-of-7 — real PBA playoff format.
      </p>

      <div className="mb-10 overflow-x-auto">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-ink-dim)] mb-2 text-center">Final Standings (top 8 clinch)</div>
        <div className="max-w-md mx-auto space-y-1">
          {standings.slice(0, 8).map((t, i) => (
            <div
              key={t.name}
              className={`flex items-center justify-between text-sm px-3 py-1.5 rounded-lg ${t.isUser ? "bg-[color:var(--color-paint)]/15 border border-[color:var(--color-paint)]/40" : "bg-white/[0.03]"}`}
            >
              <span className="text-[color:var(--color-ink-dim)] w-5">{i + 1}</span>
              <span className="flex-1 truncate">{t.isUser ? `Your ${season.teamShort} Squad` : t.name}</span>
              <span className="font-display">{t.wins}-{12 - t.wins}</span>
            </div>
          ))}
        </div>
      </div>

      <BracketRound title="Quarterfinals (Twice-to-Beat)" matches={result.qfResults.map((m) => ({
        a: m.high.isUser ? `Your ${season.teamShort} Squad` : m.high.name,
        b: m.low.isUser ? `Your ${season.teamShort} Squad` : m.low.name,
        winner: m.winner.isUser ? `Your ${season.teamShort} Squad` : m.winner.name,
        score: m.score,
      }))} />
      <BracketRound title="Semifinals (Best-of-5)" matches={result.sfResults.map((m) => ({
        a: m.a.isUser ? `Your ${season.teamShort} Squad` : m.a.name,
        b: m.b.isUser ? `Your ${season.teamShort} Squad` : m.b.name,
        winner: m.winner.isUser ? `Your ${season.teamShort} Squad` : m.winner.name,
        score: m.score,
      }))} />
      <BracketRound title="Finals (Best-of-7)" matches={[{
        a: result.finals.a.isUser ? `Your ${season.teamShort} Squad` : result.finals.a.name,
        b: result.finals.b.isUser ? `Your ${season.teamShort} Squad` : result.finals.b.name,
        winner: result.finals.winner.isUser ? `Your ${season.teamShort} Squad` : result.finals.winner.name,
        score: result.finals.score,
      }]} highlight />

      <div className="flex justify-center mt-10">
        <button
          onClick={onContinue}
          className="font-display text-base tracking-wide px-8 py-3 rounded-full bg-[color:var(--color-paint)] text-black hover:brightness-105 active:scale-95 transition"
        >
          SEE FINAL RECAP →
        </button>
      </div>
    </section>
  );
}

function BracketRound({ title, matches, highlight }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-widest text-[color:var(--color-ink-dim)] mb-3 text-center">{title}</div>
      <div className={`grid gap-3 ${matches.length > 1 ? "sm:grid-cols-2" : "max-w-sm mx-auto"}`}>
        {matches.map((m, i) => (
          <div key={i} className={`rounded-xl border px-4 py-3 text-sm ${highlight ? "border-[color:var(--color-paint)]/50 bg-[color:var(--color-paint)]/10" : "border-white/10 bg-white/[0.03]"}`}>
            <div className={`flex justify-between ${m.winner === m.a ? "font-semibold text-[color:var(--color-paint)]" : "text-[color:var(--color-ink-dim)]"}`}>
              <span className="truncate">{m.a}</span><span>{m.winner === m.a ? m.score : m.score.split("-").reverse().join("-")}</span>
            </div>
            <div className="text-center text-[10px] text-[color:var(--color-ink-dim)]/60 my-0.5">vs</div>
            <div className={`flex justify-between ${m.winner === m.b ? "font-semibold text-[color:var(--color-paint)]" : "text-[color:var(--color-ink-dim)]"}`}>
              <span className="truncate">{m.b}</span><span>{m.winner === m.b ? m.score : m.score.split("-").reverse().join("-")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function ResultsScreen({ season, userOverall, userWins, perfectElim, result, fullLineup, onRestart }) {
  const wonChip = result.finals.winner.isUser;
  const perfectRun = perfectElim && wonChip;
  const colors = [season.colors.primary, season.colors.secondary];
  const importCount = season.import ? 1 : 0;

  return (
    <section className="max-w-2xl mx-auto px-6 py-14 text-center">
      <SectionTitle eyebrow="Final Recap" title={`${season.year} ${season.teamShort} · Your Run`} />

      {perfectRun && (
        <div className="mb-8 rounded-2xl border-2 border-[color:var(--color-paint)] bg-[color:var(--color-paint)]/10 px-6 py-6">
          <div className="font-display text-3xl text-[color:var(--color-paint)] mb-1">PERFECT SEASON</div>
          <div className="text-sm text-[color:var(--color-ink-dim)]">12-0 elimination round + PBA Championship. The full 82-0 treatment, PBA-style.</div>
        </div>
      )}
      {!perfectRun && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6">
          <div className="font-display text-2xl mb-1">{wonChip ? "🏆 PBA Champions" : "Season Complete"}</div>
          <div className="text-sm text-[color:var(--color-ink-dim)]">
            Elimination round: {userWins}-{12 - userWins}{perfectElim ? " (undefeated!) " : " "}
            · {wonChip ? "Won the title" : `Eliminated — ${result.finals.winner.name} took the crown`}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-8 text-center">
        <Stat label="Team Overall" value={userOverall} />
        <Stat label="Elim. Record" value={`${userWins}-${12 - userWins}`} />
        <Stat label="Champion" value={wonChip ? "YES" : "NO"} />
      </div>

      <div className="text-left mb-8">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-ink-dim)] mb-3 text-center">Your Six</div>
        <div className="grid sm:grid-cols-2 gap-2">
          {fullLineup.map((pl, i) => {
            const role = i === 0 && season.import ? "Import Starter" : i < 5 ? "Starter" : "Sixth Man";
            return (
              <div key={pl.id} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <PlayerAvatar player={pl} colors={colors} size={38} />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{pl.name}</div>
                  <div className="text-[10px] text-[color:var(--color-ink-dim)]">{role} · OVR {playerOverall(pl)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="font-display text-base tracking-wide px-8 py-3 rounded-full bg-[color:var(--color-ember)] hover:brightness-110 active:scale-95 transition"
      >
        RUN IT BACK
      </button>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] py-3">
      <div className="font-display text-2xl text-[color:var(--color-paint)]">{value}</div>
      <div className="text-[9px] uppercase tracking-widest text-[color:var(--color-ink-dim)] mt-1">{label}</div>
    </div>
  );
}
