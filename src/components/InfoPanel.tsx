import React from "react";

interface InfoPanelProps {
  width?: number | string;
  height?: number;
  children: React.ReactNode;
  className?: string;
}

export function InfoPanel({
  width = 900,
  height = 350,
  children,
  className = "",
}: InfoPanelProps) {
  return (
    <div
      className={`rounded-[15px] border-[2px] border-white/40 bg-black/20 ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
      }}
    >
      {children}
    </div>
  );
}
