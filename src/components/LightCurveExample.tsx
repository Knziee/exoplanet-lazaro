export function LightCurveExample() {
  const starColor = "#ffeb66"; // Sun-like yellow
  const starRadius = 32; // in pixels
  const planetRadius = 6; // in pixels

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
      {/* Space background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020305] to-[#0a0f1a]"></div>

      {/* Background stars */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${15 + ((i * 13) % 80)}%`,
            top: `${25 + ((i * 17) % 60)}%`,
            width: `${Math.random() * 1 + 0.5}px`,
            height: `${Math.random() * 1 + 0.5}px`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}

      {/* Star */}
      <div className="relative">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-md opacity-30"
          style={{
            backgroundColor: starColor,
            width: `${starRadius * 2.5}px`,
            height: `${starRadius * 2.5}px`,
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
          }}
        />
        {/* Star body */}
        <div
          className="rounded-full"
          style={{
            width: `${starRadius * 2}px`,
            height: `${starRadius * 2}px`,
            backgroundColor: starColor,
            boxShadow: `0 0 10px ${starColor}60`,
          }}
        />
      </div>

      {/* Planet */}
      <div
        className="absolute top-1/2 -translate-y-1/2 animate-transit-loop"
        style={{
          width: `${planetRadius * 2}px`,
          height: `${planetRadius * 2}px`,
        }}
      >
        <div
          className="w-full h-full rounded-full bg-[#47EAE9]"
          style={{
            boxShadow: "0 0 6px #47EAE9",
          }}
        />
      </div>

      {/* Label */}
      <div className="absolute bottom-2 left-3 text-white/60 text-[10px]">
        Planet transits in front of star
      </div>
    </div>
  );
}
