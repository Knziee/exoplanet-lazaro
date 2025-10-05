import { useEffect, useRef, useState } from "react";

interface LightCurveProps {
  transitDepth?: number; // e.g., 0.01 = 1% dip
  periodSeconds?: number; // must match planet orbit animation (e.g., 5)
}

export function LightCurve({
  transitDepth = 0.012, 
  periodSeconds = 5,
}: LightCurveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeFraction, setTimeFraction] = useState(0);

  // Animate time from 0 → 1 repeatedly
  useEffect(() => {
    let start: number | null = null;
    const duration = periodSeconds * 1000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = (elapsed % duration) / duration;
      setTimeFraction(t);
      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [periodSeconds]);

  // Redraw the light curve on every frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // ✅ Compact plot: no wasted space
    const plotHeight = height - 40; 
    const plotTop = 20;
    const centerY = plotTop + plotHeight * 0.6; 
    const baseFlux = 1.0;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Subtle grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, plotTop);
      ctx.lineTo(x, plotTop + plotHeight);
      ctx.stroke();
    }

    // === Draw light curve ===
    ctx.strokeStyle = "rgba(100, 180, 255, 0.95)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();

    const points = 500;
    const dipCenter = 0.5;
    const dipHalfWidth = 0.2; // [0.3, 0.7]

    for (let i = 0; i <= points; i++) {
      const t = i / points;
      let flux = baseFlux;

      if (Math.abs(t - dipCenter) <= dipHalfWidth) {
        const u = (t - dipCenter) / dipHalfWidth;
        const dipMultiplier = Math.cos((u * Math.PI) / 2);
        flux = baseFlux - transitDepth * dipMultiplier;
      }

      const x = t * width;
      const y =
        centerY - (flux - (baseFlux - transitDepth)) * (plotHeight * 1.6);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // === Current marker ===
    const currentFlux = (() => {
      if (Math.abs(timeFraction - dipCenter) <= dipHalfWidth) {
        const u = (timeFraction - dipCenter) / dipHalfWidth;
        const dipMultiplier = Math.cos((u * Math.PI) / 2);
        return baseFlux - transitDepth * dipMultiplier;
      }
      return baseFlux;
    })();

    const markerX = timeFraction * width;
    const markerY =
      centerY - (currentFlux - (baseFlux - transitDepth)) * (plotHeight * 1.6);

    // Vertical line
    ctx.strokeStyle = "rgba(255, 120, 120, 0.5)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(markerX, plotTop);
    ctx.lineTo(markerX, plotTop + plotHeight);
    ctx.stroke();

    // Red dot
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(markerX, markerY, 5, 0, Math.PI * 2);
    ctx.fill();
  }, [timeFraction, transitDepth, periodSeconds]);

  return (
    <div className="w-full max-w-md ml-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={220}
        className="w-full bg-[#0a0f1a] rounded-lg border border-white/10"
      />
    </div>
  );
}
