"use client";

import { InfoPanel } from "@/components/InfoPanel";
import { FiInfo, FiX } from "react-icons/fi";
import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { StellarSystemVisualization } from "@/components/StellarSystemVisualization";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCandidate } from "@/context/CandidateContext";
import { useAnalysis } from "@/context/AnalysisContext";

const QUESTIONS_WITH_EXPLANATION = [
  {
    question:
      "Do you see a repeating pattern in the light curve (a dip in brightness that repeats)?",
    explanation:
      "Periodic dips suggest a transiting exoplanet. Random or single events are likely noise or stellar activity.",
  },
  {
    question:
      "Does the dip appear smooth and U-shaped, or is it irregular/noisy?",
    explanation:
      "Planetary transits produce smooth, symmetric U-shaped dips. Eclipsing binaries often show V-shaped or jagged dips.",
  },
  {
    question: "Did you notice more than one dip with different depths?",
    explanation:
      "Multiple dips of varying depths may indicate a multi-planet system orbiting the same star.",
  },
  {
    question: "Did the brightness drop only once and never repeat?",
    explanation:
      "A single non-repeating dip could be caused by instrumental noise, stellar flares, or other non-planetary events.",
  },
];
function getAnswerColor(answer: string) {
  if (answer === "Yes") return "#47EAE9"; 
  if (answer === "No") return "#ff6b6b"; 
  if (answer === "Not sure") return "#FFA726";
  return "#9CA3AF"; 
}

function generatePeriodogramData(period: number) {
  const data = [];
  for (let p = 0.5; p <= 20; p += 0.1) {
    let power = 0.1 + Math.random() * 0.2; 
    if (Math.abs(p - period) <= 0.5) {
      const width = 0.3;
      const u = (p - period) / width;
      const peak = Math.exp(-u * u * 2); 
      power = 0.8 + 0.2 * peak + (Math.random() - 0.5) * 0.05;
    }
    data.push({
      period: parseFloat(p.toFixed(1)),
      power: parseFloat(power.toFixed(3)),
    });
  }
  return data;
}

