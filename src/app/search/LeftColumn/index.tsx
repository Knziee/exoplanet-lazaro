"use client";
import { useState, useEffect } from "react";

export default function LeftColumn() {
  const [logText, setLogText] = useState("Start searching");
  const [searching, setSearching] = useState(false);
  const [infoTitle, setInfoTitle] = useState("How to start");
  const [infoText, setInfoText] = useState(
    "Start searching for planets or set filters according to your preferences on the right."
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (searching) {
      const logs = [
        "Connecting to database...",
        "Fetching star data...",
        "Analyzing exoplanet patterns...",
        "Updating results...",
      ];
      let i = 0;
      interval = setInterval(() => {
        setLogText(logs[i % logs.length]);
        i++;
      }, 1500);
    } else {
      setLogText("Start searching");
    }

    return () => clearInterval(interval);
  }, [searching]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Log Box */}
      <div className="relative w-[450px] h-[74px] mb-12 bg-white/10 border border-white/50 rounded-[40px] p-4 flex items-center justify-between">
        {/* Text with fixed height */}
        <div className="h-[24px] flex items-center">
          <span className="text-white pl-4 font-inter font-semibold text-[24px]">
            {logText}
          </span>
        </div>

        {/* Loading spinner */}
        {searching && (
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
      {/* Info Box */}
      <div className="w-[364px] h-[352px] bg-white/5 rounded-[12px] p-5 flex flex-col items-center justify-center text-center">
        <h2 className="text-white font-inter font-semibold text-[18px] mb-2">
          {infoTitle}
        </h2>
        <p className="text-white font-inter text-[16px] leading-relaxed">
          {infoText}
        </p>
      </div>
    </div>
  );
}
