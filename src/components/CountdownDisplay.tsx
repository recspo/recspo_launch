import { useEffect, useState } from "react";

interface Props {
  current: number;
  target: number;
  size?: "sm" | "lg";
}

export const CountdownDisplay = ({ current, target, size = "lg" }: Props) => {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 400);
    return () => clearTimeout(t);
  }, [current]);

  const pct = Math.min(100, (current / target) * 100);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className={`font-display flex items-baseline gap-2 ${size === "lg" ? "text-[12rem] md:text-[18rem] leading-none" : "text-7xl"}`}>
        <span
          key={current}
          className="text-gradient-gold animate-count-up tabular-nums"
          style={{ textShadow: "0 0 80px hsl(43 96% 56% / 0.6)" }}
        >
          {current.toString().padStart(2, "0")}
        </span>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground/70 tabular-nums">{target.toString().padStart(2, "0")}</span>
      </div>
      <div className="w-full max-w-3xl h-3 bg-secondary rounded-full overflow-hidden border border-border">
        <div
          className="h-full bg-gradient-gold transition-all duration-500 ease-out shadow-glow"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`uppercase tracking-[0.4em] text-muted-foreground ${size === "lg" ? "text-sm md:text-base" : "text-xs"} ${pulse ? "animate-flicker" : ""}`}>
        Launches Locked In
      </p>
    </div>
  );
};