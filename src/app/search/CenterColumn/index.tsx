"use client";
import { useState } from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";

interface CentralColumnProps {
  setLogId?: (id: string | null) => void;
}

export default function CentralColumn({ setLogId }: CentralColumnProps) {
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (searching) return;

    setSearching(true);
    setLogId && setLogId("1");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12">
      <div className="mt-32 animate-float">
        <Image
          src="/tess.svg"
          alt="TESS"
          width={380}
          height={380}
          className="object-contain"
        />
      </div>

      <div className="w-full flex justify-center mt-auto mb-4">
        <button
          onClick={handleSearch}
          disabled={searching}
          className={`flex items-center px-8 h-[60px] rounded-[10px] shadow-lg cursor-pointer transition-all ${
            searching
              ? "bg-gray-500 cursor-not-allowed opacity-20"
              : "bg-[#47EAE9] hover:bg-[#30d0c9]"
          }`}
        >
          <FiSearch className="text-white text-[28px] mr-4 ml-2" />
          <span className="text-white font-inter font-semibold text-[28px]">
            Look for new worlds!
          </span>
        </button>
      </div>
    </div>
  );
}
