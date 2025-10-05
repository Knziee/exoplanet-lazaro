export const STELLAR_CLASSES = [
  { min: 2000, max: 3700, class: "M", color: "#ff6b6b", name: "Red" },
  { min: 3700, max: 5200, class: "K", color: "#ff9e6d", name: "Orange" },
  { min: 5200, max: 6000, class: "G", color: "#ffeb66", name: "Yellow" },
  { min: 6000, max: 7500, class: "F", color: "#f0f8ff", name: "Yellow-White" },
  { min: 7500, max: 10000, class: "A", color: "#ffffff", name: "White" },
  { min: 10000, max: 30000, class: "B", color: "#b0d4ff", name: "Blue-White" },
  { min: 30000, max: 50000, class: "O", color: "#7bb6ff", name: "Blue" },
];

export const SIZE_CATEGORIES = [
  {
    min: 0.1,
    max: 0.5,
    name: "Dwarf",
    description: "Small stars like red dwarfs",
  },
  {
    min: 0.5,
    max: 1.0,
    name: "Solar",
    description: "Similar in size to our Sun (1 R☉)",
  },
  {
    min: 1.0,
    max: 2.0,
    name: "Subgiant",
    description: "Larger than the Sun, evolving off the main sequence",
  },
  {
    min: 2.0,
    max: 10.0,
    name: "Giant",
    description: "Giant stars like Arcturus",
  },
  {
    min: 10.0,
    max: 100.0,
    name: "Supergiant",
    description: "Supergiants like Betelgeuse",
  },
  {
    min: 100.0,
    max: 1000.0,
    name: "Hypergiant",
    description: "Rare hypergiants like VY Canis Majoris",
  },
];

export const DISTANCE_CATEGORIES = [
  {
    min: 1,
    max: 10,
    name: "Very Close",
    description: "Solar system and nearby stars",
  },
  {
    min: 10,
    max: 100,
    name: "Close",
    description: "Stars in the solar neighborhood",
  },
  {
    min: 100,
    max: 1000,
    name: "Intermediate",
    description: "Within the local spiral arm",
  },
  {
    min: 1000,
    max: 10000,
    name: "Far",
    description: "Other arms of the Milky Way",
  },
  {
    min: 10000,
    max: 100000,
    name: "Very Far",
    description: "Across the entire galaxy",
  },
  {
    min: 100000,
    max: 10000000,
    name: "Galaxies",
    description: "Beyond the Milky Way",
  },
];

export interface LightCurveData {
  time: number[];
  flux: number[];
}

export interface TessCandidate {
  id: string;
  name: string;
  starName: string;
  stellarType: string;
  stellarRadiusSolar: number;
  stellarTemperatureK: number;
  distanceLightYears: number;
  orbitalPeriodDays: number;
  lightCurveData: LightCurveData;
  pixelFilesUrl: string;
  aiConfidencePercent: number;
  hasConfirmedPlanet: boolean;
  notes?: string;
}

function generateLightCurve(
  periodDays: number,
  transitDepth: number,
  durationDays: number,
  noiseLevel: number = 0.001,
  numPoints: number = 1000
): LightCurveData {
  const time = [];
  const flux = [];
  const halfDuration = durationDays / 2;

  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * periodDays * 2;
    let f = 1.0;

    const phase = t % periodDays;
    if (
      phase >= periodDays / 2 - halfDuration &&
      phase <= periodDays / 2 + halfDuration
    ) {
      const u = (phase - periodDays / 2) / halfDuration;
      const dip = Math.cos((u * Math.PI) / 2);
      f = 1.0 - transitDepth * dip;
    }

    f += (Math.random() - 0.5) * noiseLevel * 2;

    time.push(t);
    flux.push(f);
  }

  return { time, flux };
}

export const tessCandidateSystems: TessCandidate[] = [
  {
    id: "TOI-715.01",
    name: "TOI-715 System",
    starName: "TOI-715",
    stellarType: "M4V",
    stellarRadiusSolar: 0.24,
    stellarTemperatureK: 3180,
    distanceLightYears: 137,
    orbitalPeriodDays: 19.3,
    lightCurveData: generateLightCurve(19.3, 0.008, 1.2, 0.0008),
    pixelFilesUrl: "https://mast.stsci.edu/.../toi715_tp.fits",
    aiConfidencePercent: 94.7,
    hasConfirmedPlanet: true,
    notes: "Hosts two Earth-sized planets in habitable zone.",
  },
  {
    id: "TOI-178.03",
    name: "TOI-178 System",
    starName: "TOI-178",
    stellarType: "K3V",
    stellarRadiusSolar: 0.76,
    stellarTemperatureK: 4780,
    distanceLightYears: 205,
    orbitalPeriodDays: 14.5,
    lightCurveData: generateLightCurve(14.5, 0.012, 2.1, 0.0006),
    pixelFilesUrl: "https://mast.stsci.edu/.../toi178_tp.fits",
    aiConfidencePercent: 98.2,
    hasConfirmedPlanet: true,
    notes: "Resonant chain of 6 planets.",
  },
  {
    id: "TIC-365148321.01",
    name: "L 98-59 System",
    starName: "L 98-59",
    stellarType: "M3V",
    stellarRadiusSolar: 0.31,
    stellarTemperatureK: 3470,
    distanceLightYears: 35,
    orbitalPeriodDays: 2.25,
    lightCurveData: generateLightCurve(2.25, 0.006, 0.8, 0.001),
    pixelFilesUrl: "https://mast.stsci.edu/.../l98-59_tp.fits",
    aiConfidencePercent: 96.5,
    hasConfirmedPlanet: true,
    notes: "One of the smallest exoplanets found by TESS.",
  },
  {
    id: "TOI-1452.01",
    name: "TOI-1452 System",
    starName: "TOI-1452",
    stellarType: "M4V",
    stellarRadiusSolar: 0.21,
    stellarTemperatureK: 3120,
    distanceLightYears: 100,
    orbitalPeriodDays: 11.1,
    lightCurveData: generateLightCurve(11.1, 0.015, 1.8, 0.0009),
    pixelFilesUrl: "https://mast.stsci.edu/.../toi1452_tp.fits",
    aiConfidencePercent: 92.1,
    hasConfirmedPlanet: true,
    notes: "Potential 'ocean world' super-Earth.",
  },
];
