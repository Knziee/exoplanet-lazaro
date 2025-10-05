// app/candidate/StellarSystemVisualization.tsx
import {
  STELLAR_CLASSES,
  SIZE_CATEGORIES,
  DISTANCE_CATEGORIES,
} from "@/utils/constants";

interface StellarSystemVisualizationProps {
  temperatureK: number; // e.g., 3788
  sizeRSun: number; // e.g., 0.48
  distanceLy: number; // e.g., 582
}

export function StellarSystemVisualization({
  temperatureK,
  sizeRSun,
  distanceLy,
}: StellarSystemVisualizationProps) {
  // === Determine stellar class ===
  const stellarClass =
    STELLAR_CLASSES.find(
      (cls) => temperatureK >= cls.min && temperatureK <= cls.max
    ) || STELLAR_CLASSES[0]; // fallback to M

  // === Determine size category ===
  const sizeCategory =
    SIZE_CATEGORIES.find((cat) => sizeRSun >= cat.min && sizeRSun <= cat.max) ||
    SIZE_CATEGORIES[0];

  // === Determine distance category ===
  const distanceCategory =
    DISTANCE_CATEGORIES.find(
      (cat) => distanceLy >= cat.min && distanceLy <= cat.max
    ) || DISTANCE_CATEGORIES[0];

  // === Calculate star radius (in px) based on size ===
  // Smooth logarithmic scale to avoid overly large stars
  const baseRadius = 20;
  const sizeMultiplier = Math.log10(Math.max(sizeRSun, 0.1)) + 1; // avoids log(0)
  const starRadius = Math.min(baseRadius * sizeMultiplier, 80); // max limit

  // === Glow/halo style based on distance ===
  const distanceIndex = DISTANCE_CATEGORIES.indexOf(distanceCategory);
  const glowIntensity = Math.max(0, 1 - distanceIndex * 0.15); // farther = dimmer
  const backgroundStars = Math.max(20 - distanceIndex * 3, 5); // farther = fewer visible stars

  // === Generate background stars ===
  const backgroundStarsArray = Array.from(
    { length: backgroundStars },
    (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
    })
  );

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Space background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020305] to-[#0a0f1a]"></div>

      {/* Background stars */}
      {backgroundStarsArray.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Subtle nebula (more visible at intermediate distances) */}
      {distanceIndex >= 1 && distanceIndex <= 3 && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${stellarClass.color}40, transparent 70%)`,
          }}
        />
      )}

      {/* Central star */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* Glow halo */}
        <div
          className="absolute rounded-full blur-xl"
          style={{
            width: `${starRadius * 3}px`,
            height: `${starRadius * 3}px`,
            backgroundColor: stellarClass.color,
            opacity: glowIntensity * 0.4,
          }}
        />
        {/* Star body */}
        <div
          className="rounded-full relative z-10"
          style={{
            width: `${starRadius * 2}px`,
            height: `${starRadius * 2}px`,
            backgroundColor: stellarClass.color,
            boxShadow: `0 0 ${starRadius / 2}px ${stellarClass.color}80`,
          }}
        />
        {/* Inner highlight (glare) */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${starRadius * 0.6}px`,
            height: `${starRadius * 0.6}px`,
            backgroundColor: "white",
            opacity: 0.6,
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Star label */}
      <div className="absolute bottom-4 left-4 text-white/70 text-xs">
        <div>{stellarClass.class} Star</div>
        <div>
          {sizeCategory.name} • {distanceCategory.name}
        </div>
      </div>
    </div>
  );
}
