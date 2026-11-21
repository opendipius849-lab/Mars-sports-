import React from 'react';
import { Star, Sparkles, Bell, BellRing } from 'lucide-react';
import { Match } from '../types';

interface MatchCardProps {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isSubscribed?: boolean;
  onToggleNotification?: (id: string) => void;
  onClick: (match: Match) => void;
  onRequestPrediction: (home: string, away: string, league?: string, sport?: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isFavorite,
  onToggleFavorite,
  isSubscribed = false,
  onToggleNotification,
  onClick,
  onRequestPrediction,
}) => {
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';

  return (
    <div
      onClick={() => onClick(match)}
      className={`group relative bg-slate-900/90 hover:bg-slate-850 border rounded-xl p-3.5 sm:p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
        isLive
          ? 'border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-950/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Status / Time */}
        <div className="w-14 sm:w-16 shrink-0 flex flex-col items-start justify-center">
          {isLive ? (
            <div className="flex flex-col items-start">
              <span className="flex items-center gap-1 text-[11px] font-black text-emerald-400 font-mono tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                {match.minute}'
              </span>
              <span className="text-[9px] font-bold uppercase text-emerald-500/80">LIVE</span>
            </div>
          ) : isFinished ? (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">FT</span>
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-xs font-black font-mono text-slate-200">{match.startTime}</span>
              <span className="text-[10px] text-slate-500 font-medium">Kickoff</span>
            </div>
          )}
        </div>

        {/* Middle: Teams & Scores */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base select-none">{match.homeTeam.logo}</span>
              <span
                className={`text-xs sm:text-sm font-bold truncate ${
                  isFinished && match.score.home > match.score.away
                    ? 'text-white font-black'
                    : isLive && match.score.home > match.score.away
                    ? 'text-white'
                    : 'text-slate-200'
                }`}
              >
                {match.homeTeam.name}
              </span>
            </div>
            <span
              className={`font-mono text-sm sm:text-base font-black px-2 py-0.5 rounded ${
                isLive
                  ? 'text-emerald-400 bg-emerald-950/40'
                  : isFinished
                  ? 'text-slate-100'
                  : 'text-slate-600'
              }`}
            >
              {match.status === 'UPCOMING' ? '-' : match.score.home}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base select-none">{match.awayTeam.logo}</span>
              <span
                className={`text-xs sm:text-sm font-bold truncate ${
                  isFinished && match.score.away > match.score.home
                    ? 'text-white font-black'
                    : isLive && match.score.away > match.score.home
                    ? 'text-white'
                    : 'text-slate-200'
                }`}
              >
                {match.awayTeam.name}
              </span>
            </div>
            <span
              className={`font-mono text-sm sm:text-base font-black px-2 py-0.5 rounded ${
                isLive
                  ? 'text-emerald-400 bg-emerald-950/40'
                  : isFinished
                  ? 'text-slate-100'
                  : 'text-slate-600'
              }`}
            >
              {match.status === 'UPCOMING' ? '-' : match.score.away}
            </span>
          </div>
        </div>

        {/* Right: Actions (AI Analysis, Bell Notifications, Favorite Star) */}
        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
          {/* AI Prediction Quick Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestPrediction(match.homeTeam.name, match.awayTeam.name, match.league, match.sport);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 hover:border-blue-400 text-xs font-bold transition-all shadow-sm"
            title="Fetch AI Prediction & Graphical Analysis"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">AI Analysis</span>
          </button>

          {/* Bell Icon Push Notification Toggle */}
          {onToggleNotification && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleNotification(match.id);
              }}
              className={`relative p-2 rounded-lg transition-all border ${
                isSubscribed
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/20 ring-1 ring-amber-400/40'
                  : 'bg-slate-900/80 text-slate-500 hover:text-amber-400 hover:bg-slate-800 border-slate-800'
              }`}
              title={
                isSubscribed
                  ? 'Push Alerts Active: Click to unsubscribe from goal alerts & final score'
                  : 'Subscribe to Push Alerts: Receive instant goal alerts & final score updates'
              }
            >
              {isSubscribed ? (
                <>
                  <BellRing className="w-4 h-4 fill-amber-400/30 text-amber-400 animate-wiggle" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-slate-900 animate-pulse" />
                </>
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Favorite Star */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(match.id);
            }}
            className={`p-2 rounded-lg transition-colors border ${
              isFavorite
                ? 'bg-slate-900/80 text-amber-400 border-slate-800 hover:bg-slate-800'
                : 'bg-slate-900/80 text-slate-600 hover:text-slate-400 border-slate-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Footer: Quick Prediction Preview, Notification Badge & Odds */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          {match.quickPredictionPreview ? (
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <span className="text-[10px] uppercase tracking-wider bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20 font-bold">
                AI Forecast
              </span>
              <span className="truncate">
                {match.quickPredictionPreview.percentage}% {match.quickPredictionPreview.favorite} ({match.quickPredictionPreview.score})
              </span>
            </div>
          ) : (
            <span className="text-slate-500">LiveScore Match Data</span>
          )}

          {isSubscribed && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
              <Bell className="w-2.5 h-2.5" />
              Alerts ON
            </span>
          )}
        </div>

        {match.odds && (
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400 font-bold">
            <span className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700">{match.odds.home.toFixed(2)}</span>
            {match.odds.draw > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700">{match.odds.draw.toFixed(2)}</span>
            )}
            <span className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700">{match.odds.away.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
