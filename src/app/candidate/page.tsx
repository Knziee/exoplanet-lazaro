"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { InfoPanel } from "@/components/InfoPanel";
import { StellarSystemVisualization } from "@/components/StellarSystemVisualization"; // ajuste o caminho se necessário
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCandidate } from "../../context/CandidateContext";

function smoothLightCurveData(
  time: number[],
  flux: number[]
): { time: number; flux: number }[] {
  return time.map((t, i) => ({
    time: parseFloat(t.toFixed(3)),
    flux: parseFloat(flux[i].toFixed(5)),
  }));
}

export default function CandidatePage() {
  const { selectedCandidate } = useCandidate();
  const router = useRouter();

  useEffect(() => {
    if (!selectedCandidate) {
      router.push("/");
    }
  }, [selectedCandidate, router]);

  if (!selectedCandidate) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading candidate...
      </div>
    );
  }

  const {
    name: systemName,
    starName,
    stellarType,
    stellarRadiusSolar,
    stellarTemperatureK,
    distanceLightYears,
    aiConfidencePercent,
    lightCurveData,
    notes,
  } = selectedCandidate;

  const chartData = smoothLightCurveData(
    lightCurveData.time,
    lightCurveData.flux
  );

  const minFlux = Math.min(...lightCurveData.flux);
  const transitDepthPercent = ((1 - minFlux) * 100).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-6">
      {/* Alert Header */}
      <h1 className="text-[#47EAE9] font-bold text-3xl mb-2">
        DISCOVERY ALERT
      </h1>
      <h2 className="text-white font-bold text-2xl mb-8">EXOPLANET</h2>

      <InfoPanel width={900} height={350}>
        <div className="flex h-full">
          <div className="w-1/2 p-6 flex flex-col">
            <h3 className="text-white font-bold text-lg mb-3">
              ORIGINAL OBSERVATION
            </h3>
            <div className="flex-1 bg-gray-900/50 border border-white/20 rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis hide domain={["dataMin", "dataMax"]} />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      color: "white",
                      fontSize: "12px",
                    }}
                    formatter={(value: string) => [
                      `${parseFloat(value).toFixed(5)}`,
                      "Flux",
                    ]}
                    labelFormatter={() => "Time (days)"}
                  />
                  <Line
                    type="natural"
                    dataKey="flux"
                    stroke="#47EAE9"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#47EAE9" }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Key Data */}
          <div className="w-1/2 p-6 flex flex-col justify-center text-white">
            <DataItem label="System Name" value={systemName} />
            <DataItem label="Star Name" value={starName} />
            <DataItem
              label="Star Type"
              value={`${stellarType} (${stellarRadiusSolar.toFixed(2)} R☉)`}
            />
            <DataItem
              label="Distance"
              value={`${distanceLightYears.toFixed(0)} light-years`}
            />
            <DataItem label="Temperature" value={`${stellarTemperatureK} K`} />
            <DataItem label="Transit Depth" value={`${transitDepthPercent}%`} />
            <DataItem
              label="AI Detection Confidence"
              value={`${aiConfidencePercent.toFixed(1)}%`}
            />
          </div>
        </div>
      </InfoPanel>

      {/* Simulated Observation Panel */}
      <InfoPanel width={900} height={420} className="mt-8">
        <div className="h-full flex flex-col">
          <h3 className="text-white font-bold text-lg mb-3 px-6 pt-6">
            SIMULATED VISUALIZATION
          </h3>
          <div className="flex-1 px-6 pb-4">
            <div className="h-full bg-gray-900/50 border border-white/20 rounded-xl">
              <StellarSystemVisualization
                temperatureK={stellarTemperatureK}
                sizeRSun={stellarRadiusSolar}
                distanceLy={distanceLightYears}
              />
            </div>
          </div>
          <div className="px-6 pb-6 flex justify-end gap-4">
            <button
              className="cursor-pointer px-6 py-2 bg-[#47EAE9] text-black font-bold rounded-full hover:bg-[#30d0c9] transition"
              onClick={() => router.push("/analysis")}
            >
              Investigate
            </button>
            <button
              className="cursor-pointer px-6 py-2 bg-white/10 text-white font-bold rounded-full border border-white/30 hover:bg-white/20 transition"
              onClick={() => router.push("/")}
            >
              Ignore
            </button>
          </div>
        </div>
      </InfoPanel>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <span className="text-white/60 text-sm">{label}:</span>{" "}
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
