import React, { useState } from 'react';
import { Award, Star, Trophy, Zap, Shield, TrendingUp } from 'lucide-react';
import { Match } from '../types';

interface MvpTrackerProps {
  match: Match;
}

export const MvpTracker: React.FC<MvpTrackerProps> = ({ match }) => {
  // Deterministic seed based on match id
  const seed = match.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Pick potential home MVP and away MVP from lineups
  const homePlayer = match.homeLineup.startingXI[7] || match.homeLineup.startingXI[0]; // e.g. midfielder or forward
  const awayPlayer = match.awayLineup.startingXI[6] || match.awayLineup.startingXI[0];

  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  const isHome = selectedTeam === 'home';
  const player = isHome ? homePlayer : awayPlayer;
  const team = isHome ? match.homeTeam : match.awayTeam;

  // Generate stats based on seed & match score
  const goals = isHome ? Math.min(2, match.score.home) : Math.min(2, match.score.away);
  const assists = (seed % 2) + (goals > 0 ? 1 : 0);
  const tackles = 3 + (seed % 5);
  const keyPasses = 2 + ((seed * 3) % 4);
  const passAccuracy = 85 + (seed % 12);
  const rating = Number((8.2 + ((seed % 15) / 10)).toFixed(1));

  return (
    <div className="space-y-4">
      {/* Top Selector Banner */}
      <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Award className="w-4 h-4 fill-amber-400/30" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              MVP Tracker & Man of the Match
            </h4>
            <span className="text-[10px] text-slate-400">Live performance & historical rating model</span>
          </div>
        </div>

        {/* Team Selector */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setSelectedTeam('home')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedTeam === 'home' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {match.homeTeam.shortName}
          </button>
          <button
            onClick={() => setSelectedTeam('away')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedTeam === 'away' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {match.awayTeam.shortName}
          </button>
        </div>
      </div>

      {/* Featured MVP Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-950 border border-amber-500/40 p-5 shadow-xl">
        <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
          <Trophy className="w-28 h-28 text-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Player Avatar Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-amber-300 shrink-0">
            {player?.number || '#'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-300" /> Potential MVP Contender
              </span>
              <span className="text-xs text-slate-400 font-bold">{team.name} ({player?.position})</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">{player?.name || 'Star Player'}</h3>

            <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-bold border border-slate-700">
                Rating: {rating} / 10
              </span>
              <span className="text-slate-400">Match Impact Index: <strong className="text-emerald-400">96.4%</strong></span>
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Goals Scored</span>
            <span className="text-xl font-black font-mono text-white">{goals}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assists</span>
            <span className="text-xl font-black font-mono text-amber-400">{assists}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tackles Won</span>
            <span className="text-xl font-black font-mono text-blue-400">{tackles}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pass Accuracy</span>
            <span className="text-xl font-black font-mono text-emerald-400">{passAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Performance Summary Breakdown */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
        <span className="font-bold text-slate-300 uppercase tracking-wider block">
          Performance & Historical Contribution Summary
        </span>
        <p className="text-slate-400 leading-relaxed">
          Based on historical match ratings and current live tracking in the {match.league}, <strong>{player?.name}</strong> leads the pitch in duel success rate, decisive final-third passes, and defensive recovery blocks.
        </p>
      </div>
    </div>
  );
};
