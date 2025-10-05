"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InfoPanel } from "@/components/InfoPanel";
import { FiChevronRight } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCandidate } from "@/context/CandidateContext";
import { useAnalysis } from "@/context/AnalysisContext";

const QUESTIONS = [
  {
    id: 0,
    question:
      "Do you see a repeating pattern in the light curve (a dip in brightness that repeats)?",
    explanation:
      "Periodic dips suggest a transiting exoplanet. Random or single events are likely noise or stellar activity.",
  },
  {
    id: 1,
    question:
      "Does the dip appear smooth and U-shaped, or is it irregular/noisy?",
    explanation:
      "Planetary transits produce smooth, symmetric U-shaped dips. Eclipsing binaries often show V-shaped or jagged dips.",
  },
  {
    id: 2,
    question: "Did you notice more than one dip with different depths?",
    explanation:
      "Multiple dips of varying depths may indicate a multi-planet system orbiting the same star.",
  },
  {
    id: 3,
    question: "Did the brightness drop only once and never repeat?",
    explanation:
      "A single non-repeating dip could be caused by instrumental noise, stellar flares, or other non-planetary events.",
  },
];

function extractCurveSegment(
  time: number[],
  flux: number[],
  questionId: number
) {
  if (!time || !flux || time.length === 0) {
    return Array.from({ length: 120 }, (_, i) => ({
      time: i,
      flux: 1.0 + (Math.random() - 0.5) * 0.0005,
    }));
  }
  return Array.from({ length }, (_, i) => ({
    time: time[i],
    flux: flux[i] ?? 1.0,
  }));
}

export default function LightCurveQuestionsPage() {
  const { selectedCandidate } = useCandidate();
  const { answers, setAnswer, resetAnswers } = useAnalysis();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const router = useRouter();

  useEffect(() => {
    resetAnswers();
    setCurrentQuestion(0);
  }, []);

  const chartData = useMemo(() => {
    if (!selectedCandidate) {
      return Array.from({ length: 120 }, (_, i) => ({
        time: i,
        flux: 1.0 + (Math.random() - 0.5) * 0.0005,
      }));
    }

    const { time, flux } = selectedCandidate.lightCurveData;

    if (!time || !flux || time.length === 0) {
      return [];
    }

    return time.map((t, i) => ({
      time: t,
      flux: flux[i] ?? 1.0,
    }));
  }, [selectedCandidate]); 
  if (!selectedCandidate) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const handleAnswer = (answer: string) => {
    setAnswer(currentQuestion, answer);
  };

  const canAdvance = answers[currentQuestion] !== null;
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;

  const nextStep = () => {
    if (isLastQuestion) {
      router.push("/summary");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="flex flex-col items-start">
        <h1 className="text-[#47EAE9] font-bold text-3xl mb-2">
          LIGHT CURVE ANALYSIS
        </h1>
        <p className="text-white/80 mb-8">
          Answer the questions to validate the candidate
        </p>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <InfoPanel width={500} height={420} className="w-full lg:w-auto">
            <div className="h-full flex flex-col">
              <div className="px-5 pt-4 text-white/70 text-sm">
                Question {currentQuestion + 1} of {QUESTIONS.length}
              </div>
              <div className="flex-1 px-5 py-4 flex flex-col justify-center">
                <h3 className="text-white font-bold text-lg mb-6">
                  {QUESTIONS[currentQuestion].question}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  {["Yes", "No", "Not sure"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                        answers[currentQuestion] === option
                          ? "cursor-pointer bg-[#47EAE9] text-[#020305]"
                          : "cursor-pointer bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-5 pb-4 flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!canAdvance}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                    canAdvance
                      ? "bg-[#47EAE9] text-[#020305] hover:bg-[#30d0c9] cursor-pointer"
                      : "bg-white/10 text-white/50 cursor-pointer"
                  }`}
                >
                  {isLastQuestion ? "Conclude" : "Next"}
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </InfoPanel>

          <InfoPanel width={300} height={420} className="w-full lg:w-auto">
            <div className="h-full flex flex-col p-4">
              <h3 className="text-white font-bold text-md mb-3">LIGHT CURVE</h3>
              <div className="flex-1 bg-gray-900/50 border border-white/20 rounded-xl mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <XAxis hide domain={["dataMin", "dataMax"]} />
                    <YAxis hide domain={[0.992, 1.002]} />
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
                      dot={{ r: 1, fill: "#47EAE9" }}
                      activeDot={{ r: 3, fill: "#47EAE9" }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <h4 className="text-white font-semibold text-sm mb-2">
                Guidance:
              </h4>
              <p className="text-white/80 text-xs leading-relaxed">
                {QUESTIONS[currentQuestion].explanation}
              </p>
            </div>
          </InfoPanel>
        </div>
      </div>
    </div>
  );
}
