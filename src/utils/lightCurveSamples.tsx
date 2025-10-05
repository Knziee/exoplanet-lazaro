export interface LightCurveSample {
  id: string;
  name: string;
  type: "exoplanet" | "false-positive";
  description: string;
  color: string;
  data: { time: number; flux: number }[];
}

function generateTransitCurve(
  length: number,
  transitCenter: number,
  depth: number,
  width: number,
  noise = 0.0004
): { time: number; flux: number }[] {
  return Array.from({ length }, (_, i) => {
    const time = i;
    let flux = 1.0;
    if (Math.abs(time - transitCenter) <= width) {
      const u = (time - transitCenter) / width;
      const dip = Math.exp(-u * u * 2);
      flux = 1.0 - depth * dip;
    }
    flux += (Math.random() - 0.5) * noise;
    return { time, flux: parseFloat(flux.toFixed(5)) };
  });
}

export const EXOPLANET_SAMPLES: LightCurveSample[] = [
  {
    id: "kepler-186f",
    name: "Kepler-186f",
    type: "exoplanet",
    description: "Earth-sized planet in habitable zone of M-dwarf",
    color: "#47EAE9",
    data: generateTransitCurve(60, 30, 0.0042, 2.5, 0.0003),
  },
  {
    id: "toi-715b",
    name: "TOI-715 b",
    type: "exoplanet",
    description: "Earth-sized planet, 19.3-day orbit",
    color: "#60a5fa",
    data: generateTransitCurve(60, 30, 0.008, 3.0, 0.0004),
  },
  {
    id: "trappist-1e",
    name: "TRAPPIST-1 e",
    type: "exoplanet",
    description: "Rocky planet in habitable zone",
    color: "#38bdf8",
    data: generateTransitCurve(60, 30, 0.0065, 2.0, 0.0005),
  },
  {
    id: "lhs-1140b",
    name: "LHS 1140 b",
    type: "exoplanet",
    description: "Super-Earth, potential ocean world",
    color: "#0ea5e9",
    data: generateTransitCurve(60, 30, 0.012, 4.0, 0.0003),
  },
];

export const FALSE_POSITIVE_SAMPLES: LightCurveSample[] = [
  {
    id: "eclipsing-binary",
    name: "Eclipsing Binary",
    type: "false-positive",
    description:
      "Deep V-shaped eclipse from two stars orbiting each other. Much deeper and sharper than planetary transits.",
    color: "#f87171",
    data: Array.from({ length: 80 }, (_, i) => {
      let flux = 1.0;
      if (i >= 35 && i <= 45) {
        const center = 40;
        const depth = 0.18;
        flux = 1.0 - depth * (1 - Math.abs(i - center) / 5); // V-shaped
      }
      flux += (Math.random() - 0.5) * 0.001;
      return { time: i, flux: parseFloat(flux.toFixed(5)) };
    }),
  },
  {
    id: "stellar-flare",
    name: "Stellar Flare",
    type: "false-positive",
    description:
      "Sudden brightening from magnetic activity on M-dwarf stars — opposite of a transit!",
    color: "#fbbf24",
    data: Array.from({ length: 80 }, (_, i) => {
      let flux = 1.0;
      if (i >= 38 && i <= 42) {
        const peak = 0.09; 
        const u = Math.abs(i - 40);
        flux = 1.0 + peak * Math.exp(-u * u * 2);
      }
      flux += (Math.random() - 0.5) * 0.0008;
      return { time: i, flux: parseFloat(flux.toFixed(5)) };
    }),
  },
  {
    id: "starspot-modulation",
    name: "Starspot Modulation",
    type: "false-positive",
    description:
      "Quasi-periodic dips from dark spots rotating in and out of view — irregular and repeating.",
    color: "#fb923c",
    data: Array.from({ length: 80 }, (_, i) => {
      let flux = 1.0 - 0.008 * (1 + Math.sin(i * 0.3));
      if (i >= 20 && i <= 24) flux -= 0.003;
      if (i >= 50 && i <= 54) flux -= 0.004;
      flux += (Math.random() - 0.5) * 0.0006;
      return { time: i, flux: parseFloat(flux.toFixed(5)) };
    }),
  },
  {
    id: "cosmic-ray",
    name: "Data Artifact",
    type: "false-positive",
    description:
      "Single sharp dip from cosmic ray hit or data glitch — not periodic.",
    color: "#ef4444",
    data: Array.from({ length: 80 }, (_, i) => {
      let flux = 1.0;
      if (i === 40) {
        flux = 0.96; 
      }
      flux += (Math.random() - 0.5) * 0.0005;
      return { time: i, flux: parseFloat(flux.toFixed(5)) };
    }),
  },
];
