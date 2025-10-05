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
import {
  EXOPLANET_SAMPLES,
  FALSE_POSITIVE_SAMPLES,
} from "@/utils/lightCurveSamples";
import { useCandidate } from "@/context/CandidateContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiInfo } from "react-icons/fi"; 

function generateCandidateCurve(time: number[], flux: number[]) {
  return time.map((t, i) => ({
    time: t,
    flux: flux[i],
  }));
}

export default function LightCurveAnalysisPage() {
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
        Loading...
      </div>
    );
  }

  const candidateData = generateCandidateCurve(
    selectedCandidate.lightCurveData.time,
    selectedCandidate.lightCurveData.flux
  );

  const minFlux = Math.min(...selectedCandidate.lightCurveData.flux);
  const transitDepth = (1 - minFlux).toFixed(4);
  const periodDays = selectedCandidate.orbitalPeriodDays || 5;

  const lightCurveData = {
    period: `${periodDays} days`,
    transitDuration: "1.2 hours",
    transitDepth: `${(parseFloat(transitDepth) * 100).toFixed(2)}%`,
    signalToNoise: "12.7",
  };

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
          <InfoPanel width={600} height={420} className="flex-shrink-0">
            <div className="h-full flex flex-col p-4">
              <h3 className="text-white font-bold text-lg mb-3">
                PRIMARY LIGHT CURVE
              </h3>
              <div className="flex-1 bg-gray-900/50 border border-white/20 rounded-xl mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={candidateData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <XAxis hide domain={["dataMin", "dataMax"]} />
                    <YAxis hide domain={[0.994, 1.002]} /> 
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderColor: "#374151",
                        color: "white",
                      }}
                      formatter={(value: string) => [
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
                      dot={false}
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
                {EXOPLANET_SAMPLES.map((curve) => (
                  <div
                    key={curve.id}
                    className="relative flex-1 bg-gray-900/50 border border-white/20 rounded-lg"
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
                OTHER SIGNALS
              </h3>
              <div className="flex flex-col gap-2 flex-1">
                {FALSE_POSITIVE_SAMPLES.map((fp) => (
                  <div
                    key={fp.id}
                    className="relative flex-1 bg-gray-900/50 border border-white/20 rounded-lg"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <div className="group relative">
                        <FiInfo
                          size={14}
                          className="text-white/50 hover:text-white cursor-help"
                        />
                        <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block w-48 p-2 bg-black/80 text-white text-xs rounded z-90">
                          {fp.description}
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={fp.data}>
                        <XAxis hide domain={["dataMin", "dataMax"]} />
                        <YAxis hide domain={["auto", "auto"]} />
                        <Line
                          type="monotone"
                          dataKey="flux"
                          stroke={fp.color}
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
            other signals?
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/questions"
              className="px-6 py-3 bg-[#47EAE9] text-[#020305] font-bold rounded-lg hover:bg-[#30d5c8] transition-colors shadow-lg"
            >
              Yes – Proceed with exoplanet analysis
            </Link>
            <Link
              href="/"
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
