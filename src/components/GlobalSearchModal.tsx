import React, { useState } from 'react';
import { Search, X, Sparkles, Flame, Clock, ArrowRight, Trophy } from 'lucide-react';
import { Match } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  onRequestPrediction: (home: string, away: string, league?: string, sport?: string) => void;
}

const TRENDING_SEARCHES = [
  { label: 'Arsenal vs Chelsea', home: 'Arsenal', away: 'Chelsea', league: 'Premier League', sport: 'football' },
  { label: 'Al Ahly vs Mamelodi Sundowns', home: 'Al Ahly SC', away: 'Mamelodi Sundowns', league: 'CAF Champions League', sport: 'football' },
  { label: 'Nigeria vs Senegal (AFCON)', home: 'Nigeria (Super Eagles)', away: 'Senegal (Lions)', league: 'Africa Cup of Nations', sport: 'football' },
  { label: 'Real Madrid vs Bayern Munich', home: 'Real Madrid', away: 'Bayern Munich', league: 'Champions League', sport: 'football' },
  { label: 'Orlando Pirates vs Kaizer Chiefs', home: 'Orlando Pirates', away: 'Kaizer Chiefs', league: 'South African Premier Division', sport: 'football' },
  { label: 'Man City vs Liverpool', home: 'Manchester City', away: 'Liverpool', league: 'Premier League', sport: 'football' },
  { label: 'Barcelona vs Atletico Madrid', home: 'Barcelona', away: 'Atlético Madrid', league: 'La Liga', sport: 'football' },
  { label: 'Boston Celtics vs LA Lakers', home: 'Boston Celtics', away: 'Los Angeles Lakers', league: 'NBA', sport: 'basketball' },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  matches,
  onSelectMatch,
  onRequestPrediction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filter current matches
  const filteredMatches = matches.filter((m) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return false;
    return (
      m.homeTeam.name.toLowerCase().includes(q) ||
      m.awayTeam.name.toLowerCase().includes(q) ||
      m.league.toLowerCase().includes(q) ||
      `${m.homeTeam.name} vs ${m.awayTeam.name}`.toLowerCase().includes(q)
    );
  });

  const handleCustomAiSearch = () => {
    if (!searchTerm.trim()) return;
    const parts = searchTerm.split(/\s+(?:vs\.?|v|against|-)\s+/i);
    let home = searchTerm.trim();
    let away = 'Opponent';
    if (parts.length >= 2) {
      home = parts[0].trim();
      away = parts[1].trim();
    }
    onRequestPrediction(home, away, 'Global League', 'football');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden mt-6 sm:mt-12">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-950 border-b border-slate-800">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams or type a match (e.g. Arsenal vs Chelsea)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base outline-none font-medium"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCustomAiSearch();
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            Esc
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Active AI Search Prompt */}
          {searchTerm.trim().length > 2 && (
            <div
              onClick={handleCustomAiSearch}
              className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/50 via-slate-900 to-indigo-900/50 border border-blue-500/40 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between group shadow-lg shadow-blue-950/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      AI Instant Prediction
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                      World Consensus
                    </span>
                  </div>
                  <p className="text-sm font-black text-white mt-0.5">
                    Analyze & Predict: <span className="text-blue-300">"{searchTerm}"</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Fetch AI Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* Filtered Live Matches */}
          {filteredMatches.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Matching Live & Upcoming Fixtures
              </span>
              <div className="space-y-1.5">
                {filteredMatches.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectMatch(m);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{m.leagueBadge}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-400">{m.league}</div>
                        <div className="text-sm font-black text-white">
                          {m.homeTeam.name} vs {m.awayTeam.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {m.status === 'LIVE' ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{m.minute}'</span>
                          <span className="font-mono ml-1">{m.score.home}-{m.score.away}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">{m.startTime}</span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestPrediction(m.homeTeam.name, m.awayTeam.name, m.league, m.sport);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Predict</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Global Matches */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Trending Predictions Worldwide</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TRENDING_SEARCHES.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onRequestPrediction(item.home, item.away, item.league, item.sport);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block group-hover:text-blue-300">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.league}</span>
                    </div>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
