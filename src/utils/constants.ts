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
