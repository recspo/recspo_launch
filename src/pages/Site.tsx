import React from "react";
import heroImg from "@/assets/sports-hero.jpg";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, Flame, ArrowRight, Medal } from "lucide-react";

const teams = [
  { name: "Titans Football", record: "11-1", color: "from-amber-500 to-yellow-300" },
  { name: "Raiders Basketball", record: "22-3", color: "from-yellow-400 to-amber-600" },
  { name: "Strikers Soccer", record: "15-2", color: "from-amber-300 to-yellow-500" },
  { name: "Aces Baseball", record: "18-4", color: "from-yellow-500 to-amber-400" },
];

const events = [
  { date: "MAY 04", title: "Championship Final", venue: "Main Stadium" },
  { date: "MAY 11", title: "Rivalry Night", venue: "North Arena" },
  { date: "MAY 18", title: "Track Invitational", venue: "East Field" },
];

const Site = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[100vh] flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt="College sports championship moment under stadium lights"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 grid-bg opacity-30" />

        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-6 z-10">
          <div className="font-display text-2xl text-gradient-gold">COLLEGE SPORTS</div>
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-foreground/80">
            <a href="#teams" className="hover:text-primary transition-colors">Teams</a>
            <a href="#events" className="hover:text-primary transition-colors">Events</a>
            <a href="#stats" className="hover:text-primary transition-colors">Stats</a>
          </div>
        </nav>

        <div className="relative z-10 px-6 md:px-12 pb-20 max-w-5xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/40 mb-6">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">Now Live</span>
          </div>
          <h1 className="font-display text-6xl md:text-9xl leading-[0.9] text-foreground">
            Where Champions <br />
            <span className="text-gradient-gold">Are Forged.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/80">
            The official home of college athletics. Live scores, team stories, championship moments — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="bg-gradient-gold text-primary-foreground font-display text-lg px-8 h-14 shadow-gold hover:scale-105 transition-transform">
              Explore Teams <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" className="h-14 px-8 font-display text-lg border-primary/40 hover:bg-primary/10">
              Watch Highlights
            </Button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section id="stats" className="border-y border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: "24", l: "Varsity Teams" },
            { v: "1.2K+", l: "Athletes" },
            { v: "47", l: "Championships" },
            { v: "92%", l: "Win Rate" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-5xl md:text-6xl text-gradient-gold">{s.v}</div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Teams */}
      <section id="teams" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-primary mb-2">// Roster</p>
            <h2 className="font-display text-5xl md:text-6xl text-foreground">Featured Teams</h2>
          </div>
          <Trophy className="w-12 h-12 text-primary hidden md:block" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((t, i) => (
            <div
              key={t.name}
              className="group relative bg-card border border-border rounded-2xl p-6 overflow-hidden hover:border-primary/60 transition-all hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${t.color} group-hover:opacity-40 transition-opacity`} />
              <Medal className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-display text-2xl text-foreground">{t.name}</h3>
              <p className="text-muted-foreground text-sm mt-1 uppercase tracking-widest">Season Record</p>
              <div className="font-display text-4xl text-gradient-gold mt-2">{t.record}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section id="events" className="bg-card/40 border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-primary mb-2">// Schedule</p>
            <h2 className="font-display text-5xl md:text-6xl text-foreground">Upcoming Events</h2>
          </div>
          <div className="space-y-4">
            {events.map((e) => (
              <div
                key={e.title}
                className="flex items-center gap-6 md:gap-12 p-6 bg-background border border-border rounded-xl hover:border-primary/60 hover:shadow-gold transition-all group"
              >
                <Calendar className="w-6 h-6 text-primary shrink-0" />
                <div className="font-display text-3xl md:text-4xl text-gradient-gold w-32 shrink-0">
                  {e.date}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl text-foreground">{e.title}</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-widest mt-1">{e.venue}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-center">
        <Users className="w-12 h-12 text-primary mx-auto mb-6" />
        <h2 className="font-display text-5xl md:text-7xl text-foreground">
          Be Part Of The <span className="text-gradient-gold">Legacy.</span>
        </h2>
        <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
          From freshman tryouts to championship trophies — your journey lives here.
        </p>
        <Button className="mt-8 bg-gradient-gold text-primary-foreground font-display text-lg px-10 h-14 shadow-gold hover:scale-105 transition-transform">
          Join The Movement
        </Button>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        © College Sports · Launched by the crowd
      </footer>
    </div>
  );
};

export default Site;