export default function ReviewPage() {
  const { selectedCandidate } = useCandidate();
  const { answers } = useAnalysis();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const chartLightCurveData = useMemo(() => {
    if (!selectedCandidate) {
      return []; 
    }
    return selectedCandidate.lightCurveData.time.map((t, i) => ({
      time: t,
      flux: selectedCandidate.lightCurveData.flux[i],
    }));
  }, [selectedCandidate]);

  const periodogramData = useMemo(() => {
    if (!selectedCandidate?.orbitalPeriodDays) {
      return [];
    }
    return generatePeriodogramData(selectedCandidate.orbitalPeriodDays);
  }, [selectedCandidate?.orbitalPeriodDays]);

  if (!selectedCandidate) {
    router.push("/");
    return null;
  }

  const {
    name: systemName,
    starName,
    stellarType,
    stellarRadiusSolar,
    stellarTemperatureK,
    distanceLightYears,
    aiConfidencePercent,
    // lightCurveData,
    // orbitalPeriodDays,
  } = selectedCandidate;

  const systemData = {
    systemName,
    starName,
    starSize: `${stellarRadiusSolar.toFixed(2)} R☉ (${stellarType})`,
    distance: `${Math.round(distanceLightYears)} light-years`,
    temperature: `${stellarTemperatureK} K`,
    discoveryDate: "2024-06-15",
    aiProbability: `${aiConfidencePercent.toFixed(1)}%`,
    temperatureK: stellarTemperatureK,
    sizeRSun: stellarRadiusSolar,
    distanceLy: distanceLightYears,
  };

  const userAnswers = answers || Array(4).fill("Not answered");

  const conclusions = [
    userAnswers[0] === "Yes"
      ? "Periodic signal detected"
      : "No periodic signal",
    userAnswers[1] === "Yes"
      ? "Transit shape consistent with planet"
      : "Irregular transit shape",
    userAnswers[2] === "Yes"
      ? "Evidence of multiple planets"
      : "Single transit event",
    userAnswers[3] === "No"
      ? "No single-event artifacts"
      : "Possible false positive",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 px-4 sm:px-6">
      <div className="w-full max-w-6xl text-left mb-8">
        <h1 className="text-[#47EAE9] font-bold text-3xl mb-1">
          REVIEW & VALIDATION
        </h1>
        <p className="text-white/80 text-xl">
          System: <span className="font-medium">{systemData.systemName}</span>
        </p>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6 flex-1">
          <InfoPanel width={800} height={320}>
            <div className="h-full flex flex-col p-4">
              <h3 className="text-white font-bold text-md mb-3">
                SIMULATED SYSTEM
              </h3>
              <div className="flex-1 bg-gray-900/50 border border-white/20 rounded-xl flex items-center justify-center">
                <StellarSystemVisualization
                  temperatureK={systemData.temperatureK}
                  sizeRSun={systemData.sizeRSun}
                  distanceLy={systemData.distanceLy}
                />
              </div>
            </div>
          </InfoPanel>

          <div className="flex flex-col sm:flex-row gap-6">
            <InfoPanel width={390} height={240}>
              <div className="h-full flex flex-col p-3">
                <h3 className="text-white font-bold text-md mb-2">
                  LIGHT CURVE
                </h3>
                <div className="flex-1 bg-gray-900/50 border border-white/20 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartLightCurveData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis hide domain={["dataMin", "dataMax"]} />
                      <YAxis hide domain={[0.992, 1.002]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          borderColor: "#374151",
                          color: "white",
                          fontSize: "11px",
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
                        activeDot={{ r: 3, fill: "#47EAE9" }}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </InfoPanel>

            <InfoPanel width={390} height={240}>
              <div className="h-full flex flex-col p-3">
                <h3 className="text-white font-bold text-md mb-2">
                  PERIODOGRAM
                </h3>
                <div className="flex-1 bg-gray-900/50 border border-white/20 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={periodogramData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="period"
                        hide
                        domain={["dataMin", "dataMax"]}
                      />
                      <YAxis hide domain={[0, 1.1]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          borderColor: "#374151",
                          color: "white",
                          fontSize: "11px",
                        }}
                        formatter={(value: string) => [
                          `${parseFloat(value).toFixed(3)}`,
                          "Power",
                        ]}
                        labelFormatter={(label) => `Period: ${label} days`}
                      />
                      <Bar
                        dataKey="power"
                        fill="#47EAE9"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </InfoPanel>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6">
          <InfoPanel width={320} height={270}>
            <div className="h-full flex flex-col p-4">
              <h3 className="text-white font-bold text-md mb-3">
                STELLAR DATA
              </h3>
              <DataItem label="System Name" value={systemData.systemName} />
              <DataItem label="Star Name" value={systemData.starName} />
              <DataItem label="Star Size" value={systemData.starSize} />
              <DataItem label="Distance" value={systemData.distance} />
              <DataItem label="Temperature" value={systemData.temperature} />
              <DataItem
                label="Discovery Date"
                value={systemData.discoveryDate}
              />
              <DataItem
                label="AI Detection Confidence"
                value={systemData.aiProbability}
              />
            </div>
          </InfoPanel>

          <div onClick={() => setIsModalOpen(true)}>
            <InfoPanel
              width={320}
              height={190}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="h-full flex flex-col p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-white font-bold text-md">YOUR ANSWERS</h3>
                  <div className="text-white/50">
                    <FiInfo size={14} />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                  {conclusions.map((conclusion, i) => {
                    const answer = userAnswers[i] || "Not answered";
                    return (
                      <div key={i} className="text-white/90">
                        <span className="text-white/60">Q{i + 1}:</span>{" "}
                        <span
                          className="font-medium"
                          style={{ color: getAnswerColor(answer) }}
                        >
                          {conclusion}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-white/50 text-xs mt-2">
                  Click to view full questions
                </div>
              </div>
            </InfoPanel>
          </div>
        </div>
      </div>

      {/* FINAL ASSESSMENT */}
      <div className="w-full max-w-6xl mt-10">
        <InfoPanel width={1150} height={160}>
          <div className="h-full flex flex-col justify-center p-6">
            <h3 className="text-white font-bold text-lg text-center mb-2">
              FINAL ASSESSMENT
            </h3>
            <p className="text-white/80 text-sm text-center mb-4 max-w-2xl mx-auto">
              How confident are you that this is an exoplanet?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                className="cursor-pointer px-5 py-2.5 text-sm rounded-lg font-medium text-[#020305] bg-[#47EAE9] hover:bg-[#30d0c9] transition shadow"
                onClick={() => {
                  toast.success(
                    "Thank you for your assessment! Returning search page."
                  );
                  router.push("/");
                }}
              >
                Looks like a planet
              </button>

              <button
                className="cursor-pointer px-5 py-2.5 text-sm rounded-lg font-medium text-white bg-[#ff6b6b] hover:bg-[#ff5252] transition shadow"
                onClick={() => {
                  toast.success(
                    "Thank you for your assessment! Returning search page."
                  );
                  router.push("/");
                }}
              >
                Probably not a planet
              </button>

              <button
                className="cursor-pointer px-5 py-2.5 text-sm rounded-lg font-medium text-white bg-[#6b7280] hover:bg-[#4b5563] transition"
                onClick={() => {
                  toast.success(
                    "Thank you for your assessment! Returning search page."
                  );
                  router.push("/");
                }}
              >
                {"I'm unsure"}
              </button>
            </div>
          </div>
        </InfoPanel>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gradient-to-b from-[#0a101a] to-[#1a253a] border border-white/20 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-white font-bold text-lg">
                Your Analysis Responses
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer text-white/60 hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-5">
              {QUESTIONS_WITH_EXPLANATION.map((q, i) => (
                <div key={i} className="border-l-4 border-[#47EAE9] pl-4 py-1">
                  <h3 className="text-white font-medium text-sm mb-1">
                    Q{i + 1}: {q.question}
                  </h3>
                  <p className="text-white/70 text-xs mb-2">{q.explanation}</p>
                  <p className="font-medium text-sm">
                    Your answer:{" "}
                    <span
                      style={{
                        color: getAnswerColor(userAnswers[i] || "Not answered"),
                      }}
                    >
                      {userAnswers[i] || "Not answered"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-white/10 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-1.5">
      <span className="text-white/60 text-sm">{label}:</span>{" "}
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}
