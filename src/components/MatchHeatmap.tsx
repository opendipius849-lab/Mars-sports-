import React, { useState } from 'react';
import { Flame, Activity, Shield, Zap } from 'lucide-react';
import { Match } from '../types';

interface MatchHeatmapProps {
  match: Match;
}

export const MatchHeatmap: React.FC<MatchHeatmapProps> = ({ match }) => {
  const [selectedView, setSelectedView] = useState<'overall' | 'home' | 'away'>('overall');
  const [activeZone, setActiveZone] = useState<string | null>(null);

  // Generate deterministic intensity based on match ID and stats
  const seed = match.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // 6 Pitch Zones: [Defensive Left, Defensive Center, Defensive Right, Attacking Left, Attacking Center, Attacking Right]
  // Or a 3x3 grid (Defense, Midfield, Attack x Left, Center, Right)
  const zones = [
    { id: 'def-left', name: 'Defensive Left Flank', homeVal: 45 + (seed % 30), awayVal: 60 + ((seed * 2) % 30) },
    { id: 'def-center', name: 'Defensive Penalty Box', homeVal: 70 + ((seed * 3) % 25), awayVal: 85 + (seed % 15) },
    { id: 'def-right', name: 'Defensive Right Flank', homeVal: 50 + ((seed * 4) % 35), awayVal: 55 + ((seed * 3) % 30) },
    { id: 'mid-left', name: 'Midfield Left Channel', homeVal: 65 + ((seed * 5) % 25), awayVal: 70 + ((seed * 2) % 20) },
    { id: 'mid-center', name: 'Central Midfield Engine', homeVal: 88 + (seed % 10), awayVal: 90 + ((seed * 4) % 10) },
    { id: 'mid-right', name: 'Midfield Right Channel', homeVal: 72 + ((seed * 6) % 20), awayVal: 68 + ((seed * 5) % 25) },
    { id: 'att-left', name: 'Attacking Left Wing', homeVal: 80 + ((seed * 7) % 18), awayVal: 62 + ((seed * 3) % 30) },
    { id: 'att-center', name: 'Opponent Box / Final Third', homeVal: 92 + (seed % 8), awayVal: 84 + ((seed * 2) % 15) },
    { id: 'att-right', name: 'Attacking Right Wing', homeVal: 78 + ((seed * 3) % 20), awayVal: 74 + ((seed * 4) % 20) },
  ];

  const getIntensityColor = (val: number) => {
    if (val >= 85) return 'bg-rose-600/80 border-rose-400 text-white shadow-lg shadow-rose-600/50';
    if (val >= 70) return 'bg-amber-500/70 border-amber-400 text-slate-950 shadow-md shadow-amber-500/40';
    if (val >= 55) return 'bg-yellow-500/60 border-yellow-400 text-slate-950';
    return 'bg-blue-600/40 border-blue-400/60 text-slate-200';
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              In-Game Activity Heatmap
            </h4>
            <span className="text-[10px] text-slate-400">Tactical pressure & territorial dominance</span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setSelectedView('overall')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedView === 'overall' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overall Match
          </button>
          <button
            onClick={() => setSelectedView('home')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedView === 'home' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {match.homeTeam.shortName}
          </button>
          <button
            onClick={() => setSelectedView('away')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedView === 'away' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {match.awayTeam.shortName}
          </button>
        </div>
      </div>

      {/* Football Pitch Heatmap Graphic */}
      <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl border-2 border-emerald-700/60 overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
        {/* Grass striping */}
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(to_right,transparent,transparent_40px,rgba(255,255,255,0.06)_40px,rgba(255,255,255,0.06)_80px)] pointer-events-none" />

        {/* Pitch boundary & markings */}
        <div className="absolute inset-3 border-2 border-white/30 rounded-lg pointer-events-none" />
        <div className="absolute top-3 bottom-3 left-1/2 -translate-x-1/2 border-r-2 border-white/30 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full pointer-events-none" />

        {/* Left Goal Box (Home) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-16 h-36 border-r-2 border-y-2 border-white/30 pointer-events-none" />
        {/* Right Goal Box (Away) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-16 h-36 border-l-2 border-y-2 border-white/30 pointer-events-none" />

        {/* 3x3 Heatmap Grid overlay */}
        <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-2.5 h-full w-full p-2">
          {zones.map((zone) => {
            const val =
              selectedView === 'home'
                ? zone.homeVal
                : selectedView === 'away'
                ? zone.awayVal
                : Math.round((zone.homeVal + zone.awayVal) / 2);

            const isSelected = activeZone === zone.id;

            return (
              <div
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`rounded-xl border border-white/20 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.03] ${getIntensityColor(
                  val
                )} ${isSelected ? 'ring-4 ring-white shadow-xl scale-105' : 'opacity-85 hover:opacity-100'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-tight text-center px-1 drop-shadow">
                  {zone.name.split(' ')[0]} {zone.name.split(' ')[1]}
                </span>
                <span className="text-sm font-black font-mono drop-shadow-md">{val}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Detail Card & Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-white">
            <span>{activeZone ? zones.find((z) => z.id === activeZone)?.name : 'Select a Pitch Zone'}</span>
            <span className="text-amber-400 font-mono">
              {activeZone
                ? `${
                    selectedView === 'home'
                      ? zones.find((z) => z.id === activeZone)?.homeVal
                      : selectedView === 'away'
                      ? zones.find((z) => z.id === activeZone)?.awayVal
                      : Math.round(
                          ((zones.find((z) => z.id === activeZone)?.homeVal || 0) +
                            (zones.find((z) => z.id === activeZone)?.awayVal || 0)) /
                            2
                        )
                  }% Intensity`
                : 'Click zone for detail'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {activeZone
              ? `High tactical duel frequency and ball retention observed in this sector during the ${match.league}.`
              : 'Tap any grid sector on the pitch above to inspect pressing intensity and ball recovery rates.'}
          </p>
        </div>

        {/* Heatmap Color Intensity Legend */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block mb-2">
            Activity Intensity Scale
          </span>
          <div className="flex items-center gap-1.5 h-3 rounded-lg overflow-hidden border border-slate-700">
            <div className="flex-1 bg-blue-600 h-full" title="Low (0-55%)" />
            <div className="flex-1 bg-yellow-500 h-full" title="Moderate (55-70%)" />
            <div className="flex-1 bg-amber-500 h-full" title="High (70-85%)" />
            <div className="flex-1 bg-rose-600 h-full" title="Hotspot (85-100%)" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>Low (Low Press)</span>
            <span>Hotspot (High Press)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
