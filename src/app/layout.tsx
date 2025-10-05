import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CandidateProvider } from "../context/CandidateContext";
import { Toaster } from "react-hot-toast";
import { AnalysisProvider } from "../context/AnalysisContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazurus",
  description: "Discover worlds beyond our solar system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-[#020305] to-[#6475C8] relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center opacity-15 z-[-1]"
          aria-hidden="true"
        />{" "}
        <Toaster position="top-right" />
        <CandidateProvider>
          <AnalysisProvider>{children} </AnalysisProvider>
        </CandidateProvider>
      </body>
    </html>
  );
}
