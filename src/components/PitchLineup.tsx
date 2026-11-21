import React from 'react';
import { LineupData } from '../types';

interface PitchLineupProps {
  homeTeamName: string;
  awayTeamName: string;
  homeLineup: LineupData;
  awayLineup: LineupData;
}

export const PitchLineup: React.FC<PitchLineupProps> = ({
  homeTeamName,
  awayTeamName,
  homeLineup,
  awayLineup,
}) => {
  return (
    <div className="space-y-4">
      {/* Formations Header */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>{homeTeamName}</span>
          <span className="text-slate-400 font-mono">({homeLineup.formation})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono">({awayLineup.formation})</span>
          <span>{awayTeamName}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
        </div>
      </div>

      {/* Football Pitch Graphic */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/4.5] bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl border-2 border-emerald-700/60 overflow-hidden shadow-2xl p-4">
        {/* Pitch grass striping pattern */}
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_30px,rgba(255,255,255,0.06)_30px,rgba(255,255,255,0.06)_60px)]" />

        {/* Pitch boundary line */}
        <div className="absolute inset-3 border-2 border-white/30 rounded-lg pointer-events-none" />

        {/* Halfway line */}
        <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 border-t-2 border-white/30 pointer-events-none" />

        {/* Centre circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full pointer-events-none" />

        {/* Top Penalty Box (Away Team) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-44 h-20 border-b-2 border-x-2 border-white/30 pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-20 h-8 border-b-2 border-x-2 border-white/30 pointer-events-none" />

        {/* Bottom Penalty Box (Home Team) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-44 h-20 border-t-2 border-x-2 border-white/30 pointer-events-none" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-20 h-8 border-t-2 border-x-2 border-white/30 pointer-events-none" />

        {/* Away Players (Top Half) */}
        {awayLineup.startingXI.map((player, idx) => (
          <div
            key={`away-${idx}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-600 border border-white text-white font-black text-[10px] sm:text-xs flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              {player.number}
            </div>
            <span className="text-[10px] font-bold text-white bg-black/60 px-1 rounded mt-0.5 whitespace-nowrap shadow backdrop-blur-sm">
              {player.name}
            </span>
          </div>
        ))}

        {/* Home Players (Bottom Half) */}
        {homeLineup.startingXI.map((player, idx) => (
          <div
            key={`home-${idx}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 border border-white text-white font-black text-[10px] sm:text-xs flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              {player.number}
            </div>
            <span className="text-[10px] font-bold text-white bg-black/60 px-1 rounded mt-0.5 whitespace-nowrap shadow backdrop-blur-sm">
              {player.name}
              {player.isCaptain && ' (C)'}
            </span>
          </div>
        ))}
      </div>

      {/* Substitutes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div>
          <span className="font-bold text-blue-400 block mb-1">{homeTeamName} Substitutes:</span>
          <span className="text-slate-400">{homeLineup.substitutes.join(', ')}</span>
        </div>
        <div>
          <span className="font-bold text-rose-400 block mb-1">{awayTeamName} Substitutes:</span>
          <span className="text-slate-400">{awayLineup.substitutes.join(', ')}</span>
        </div>
      </div>
    </div>
  );
};
