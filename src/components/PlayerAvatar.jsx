// Real player photos are copyrighted, so every player is rendered as a
// stylized team-colored badge for now. Drop a real (licensed) photo file
// into /public/players/<slug>.jpg and pass `photoSrc` to swap it in later —
// this component falls back to the badge automatically if the image 404s.
import { useState } from "react";

function initials(name) {
  const parts = name.replace(/\./g, "").split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PlayerAvatar({ player, colors, size = 56, photoSrc }) {
  const [broken, setBroken] = useState(false);
  const [primary, secondary] = colors || ["#2a3f2e", "#e8c14a"];
  const showPhoto = photoSrc && !broken;

  return (
    <div
      className="relative shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-inner"
      style={{
        width: size,
        height: size,
        background: showPhoto
          ? "#111"
          : `linear-gradient(155deg, ${primary} 0%, ${primary} 55%, ${secondary} 130%)`,
      }}
    >
      {showPhoto ? (
        <img
          src={photoSrc}
          alt={player.name}
          className="w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <>
          <div
            className="absolute inset-0 flex items-center justify-center font-display"
            style={{ fontSize: size * 0.36, color: secondary, opacity: 0.95 }}
          >
            {initials(player.name)}
          </div>
          {player.jersey !== undefined && (
            <div
              className="absolute bottom-0 right-0 px-1 text-[9px] font-bold font-display leading-tight"
              style={{ color: "#fff", opacity: 0.55 }}
            >
              {player.jersey}
            </div>
          )}
          {player.isImport && (
            <div
              className="absolute top-0 left-0 px-1 text-[8px] font-bold tracking-wide"
              style={{ background: secondary, color: "#111" }}
            >
              IMP
            </div>
          )}
        </>
      )}
    </div>
  );
}
