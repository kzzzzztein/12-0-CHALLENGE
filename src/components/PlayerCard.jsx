import PlayerAvatar from "./PlayerAvatar";
import { playerOverall, ratingTier } from "../lib/ratings";

export default function PlayerCard({ player, colors, selected, disabled, onClick, roleLabel }) {
  const ovr = playerOverall(player);
  const tier = ratingTier(ovr);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all
        ${selected
          ? "border-[color:var(--color-paint)] bg-[color:var(--color-paint)]/10 shadow-[0_0_0_1px_var(--color-paint)]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <PlayerAvatar player={player} colors={colors} size={52} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[15px] truncate">{player.name}</span>
          {roleLabel && (
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-white/10 text-[color:var(--color-ink-dim)] shrink-0">
              {roleLabel}
            </span>
          )}
        </div>
        <div className="text-xs text-[color:var(--color-ink-dim)] mt-0.5">
          {player.pos === "IMP" ? "Import" : player.pos} · {player.ppg.toFixed(1)} PTS · {player.rpg.toFixed(1)} REB · {player.apg.toFixed(1)} AST
        </div>
        {player.note && (
          <div className="text-[11px] italic text-[color:var(--color-ink-dim)]/70 mt-0.5 truncate">{player.note}</div>
        )}
      </div>
      <div className="text-right shrink-0">
        <div className="font-display text-xl leading-none" style={{ color: tier.color }}>{ovr}</div>
        <div className="text-[9px] uppercase tracking-wider text-[color:var(--color-ink-dim)] mt-0.5">{tier.label}</div>
      </div>
    </button>
  );
}
