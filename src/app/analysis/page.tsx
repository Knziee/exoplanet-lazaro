"use client";

import { InfoPanel } from "@/components/InfoPanel";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const generateLightCurveData = () => {
  const data = [];
  for (let i = 0; i <= 100; i++) {
    const time = i;
    let flux = 1.0;
    if (time >= 45 && time <= 55) {
      const center = 50;
      const depth = 0.0042;
      const width = 3;
      flux =
        1.0 -
        depth * Math.exp(-Math.pow(time - center, 2) / (2 * width * width));
    }
    flux += (Math.random() - 0.5) * 0.0005;
    data.push({ time, flux: parseFloat(flux.toFixed(5)) });
  }
  return data;
};

const lightCurveData = {
  period: "3.886 days",
  transitDuration: "1.2 hours",
  transitDepth: "0.0042 (0.42%)",
  signalToNoise: "12.7",
};

const comparisonCurves = [
  { id: "Kepler-186f", dip: { start: 48, end: 52 }, color: "#47EAE9" },
  { id: "TOI-715b", dip: { start: 47, end: 53 }, color: "#60a5fa" },
  { id: "TRAPPIST-1e", dip: { start: 49, end: 51 }, color: "#38bdf8" },
  { id: "LHS 1140b", dip: { start: 46, end: 54 }, color: "#0ea5e9" },
].map((exo, idx) => {
  return {
    name: exo.id,
    data: [...Array(60)].map((_, i) => {
      let flux = 1.0;
      if (i >= exo.dip.start && i <= exo.dip.end) {
        flux =
          1.0 -
          0.0035 * (1 - Math.abs(i - (exo.dip.start + exo.dip.end) / 2) / 3);
      }
      return {
        time: i,
        flux: parseFloat((flux + (Math.random() - 0.5) * 0.0004).toFixed(5)),
      };
    }),
    color: exo.color,
  };
});

const falsePositiveCurves = [
  {
    type: "Noise",
    data: [...Array(60)].map((_, i) => ({
      time: i,
      flux: 1.0 + (Math.random() - 0.5) * 0.01,
    })),
  },
  {
    type: "Eclipsing Binary",
    data: [...Array(60)].map((_, i) => {
      let flux = 1.0;
      if (i > 25 && i < 35) flux = 0.95; 
      return { time: i, flux: parseFloat(flux.toFixed(5)) };
    }),
  },
  {
    type: "Two Dips",
    data: [...Array(60)].map((_, i) => {
      let flux = 1.0;
      if ((i > 20 && i < 25) || (i > 40 && i < 45)) flux = 0.995;
      return { time: i, flux: parseFloat(flux.toFixed(5)) };
    }),
  },
  {
    type: "Trend",
    data: [...Array(60)].map((_, i) => ({
      time: i,
      flux: parseFloat(
        (1.0 - i * 0.0002 + (Math.random() - 0.5) * 0.0005).toFixed(5)
      ),
    })),
  },
];

export default function LightCurveAnalysisPage() {
  const primaryData = generateLightCurveData();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-7xl flex flex-col items-start">
        <h1 className="text-[#47EAE9] font-bold text-3xl mb-2">
          LIGHT CURVE ANALYSIS
        </h1>
        <p className="text-white/80 mb-8">
          Transit photometry diagnostic dashboard
        </p>

        <div className="flex flex-wrap gap-6 w-full">
          {/* Primary Light Curve */}
          <InfoPanel width={600} height={420} className="flex-shrink-0">
            <div className="h-full flex flex-col p-4">
              <h3 className="text-white font-bold text-lg mb-3">
                PRIMARY LIGHT CURVE
              </h3>
              <div className="flex-1 bg-gray-900/50 border border-white/20 rounded-xl mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={primaryData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <XAxis
                      dataKey="time"
                      hide={true}
                      domain={["dataMin", "dataMax"]}
                    />
                    <YAxis
                      domain={[0.994, 1.002]}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      tickCount={4}
                      orientation="left"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderColor: "#374151",
                        color: "white",
                      }}
                      formatter={(value:string) => [
                        parseFloat(value).toFixed(5),
                        "Flux",
                      ]}
                      labelFormatter={() => "Time"}
                    />
                    <Line
                      type="monotone"
                      dataKey="flux"
                      stroke="#47EAE9"
                      strokeWidth={2}
                      dot={{ r: 1.5, fill: "#47EAE9" }}
                      activeDot={{ r: 4, fill: "#47EAE9" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 text-white text-sm">
                <DataItem label="Period" value={lightCurveData.period} />
                <DataItem
                  label="Transit Duration"
                  value={lightCurveData.transitDuration}
                />
                <DataItem
                  label="Transit Depth"
                  value={lightCurveData.transitDepth}
                />
                <DataItem
                  label="S/N Ratio"
                  value={lightCurveData.signalToNoise}
                />
              </div>
            </div>
          </InfoPanel>

          {/* Exoplanet Comparisons */}
          <InfoPanel width={280} height={420} className="flex-shrink-0">
            <div className="h-full flex flex-col p-3">
              <h3 className="text-white font-bold text-md mb-3">
                EXOPLANET COMPARISONS
              </h3>
              <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                {comparisonCurves.map((curve, idx) => (
                  <div
                    key={curve.name}
                    className="flex-1 bg-gray-900/50 border border-white/20 rounded-lg"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={curve.data}>
                        <XAxis hide domain={["dataMin", "dataMax"]} />
                        <YAxis hide domain={[0.994, 1.002]} />
                        <Line
                          type="monotone"
                          dataKey="flux"
                          stroke={curve.color}
                          strokeWidth={1.5}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          </InfoPanel>

          {/* False Positives */}
          <InfoPanel width={280} height={420} className="flex-shrink-0">
            <div className="h-full flex flex-col p-3">
              <h3 className="text-white font-bold text-md mb-3">
                FALSE POSITIVE CHECKS
              </h3>
              <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                {falsePositiveCurves.map((fp, idx) => (
                  <div
                    key={fp.type}
                    className="flex-1 bg-gray-900/50 border border-white/20 rounded-lg"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={fp.data}>
                        <XAxis hide domain={["dataMin", "dataMax"]} />
                        <YAxis hide />
                        <Line
                          type="monotone"
                          dataKey="flux"
                          stroke="#f87171"
                          strokeWidth={1.5}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          </InfoPanel>
        </div>

        <div className="mt-10 w-full max-w-4xl">
          <p className="text-white/90 text-lg mb-6">
            Does the light curve resemble known exoplanet transits more than
            false positive signals?
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/analysis/confirmed"
              className="px-6 py-3 bg-[#47EAE9] text-[#020305] font-bold rounded-lg hover:bg-[#30d5c8] transition-colors shadow-lg"
            >
              Yes – Proceed with exoplanet analysis
            </Link>
            <Link
              href="/discoveries"
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
            >
              No – Explore other discoveries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-white/60">{label}:</span>{" "}
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
