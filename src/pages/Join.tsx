import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLaunchData, joinEvent, pressLaunch, checkHasLaunched } from "@/hooks/useLaunchData";
import { Rocket, Zap, Trophy } from "lucide-react";

const Join = () => {
  const { event, launchedCount } = useLaunchData();
  const [hasLaunched, setHasLaunched] = useState(false);
  const [joining, setJoining] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await joinEvent();
      const launched = await checkHasLaunched();
      if (launched) setHasLaunched(true);
      setJoining(false);
    })();
  }, []);

  useEffect(() => {
    if (event?.launched) {
      const t = setTimeout(() => {
        window.location.href = "https://recspo.vercel.app";
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [event?.launched, navigate]);

  const target = event?.target ?? 10;
  const pct = Math.min(100, (launchedCount / target) * 100);

  if (event?.launched) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center grid-bg">
        <Trophy className="w-24 h-24 text-primary animate-float mb-6" />
        <h1 className="font-display text-6xl text-gradient-gold mb-3">LAUNCHED!</h1>
        <p className="text-muted-foreground uppercase tracking-widest">Loading the experience…</p>
        <div className="mt-8 w-full max-w-xs h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-gold animate-shimmer" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 grid-bg relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />

      <header className="w-full pt-6 text-center animate-fade-in">
        <p className="text-xs uppercase tracking-[0.5em] text-primary/80">College Sports</p>
        <h1 className="font-display text-4xl mt-2 text-gradient-gold">THE LAUNCH</h1>
      </header>

      <section className="flex flex-col items-center gap-8 w-full animate-scale-in">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Live Counter</p>
          <div className="font-display text-8xl text-gradient-gold tabular-nums" key={launchedCount}>
            <span className="animate-count-up inline-block">{launchedCount}</span>
            <span className="text-muted-foreground">/{target}</span>
          </div>
        </div>

        <div className="w-full max-w-xs h-2 bg-secondary rounded-full overflow-hidden border border-border">
          <div className="h-full bg-gradient-gold transition-all duration-500 shadow-glow" style={{ width: `${pct}%` }} />
        </div>

        {hasLaunched ? (
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/40">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm uppercase tracking-widest text-primary">You're Locked In</span>
            </div>
            <p className="text-muted-foreground text-sm">Waiting for {Math.max(0, target - launchedCount)} more…</p>
          </div>
        ) : (
          <Button
            disabled={joining}
            onClick={async () => {
              await pressLaunch();
              setHasLaunched(true);
            }}
            className="relative h-44 w-44 rounded-full bg-gradient-gold text-primary-foreground font-display text-3xl tracking-widest shadow-gold hover:scale-105 active:scale-95 transition-transform animate-pulse-gold border-4 border-primary-foreground/10"
          >
            <Rocket className="w-8 h-8 absolute top-6" />
            LAUNCH
          </Button>
        )}
      </section>

      <footer className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground pb-4">
        Watch the big screen
      </footer>
    </main>
  );
};

export default Join;