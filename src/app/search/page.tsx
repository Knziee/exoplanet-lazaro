"use client";
import { useState, useMemo } from "react";
import CenterColumn from "./CenterColumn";
import LeftColumn from "./LeftColumn";
import { SliderItem } from "./SliderItem";
import { FiArrowUpRight, FiThermometer } from "react-icons/fi";

// Stellar classification ordered from COOL (M) to HOT (O) with authentic colors
const STELLAR_CLASSES = [
  { min: 2000, max: 3700, class: "M", color: "#ff6b6b", name: "Red" }, // Deep red - coolest
  { min: 3700, max: 5200, class: "K", color: "#ff9e6d", name: "Orange" }, // Orange
  { min: 5200, max: 6000, class: "G", color: "#ffeb66", name: "Yellow" }, // Yellow (like our Sun)
  {
    min: 6000,
    max: 7500,
    class: "F",
    color: "#f0f8ff",
    name: "Yellow-White",
  }, // Yellow-white
  { min: 7500, max: 10000, class: "A", color: "#ffffff", name: "White" }, // Pure white
  { min: 10000, max: 30000, class: "B", color: "#b0d4ff", name: "Blue-White" }, // Blue-white
  { min: 30000, max: 50000, class: "O", color: "#7bb6ff", name: "Blue" }, // Blue - hottest
];

// Size categories with astronomical references (in Solar Radii - R☉)
const SIZE_CATEGORIES = [
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

// Distance categories in light-years
const DISTANCE_CATEGORIES = [
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

// Get stellar class info by index
function getStarInfoByIndex(index: number) {
  const starClass = STELLAR_CLASSES[index];
  const tempK = Math.round((starClass.min + starClass.max) / 2);
  return {
    color: starClass.color,
    class: `${starClass.class} (${starClass.name})`,
    range: `${starClass.min}–${starClass.max} K`,
    tempK,
    index,
  };
}

// Get size info by index
function getSizeInfoByIndex(index: number) {
  const sizeCat = SIZE_CATEGORIES[index];
  const sizeValue = (sizeCat.min + sizeCat.max) / 2;
  return {
    name: sizeCat.name,
    description: sizeCat.description,
    range: `${sizeCat.min}–${sizeCat.max} R☉`,
    sizeValue,
    index,
  };
}

// Get distance info by index
function getDistanceInfoByIndex(index: number) {
  const distCat = DISTANCE_CATEGORIES[index];
  const distanceValue = Math.round((distCat.min + distCat.max) / 2);
  return {
    name: distCat.name,
    description: distCat.description,
    range: `${distCat.min.toLocaleString()}–${distCat.max.toLocaleString()} light-years`,
    distanceValue,
    index,
  };
}

export default function SearchPage() {
  const [distanceIndex, setDistanceIndex] = useState(2); // Default to "Intermediate"
  const [temperatureIndex, setTemperatureIndex] = useState(3); // Default to F class
  const [sizeIndex, setSizeIndex] = useState(1); // Default to "Solar"

  // Get current stellar info
  const {
    color: tempColor,
    class: starClass,
    range: tempRange,
    tempK,
  } = getStarInfoByIndex(temperatureIndex);

  // Get current size info
  const {
    name: sizeName,
    description: sizeDescription,
    range: sizeRange,
    sizeValue,
  } = getSizeInfoByIndex(sizeIndex);

  // Get current distance info
  const {
    name: distanceName,
    description: distanceDescription,
    range: distanceRange,
    distanceValue,
  } = getDistanceInfoByIndex(distanceIndex);

  // Handle temperature change
  const handleTemperatureChange = (value: number) => {
    const roundedValue = Math.round(value);
    setTemperatureIndex(Math.max(0, Math.min(6, roundedValue)));
  };

  // Handle size change
  const handleSizeChange = (value: number) => {
    const roundedValue = Math.round(value);
    setSizeIndex(Math.max(0, Math.min(5, roundedValue)));
  };

  // Handle distance change
  const handleDistanceChange = (value: number) => {
    const roundedValue = Math.round(value);
    setDistanceIndex(Math.max(0, Math.min(5, roundedValue)));
  };

  // Display values
  const displayValueTemp = useMemo(() => tempRange, [tempRange]);
  const displayValueSize = useMemo(() => sizeRange, [sizeRange]);
  const displayValueDistance = useMemo(() => distanceRange, [distanceRange]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020305] to-[#6475C8]">
      <div className="flex w-4/5">
        {/* Left column */}
        <div className="flex-1 m-2 flex justify-center">
          <LeftColumn />
        </div>

        {/* Center column */}
        <div className="flex-1 m-2 flex flex-col items-center justify-center -mb-24">
          <CenterColumn />
        </div>

        {/* Right column */}
        <div className="flex-1 m-2 flex flex-col items-center justify-center gap-3">
          {/* DISTANCE */}
          <SliderItem
            name="DISTANCE"
            value={distanceIndex}
            onChange={handleDistanceChange}
            minLabel="Near"
            maxLabel="Far"
            icon={
              <FiArrowUpRight
                style={{
                  opacity: 1 - distanceIndex * 0.15,
                  color: tempColor,
                }}
              />
            }
            iconColor={tempColor}
            displayValue={displayValueDistance}
            min={0}
            max={5}
            step={1}
          >
            <div className="text-xs text-white/70 mt-1">
              {distanceName}: {distanceRange}
            </div>
          </SliderItem>

          {/* TEMPERATURE */}
          <SliderItem
            name="TEMPERATURE"
            value={temperatureIndex}
            onChange={handleTemperatureChange}
            minLabel="Cool"
            maxLabel="Hot"
            icon={<FiThermometer />}
            iconColor={tempColor}
            displayValue={displayValueTemp}
            min={0}
            max={6}
            step={1}
          >
            <div className="text-xs text-white/70 mt-1">
              Class {starClass.split(" ")[0]}: {tempRange}
            </div>
          </SliderItem>

          {/* SIZE */}
          <SliderItem
            name="SIZE"
            value={sizeIndex}
            onChange={handleSizeChange}
            minLabel="Small"
            maxLabel="Large"
            icon={
              <div className="flex items-center justify-center">
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: `${10 + sizeIndex * 6}px`,
                    height: `${10 + sizeIndex * 6}px`,
                    backgroundColor: tempColor,
                    aspectRatio: "1 / 1",
                  }}
                />
              </div>
            }
            displayValue={displayValueSize}
            min={0}
            max={5}
            step={1}
          >
            <div className="text-xs text-white/70 mt-1">
              {sizeName}: {sizeRange} (Solar Radii)
            </div>
          </SliderItem>
        </div>
      </div>
    </div>
  );
}
