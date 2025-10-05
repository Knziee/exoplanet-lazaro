"use client";

import React from "react";

interface SliderItemProps {
  name: string;
  value: number;
  onChange: (v: number) => void;
  min?: number; // actual minimum value
  max?: number; // actual maximum value
  step?: number; // slider step
  minLabel: string;
  maxLabel: string;
  icon: React.ReactNode;
  iconColor?: string;
  children?: React.ReactNode; // extra content below
  displayValue?: string; // custom value to display
}

export function SliderItem({
  name,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  minLabel,
  maxLabel,
  icon,
  iconColor,
  displayValue,
}: SliderItemProps) {
  // Format value for display
  // const formattedValue = displayValue || value.toFixed(step < 1 ? 1 : 0);

  return (
    <div className="w-[305px] min-h-[115px] bg-white/5 rounded-[10px] p-4 flex flex-col justify-between shadow-md">
      {/* Header with name and value */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-white">{name}</span>
        <span className="text-[12px] text-[#47EAE9] font-bold">
          {displayValue}
        </span>
      </div>

      {/* Body with icon and slider */}
      <div className="flex items-center flex-1">
        {/* Icon */}
        <div className="w-10 h-10 flex justify-center items-center rounded-full">
          {typeof icon === "object" && icon !== null
            ? React.cloneElement(icon as React.ReactElement, {
                //@ts-expect-error library types possibly outdated
                color: iconColor,
                size: 28,
              })
            : icon}
        </div>

        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="ml-4 w-full h-[5px] rounded-full accent-[#4FEAE9] bg-white/25 cursor-pointer"
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-white/70 -mt-2">
        <span className="ml-12">{minLabel}</span>
        <span className="">{maxLabel}</span>
      </div>
    </div>
  );
}
