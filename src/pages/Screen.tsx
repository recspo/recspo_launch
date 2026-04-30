import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useLaunchData } from "@/hooks/useLaunchData";
import { CountdownDisplay } from "@/components/CountdownDisplay";
import { Trophy, Users, Zap } from "lucide-react";

const Screen = () => {
  const { event, launchedCount, joinedCount } = useLaunchData();
  const [joinUrl, setJoinUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/`);
  }, []);

  useEffect(() => {
    if (event?.launched) {
      const t = setTimeout(() => {
        window.location.href = "https://recspo.vercel.app";
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [event?.launched, navigate]);

  const target = event?.target ?? 10;

  if (event?.launched) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center grid-bg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-gold opacity-20 animate-flicker" />
        <Trophy className="w-48 h-48 text-primary animate-float mb-8 relative z-10" />
        <h1 className="font-display text-[10rem] leading-none text-gradient-gold animate-scale-in relative z-10">
          LAUNCHED
        </h1>
        <p className="mt-6 text-2xl uppercase tracking-[0.4em] text-foreground/80 animate-fade-in relative z-10">
          Revealing the experience…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col grid-bg relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />

      {/* Header */}
      <header className="flex items-center justify-between px-12 pt-10">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm uppercase tracking-[0.4em] text-foreground/80">Live · On Air</span>
        </div>
        <div className="font-display text-2xl text-gradient-gold">COLLEGE SPORTS</div>
        <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
          <Users className="w-4 h-4" /> {joinedCount} joined
        </div>
      </header>

      {/* Center stage */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 gap-10">
        <div className="text-center space-y-3 animate-fade-in">
          <p className="text-sm md:text-base uppercase tracking-[0.6em] text-primary/90">Reveal Event</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground">
            The Site Launches At <span className="text-gradient-gold">{target}/{target}</span>
          </h1>
        </div>

        <CountdownDisplay current={launchedCount} target={target} />

        <div className="flex flex-col md:flex-row items-center gap-10 mt-6">
          <div className="bg-card border-2 border-primary/40 rounded-2xl p-6 shadow-gold">
            <QRCodeSVG
              value={joinUrl}
              size={220}
              bgColor="hsl(0 0% 7%)"
              fgColor="hsl(43 96% 56%)"
              level="H"
              marginSize={2}
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <p className="text-xs uppercase tracking-[0.4em] text-primary">Step Up</p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
              Scan. Tap. <br />
              <span className="text-gradient-gold">Launch With Us.</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md">
              Every tap brings the new College Sports site closer to going live — right here, right now.
            </p>
          </div>
        </div>
      </section>

      <footer className="px-12 pb-8 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted-foreground">
        <span>// Powered by the crowd</span>
        <span className="animate-flicker">{joinUrl.replace(/^https?:\/\//, "")}</span>
      </footer>
    </main>
  );
};

export default Screen;