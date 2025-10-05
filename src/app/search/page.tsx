"use client";
import { useState, useMemo, useEffect } from "react";
import CenterColumn from "./CenterColumn";
import LeftColumn from "./LeftColumn";
import { SliderItem } from "./SliderItem";
import { FiArrowUpRight, FiThermometer } from "react-icons/fi";
import {
  DISTANCE_CATEGORIES,
  SIZE_CATEGORIES,
  STELLAR_CLASSES,
  tessCandidateSystems,
} from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useCandidate } from "../../context/CandidateContext";

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
  const [searching, setSearching] = useState(false);
  const [searchLogId, setSearchLogId] = useState<string | null>("0");

  const router = useRouter();
  const { setSelectedCandidate } = useCandidate();

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

  // const handleSearchChange = (status: boolean, logId?: string) => {
  //   setSearching(status);
  //   if (status) {
  //     setSearchLogId(logId || null);
  //     setSearchMessage("Looking for promising candidates...");
  //   } else {
  //     setSearchMessage("Exploration complete! Review the results below.");
  //   }
  // };

  // Display values
  const displayValueTemp = useMemo(() => tempRange, [tempRange]);
  const displayValueSize = useMemo(() => sizeRange, [sizeRange]);
  const displayValueDistance = useMemo(() => distanceRange, [distanceRange]);

  useEffect(() => {
    if (searchLogId === "1") {
      let currentLog = 1;

      const step = () => {
        if (currentLog < 5) {
          currentLog++;
          setSearchLogId(currentLog.toString());
          setTimeout(step, currentLog === 2 ? 10000 : 5000);
        } else {
          const randomIndex = Math.floor(
            Math.random() * tessCandidateSystems.length
          );
          const selected = tessCandidateSystems[randomIndex];

          // Salva no contexto
          setSelectedCandidate(selected);
          router.push("/candidate");
        }
      };

      setTimeout(step, 2000); // inicia o mockup 5s depois
      // const randomIndex = Math.floor(
      //   Math.random() * tessCandidateSystems.length
      // );
      // const selected = tessCandidateSystems[randomIndex];

      // // Salva no contexto
      // setSelectedCandidate(selected);
      // setTimeout(() => {
      //   router.push("/candidate");
      // }, 500);
    }
  }, [searchLogId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {" "}
      <div className="w-full bg-black text-white text-center py-2 text-sm font-medium tracking-wide z-50 shadow-md">
        ⚠️ This is a temporary demonstration. Data shown here is for
        illustrative purposes only.
      </div>
      <div className="flex w-4/5 flex-1 items-center justify-center mt-4">
        {/* Left column */}
        <div className="flex-1 m-2 flex justify-center">
          <LeftColumn logId={searchLogId} setLogId={setSearchLogId} />
        </div>

        {/* Center column */}
        <div className="flex-1 m-2 flex flex-col items-center justify-center -mb-24">
          <CenterColumn setLogId={setSearchLogId} />
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
