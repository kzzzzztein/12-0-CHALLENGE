import { useState, useRef } from "react";

// A small slot-machine-style dial. `items` is the pool to spin through,
// `onLand` fires with the chosen item once the spin animation settles.
export default function SpinDial({ items, labelFn, onLand, spinning, setSpinning, resultLabel }) {
  const [displayIdx, setDisplayIdx] = useState(0);
  const timerRef = useRef(null);

  const spin = () => {
    if (spinning || items.length === 0) return;
    setSpinning(true);
    let ticks = 0;
    const totalTicks = 18 + Math.floor(Math.random() * 8);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      ticks++;
      const idx = Math.floor(Math.random() * items.length);
      setDisplayIdx(idx);
      if (ticks >= totalTicks) {
        clearInterval(timerRef.current);
        const finalIdx = Math.floor(Math.random() * items.length);
        setDisplayIdx(finalIdx);
        setSpinning(false);
        onLand(items[finalIdx]);
      }
    }, 70 + ticks * 4);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-sm h-28 rounded-2xl border border-white/10 bg-black/30 overflow-hidden flex items-center justify-center court-lines">
        <div
          className={`font-display text-4xl sm:text-5xl text-center px-4 transition-transform ${spinning ? "animate-pulse" : ""}`}
          style={{ color: "var(--color-paint)" }}
        >
          {resultLabel ?? (items[displayIdx] ? labelFn(items[displayIdx]) : "—")}
        </div>
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="font-display tracking-wide text-sm px-6 py-3 rounded-full bg-[color:var(--color-ember)] hover:brightness-110 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-black/30"
      >
        {spinning ? "SPINNING…" : "SPIN"}
      </button>
    </div>
  );
}
