// app/context/CandidateContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { TessCandidate } from "@/utils/constants";

interface CandidateContextType {
  selectedCandidate: TessCandidate | null;
  setSelectedCandidate: (candidate: TessCandidate | null) => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(
  undefined
);

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [selectedCandidate, setSelectedCandidate] =
    useState<TessCandidate | null>(null);

  return (
    <CandidateContext.Provider
      value={{ selectedCandidate, setSelectedCandidate }}
    >
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidate() {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error("useCandidate must be used within a CandidateProvider");
  }
  return context;
}
