"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AnalysisContextType {
  answers: (string | null)[];
  setAnswer: (index: number, answer: string | null) => void;
  resetAnswers: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (answers.length === 0) {
      setAnswers(Array(4).fill(null));
    }
  }, [answers.length]);

  const setAnswer = (index: number, answer: string | null) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = answer;
      return newAnswers;
    });
  };

  const resetAnswers = () => {
    setAnswers(Array(4).fill(null));
  };

  return (
    <AnalysisContext.Provider value={{ answers, setAnswer, resetAnswers }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
