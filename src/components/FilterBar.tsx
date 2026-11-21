import React from 'react';
import { Sparkles, Star, Radio } from 'lucide-react';

export type FilterStatus = 'ALL' | 'LIVE' | 'UPCOMING' | 'FINISHED' | 'PREDICTIONS' | 'FAVORITES';

interface FilterBarProps {
  currentFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
  liveCount: number;
  favoritesCount: number;
  selectedLeague: string;
  onSelectLeague: (league: string) => void;
  availableLeagues: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onSelectFilter,
  liveCount,
  favoritesCount,
  selectedLeague,
  onSelectLeague,
  availableLeagues,
}) => {
  const FILTERS: { id: FilterStatus; label: string; count?: number; icon?: React.ReactNode }[] = [
    { id: 'ALL', label: 'All Matches' },
    {
      id: 'LIVE',
      label: 'Live',
      count: liveCount,
      icon: (
        <span className="relative flex h-2 w-2 mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      ),
    },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'FINISHED', label: 'Finished' },
    {
      id: 'PREDICTIONS',
      label: 'AI Picks',
      icon: <Sparkles className="w-3.5 h-3.5 text-blue-400 mr-1" />,
    },
    {
      id: 'FAVORITES',
      label: 'Favorites',
      count: favoritesCount > 0 ? favoritesCount : undefined,
      icon: <Star className="w-3.5 h-3.5 text-amber-400 mr-1 fill-amber-400/30" />,
    },
  ];

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => {
            const isActive = currentFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onSelectFilter(f.id)}
                className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm shadow-blue-500/30'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {f.icon}
                <span>{f.label}</span>
                {f.count !== undefined && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                      isActive ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* League Quick Filters */}
        {availableLeagues.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
              Competition:
            </span>
            <button
              onClick={() => onSelectLeague('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                selectedLeague === 'ALL'
                  ? 'bg-slate-800 text-white font-bold border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              All Leagues
            </button>
            {availableLeagues.map((lg) => (
              <button
                key={lg}
                onClick={() => onSelectLeague(lg)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedLeague === lg
                    ? 'bg-slate-800 text-blue-400 font-bold border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {lg}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
