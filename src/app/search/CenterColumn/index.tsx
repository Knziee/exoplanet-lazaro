"use client";
import { useState } from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi"; // search icon

interface CentralColumnProps {
  onSearchChange?: (searching: boolean) => void; // optional callback to communicate with LeftColumn
}

export default function CentralColumn({ onSearchChange }: CentralColumnProps) {
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    setSearching(true);
    if (onSearchChange) onSearchChange(true);

    setTimeout(() => {
      setSearching(false);
      if (onSearchChange) onSearchChange(false);
    }, 6000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12">
      {/* TESS image */}
      <div className="mt-32">
        <Image
          src="/tess.svg"
          alt="TESS"
          width={380}
          height={380}
          className="object-contain"
        />
      </div>

      {/* Fixed Search button at the bottom */}
      <div className="w-full flex justify-center mt-auto mb-4">
        <button
          onClick={handleSearch}
          className="flex items-center px-8 h-[60px] bg-[#11A4FF] rounded-[50px] shadow-lg cursor-pointer"
        >
          <FiSearch className="text-white text-[28px] mr-4 ml-2" />
          <span className="text-white font-inter font-semibold text-[28px]">
            Search
          </span>
        </button>
      </div>
    </div>
  );
}
