"use client";
import { useState, useEffect, ReactNode } from "react";
import { LightCurveExample } from "@/components/LightCurveExample";

interface LeftColumnProps {
  logId?: string | null;
  setLogId?: (id: string | null) => void;
}

export default function LeftColumn({ logId = null }: LeftColumnProps) {
  // const [logText, setLogText] = useState(message);
  const [infoContent, setInfoContent] = useState<ReactNode>(
    <>
      <h2 className="text-white font-inter font-semibold text-[18px] mb-2">
        Team up with Lazaro to find exoplanets!
      </h2>
      <p className="text-white font-inter text-[16px] leading-relaxed">
        Pick your star’s parameters, and Lazaro finds promising TESS candidates
        with up to 87% confidence. When a sound alerts you, just compare the
        graphs and share your opinion.
      </p>
    </>
  );

  useEffect(() => {
    let title,
      description,
      visual = null;

    switch (logId) {
      case "0":
        title = "Team up with Lazaro to find exoplanets!";
        description =
          "Pick your star’s parameters, and Lazaro finds promising TESS candidates with up to 87% confidence. When a sound alerts you, just compare the graphs and share your opinion.";
        break;

      case "1":
        title = "Connecting to TESS...";
        description =
          "Accessing NASA Transiting Exoplanet Survey Satellite (TESS) archive — the largest public dataset of stellar light curves.";
        break;

      case "2":
        title = "Finding a promising candidate...";
        description =
          "Lazaro AI scans light curves data, looking for periodic dips that match planetary transits.";
        visual = <LightCurveExample />;
        break;

      case "3":
        title = "Cleaning the data...";
        description =
          "Removing noise from stellar activity, instrumental errors, and cosmic rays to isolate real signals.";
        break;

      case "4":
        title = "Analyzing light curves...";
        description =
          "Comparing the shape, depth, and repetition of brightness dips to distinguish planets from false positives.";
        break;

      case "5":
        title = "Loading data...";
        description = "Preparing your discovery for review. Almost there!";
        break;

      default:
        title = "Team up with Lazaro to find exoplanets!";
        description =
          "Pick your star’s parameters, and Lazaro finds promising TESS candidates with up to 87% confidence. When a sound alerts you, just compare the graphs and share your opinion.";
    }

    setInfoContent(
      <>
        <h2 className="text-white font-inter font-semibold text-[18px] mb-2">
          {title}
        </h2>
        <p className="text-white font-inter text-[16px] leading-relaxed">
          {description}
        </p>
        {visual && <div className="mt-4">{visual}</div>}
      </>
    );
  }, [logId]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Log Box */}
      <div className="relative w-[450px] h-[74px] mb-12 bg-white/10 border border-white/50 rounded-[40px] p-4 flex items-center justify-between">
        <div className="h-[24px] flex items-center">
          <span className="text-white pl-4 font-inter font-semibold text-[24px]">
            {logId === "0"
              ? "Start searching..."
              : logId === "1"
              ? "Connecting to TESS..."
              : logId === "2"
              ? "Finding a promising candidate..."
              : logId === "3"
              ? "Cleaning data..."
              : logId === "4"
              ? "Analyzing light curves..."
              : "Loading data..."}
          </span>
        </div>

        {logId !== "0" && (
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {/* Info Box */}
      <div className="w-[364px] h-[352px] bg-white/5 rounded-[12px] p-5 flex flex-col items-center justify-center text-center">
        {infoContent}
      </div>
    </div>
  );
}
