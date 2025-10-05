"use client";

import { InfoPanel } from "@/components/InfoPanel";
import { StellarSystemVisualization } from "../../components/StellarSystemVisualization";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data
const mockCandidate = {
  type: "Exoplanet",
  systemName: "Kepler-186",
  starName: "Kepler-186",
  starSize: "0.48 R☉ (Red Dwarf)",
  distance: "582 light-years",
  temperature: "3788 K",
  discoveryDate: "2014-04-17",
  aiProbability: "87%",
  temperatureK: 3788,
  sizeRSun: 0.48,
  distanceLy: 582,
};

function generateLightCurveData() {
  const data = [];
  for (let i = 0; i <= 100; i++) {
    const time = i;
    let flux = 1.0;
    if (time >= 45 && time <= 55) {
      const center = 50;
      const depth = 0.0042;
      const width = 4;
      flux =
        1.0 -
        depth * Math.exp(-Math.pow(time - center, 2) / (2 * width * width));
    }
    flux += (Math.random() - 0.5) * 0.0005;
    data.push({ time, flux: parseFloat(flux.toFixed(5)) });
  }
  return data;
}

const lightCurveData = generateLightCurveData();

export default function CandidatePage() {
  const { type } = mockCandidate;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-6">
      {/* Alert Header */}
      <h1 className="text-[#47EAE9] font-bold text-3xl mb-2">
        DISCOVERY ALERT
      </h1>
      <h2 className="text-white font-bold text-2xl mb-8">
        {type.toUpperCase()}
      </h2>

      {/* Main Info Panel (900x350) */}
      <InfoPanel width={900} height={350}>
        <div className="flex h-full">
          <div className="w-1/2 p-6 flex flex-col">
            <h3 className="text-white font-bold text-lg mb-3">
              ORIGINAL OBSERVATION
            </h3>
            <div className="flex-1 bg-gray-900/50 border border-white/20 rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lightCurveData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis hide domain={["dataMin", "dataMax"]} />
                  <YAxis hide domain={[0.994, 1.002]} />
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
                    labelFormatter={() => "Time"}
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
            <DataItem label="System Name" value={mockCandidate.systemName} />
            <DataItem label="Star Name" value={mockCandidate.starName} />
            <DataItem label="Star Size" value={mockCandidate.starSize} />
            <DataItem label="Distance" value={mockCandidate.distance} />
            <DataItem label="Temperature" value={mockCandidate.temperature} />
            <DataItem
              label="Discovery Date"
              value={mockCandidate.discoveryDate}
            />
            <DataItem
              label="AI Detection Confidence"
              value={mockCandidate.aiProbability}
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
                temperatureK={mockCandidate.temperatureK}
                sizeRSun={mockCandidate.sizeRSun}
                distanceLy={mockCandidate.distanceLy}
              />
            </div>
          </div>
          <div className="px-6 pb-6 flex justify-end gap-4">
            <button className="px-6 py-2 bg-[#47EAE9] text-black font-bold rounded-full hover:bg-[#30d0c9] transition">
              Investigate
            </button>
            <button className="px-6 py-2 bg-white/10 text-white font-bold rounded-full border border-white/30 hover:bg-white/20 transition">
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
