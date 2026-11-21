import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  Activity,
  Users,
  BarChart2,
  History,
  TrendingUp,
  Shield,
  Flame,
} from 'lucide-react';
import { Match, PredictionData } from '../types';
import { PitchLineup } from './PitchLineup';
import { RadarChart } from './RadarChart';
import { MatchHeatmap } from './MatchHeatmap';

interface MatchDetailModalProps {
  match: Match | null;
  prediction: PredictionData | null;
  isAiLoading: boolean;
  onClose: () => void;
  onRequestPrediction: () => void;
  isSubscribed?: boolean;
  onToggleNotification?: (id: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  prediction,
  isAiLoading,
  onClose,
  onRequestPrediction,
  isSubscribed = false,
  onToggleNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'timeline' | 'lineups' | 'stats' | 'h2h' | 'heatmap'>('ai');

  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-base">{match.leagueBadge}</span>
            <span className="text-xs font-bold text-white tracking-wide">{match.league}</span>
            <span className="text-xs text-slate-500">• {match.leagueCountry}</span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleNotification && (
              <button
                onClick={() => onToggleNotification(match.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  isSubscribed
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                }`}
                title={isSubscribed ? 'Notifications Active (Goals & Final Score)' : 'Enable push notifications'}
              >
                <span>🔔</span>
                <span className="hidden sm:inline">{isSubscribed ? 'Alerts ON' : 'Get Alerts'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scoreboard Banner */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-slate-700/60"
                style={{ backgroundColor: `${match.homeTeam.color}22` }}
              >
                <span>{match.homeTeam.logo}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-2 leading-tight">
                {match.homeTeam.name}
              </h3>
              {match.homeTeam.rank && (
                <span className="text-[11px] text-slate-400 mt-0.5">#{match.homeTeam.rank} in League</span>
              )}
            </div>

            {/* Score & Match Status */}
            <div className="px-4 sm:px-8 flex flex-col items-center">
              {match.status === 'LIVE' ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{match.minute}' LIVE</span>
                </div>
              ) : match.status === 'FINISHED' ? (
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
                  FULL TIME
                </span>
              ) : (
                <div className="flex flex-col items-center text-slate-300">
                  <span className="text-xs text-slate-400 font-medium">Starts</span>
                  <span className="text-base font-black font-mono text-white">{match.startTime}</span>
                </div>
              )}

              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-2">
                {match.score.home} - {match.score.away}
              </div>

              {match.score.htHome !== undefined && (
                <span className="text-[11px] text-slate-400 mt-1">
                  (HT {match.score.htHome} - {match.score.htAway})
                </span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-slate-700/60"
                style={{ backgroundColor: `${match.awayTeam.color}22` }}
              >
                <span>{match.awayTeam.logo}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-2 leading-tight">
                {match.awayTeam.name}
              </h3>
              {match.awayTeam.rank && (
                <span className="text-[11px] text-slate-400 mt-0.5">#{match.awayTeam.rank} in League</span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'ai'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Prediction & World Consensus</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setActiveTab('lineups')}
            className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'lineups'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Lineups & Pitch</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Match Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('h2h')}
            className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'h2h'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Head to Head</span>
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'heatmap'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Pitch Heatmap</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-100 flex-1">
          {/* TAB 1: AI PREDICTION */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              {!prediction && !isAiLoading ? (
                <div className="text-center py-8 bg-slate-950/60 rounded-xl border border-slate-800 p-6">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Generate Live AI Match Intelligence</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                    Fetch the most agreed-upon prediction worldwide, comprehensive tactical radar graphs, xG models, and fan polling consensus.
                  </p>
                  <button
                    onClick={onRequestPrediction}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Fetch World Prediction & Analysis</span>
                  </button>
                </div>
              ) : isAiLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <span className="text-xs font-bold text-slate-300">Computing World AI Consensus...</span>
                </div>
              ) : prediction ? (
                <div className="space-y-4">
                  {/* Most Given Prediction Highlight */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>Most Given Prediction Worldwide</span>
                      </div>
                      <p className="text-base sm:text-lg font-black text-white">{prediction.mostGivenPrediction}</p>
                      <span className="text-xs text-slate-300">Confidence: {prediction.confidence}% • Edge: {prediction.recommendedBet}</span>
                    </div>
                  </div>

                  {/* World Consensus Bar */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>World Prediction Consensus</span>
                      <span className="text-slate-400">
                        {prediction.worldConsensus.totalWorldVotesAnalyzed.toLocaleString()} votes
                      </span>
                    </div>
                    <div className="h-5 w-full bg-slate-800 rounded-lg overflow-hidden flex">
                      <div
                        style={{ width: `${prediction.worldConsensus.homeWinPercentage}%` }}
                        className="bg-blue-600 flex items-center justify-center text-[10px] font-black text-white"
                      >
                        {prediction.worldConsensus.homeWinPercentage}%
                      </div>
                      <div
                        style={{ width: `${prediction.worldConsensus.drawPercentage}%` }}
                        className="bg-amber-600 flex items-center justify-center text-[10px] font-black text-white"
                      >
                        {prediction.worldConsensus.drawPercentage}%
                      </div>
                      <div
                        style={{ width: `${prediction.worldConsensus.awayWinPercentage}%` }}
                        className="bg-rose-600 flex items-center justify-center text-[10px] font-black text-white"
                      >
                        {prediction.worldConsensus.awayWinPercentage}%
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-1">
                      <span className="text-blue-400">{match.homeTeam.name} Win</span>
                      <span className="text-amber-400">Draw</span>
                      <span className="text-rose-400">{match.awayTeam.name} Win</span>
                    </div>
                  </div>

                  {/* Radar Tactical Chart */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 self-start">
                      Graphical Tactical Analysis
                    </span>
                    <RadarChart
                      homeName={match.homeTeam.name}
                      awayName={match.awayTeam.name}
                      homeMetrics={prediction.graphicalAnalysis.radarMetrics.homeMetrics}
                      awayMetrics={prediction.graphicalAnalysis.radarMetrics.awayMetrics}
                      size={240}
                    />
                  </div>

                  {/* Tactical Summary */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                      Tactical Summary
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {prediction.graphicalAnalysis.tacticalSummary}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              {match.events.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No match events yet. Match has not kicked off or is awaiting opening whistle.
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
                  {match.events.map((ev, idx) => (
                    <div key={idx} className="relative flex items-center gap-3">
                      <span className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500" />
                      <span className="font-mono text-xs font-black text-blue-400 w-8">{ev.minute}'</span>
                      <div className="flex-1 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">{ev.player}</span>
                          {ev.detail && <span className="text-slate-400 text-[11px]">{ev.detail}</span>}
                        </div>
                        <span className="text-xs uppercase font-black px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {ev.type === 'goal' ? '⚽ GOAL' : ev.type === 'yellow_card' ? '🟨 YELLOW' : 'EVENT'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LINEUPS */}
          {activeTab === 'lineups' && (
            <PitchLineup
              homeTeamName={match.homeTeam.name}
              awayTeamName={match.awayTeam.name}
              homeLineup={match.homeLineup}
              awayLineup={match.awayLineup}
            />
          )}

          {/* TAB 4: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {[
                { label: 'Ball Possession (%)', home: match.stats.possession[0], away: match.stats.possession[1] },
                { label: 'Total Shots', home: match.stats.shots[0], away: match.stats.shots[1] },
                { label: 'Shots on Target', home: match.stats.shotsOnTarget[0], away: match.stats.shotsOnTarget[1] },
                { label: 'Expected Goals (xG)', home: match.stats.xg[0], away: match.stats.xg[1] },
                { label: 'Corners', home: match.stats.corners[0], away: match.stats.corners[1] },
                { label: 'Fouls', home: match.stats.fouls[0], away: match.stats.fouls[1] },
                { label: 'Yellow Cards', home: match.stats.yellowCards[0], away: match.stats.yellowCards[1] },
              ].map((stat, idx) => {
                const total = Number(stat.home) + Number(stat.away) || 1;
                const homePct = Math.round((Number(stat.home) / total) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span className="text-blue-400 font-mono">{stat.home}</span>
                      <span className="text-slate-400">{stat.label}</span>
                      <span className="text-rose-400 font-mono">{stat.away}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div style={{ width: `${homePct}%` }} className="bg-blue-500 h-full" />
                      <div style={{ width: `${100 - homePct}%` }} className="bg-rose-500 h-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: H2H */}
          {activeTab === 'h2h' && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Previous Encounters
              </span>
              {match.h2h.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <span className="text-slate-500">{rec.date}</span>
                  <div className="font-bold text-slate-200">
                    {match.homeTeam.shortName} <span className="font-mono text-white">{rec.homeScore} - {rec.awayScore}</span> {match.awayTeam.shortName}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rec.winner === 'home'
                      ? 'bg-blue-500/20 text-blue-400'
                      : rec.winner === 'away'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {rec.winner.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: HEATMAP */}
          {activeTab === 'heatmap' && (
            <MatchHeatmap match={match} />
          )}
        </div>
      </div>
    </div>
  );
};
