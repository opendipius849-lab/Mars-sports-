import React, { useState } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Globe,
  Share2,
  Check,
  Shield,
  Zap,
  Target,
  BarChart3,
  Flame,
  Award,
  Vote,
  Compass,
  Crown,
  Lock,
} from 'lucide-react';
import { PredictionData } from '../types';
import { RadarChart } from './RadarChart';

interface AiPredictionModalProps {
  prediction: PredictionData | null;
  isLoading: boolean;
  onClose: () => void;
  onRefresh?: () => void;
  isVip?: boolean;
  onOpenVip?: () => void;
}

export const AiPredictionModal: React.FC<AiPredictionModalProps> = ({
  prediction,
  isLoading,
  onClose,
  onRefresh,
  isVip = false,
  onOpenVip,
}) => {
  const [userVote, setUserVote] = useState<'home' | 'draw' | 'away' | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeRegion, setActiveRegion] = useState<'europe' | 'americas' | 'asia' | 'africa'>('europe');
  const [activeTab, setActiveTab] = useState<'graphics' | 'tactics' | 'consensus'>('graphics');

  if (!prediction && !isLoading) return null;

  // Handle user casting their vote
  const handleVote = (choice: 'home' | 'draw' | 'away') => {
    if (userVote) return;
    setUserVote(choice);
  };

  const handleShare = () => {
    if (!prediction) return;
    const shareText = `MARS SPORTS AI Prediction: ${prediction.homeTeam} vs ${prediction.awayTeam}\n` +
      `🔥 Most Given Prediction: ${prediction.mostGivenPrediction}\n` +
      `🌍 World Consensus: ${prediction.worldConsensus.homeWinPercentage}% Home | ${prediction.worldConsensus.drawPercentage}% Draw | ${prediction.worldConsensus.awayWinPercentage}% Away\n` +
      `Confidence: ${prediction.confidence}%`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  MARS AI Match Intelligence
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Global Consensus
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {prediction ? `${prediction.league} • ${prediction.sport.toUpperCase()}` : 'Analyzing fixture data...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {prediction && (
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                title="Share Prediction"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="text-center">
                <h4 className="text-base font-bold text-white">Aggregating World Predictions...</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Querying global fan sentiment, head-to-head records, live tactical metrics, and sports analytics models.
                </p>
              </div>
            </div>
          ) : prediction ? (
            <>
              {/* Fixture Hero Header */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-900/40 p-4">
                <div className="flex items-center justify-between text-center">
                  <div className="flex-1 text-left sm:text-center">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Home</span>
                    <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">{prediction.homeTeam}</h3>
                    <span className="text-xs text-slate-400">
                      Proj: {prediction.projectedScore.home} goals
                    </span>
                  </div>

                  <div className="px-3 sm:px-6 flex flex-col items-center">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-bold text-slate-300">
                      VS
                    </span>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-400 font-medium">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{prediction.confidence}% Confidence</span>
                    </div>
                  </div>

                  <div className="flex-1 text-right sm:text-center">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">Away</span>
                    <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">{prediction.awayTeam}</h3>
                    <span className="text-xs text-slate-400">
                      Proj: {prediction.projectedScore.away} goals
                    </span>
                  </div>
                </div>

                {/* THE MOST GIVEN PREDICTION (HERO HIGHLIGHT) */}
                <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                        Most Given Prediction Worldwide
                      </span>
                      <p className="text-base sm:text-lg font-black text-white leading-tight">
                        {prediction.mostGivenPrediction}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-left sm:text-right bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-700/40">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Recommended Edge</span>
                    <span className="text-xs font-bold text-emerald-400">{prediction.recommendedBet}</span>
                  </div>
                </div>
              </div>

              {/* WORLD PREDICTION PERCENTAGE SECTION (VIP FEATURE: $2/mo) */}
              <div className="relative bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>World Prediction Percentage</span>
                      {isVip ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-400/30 flex items-center gap-1">
                          <Crown className="w-3 h-3 fill-amber-300" /> VIP UNLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-400/30 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> VIP • $2/mo
                        </span>
                      )}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    Analyzed{' '}
                    <strong className="text-slate-200">
                      {prediction.worldConsensus.totalWorldVotesAnalyzed.toLocaleString()}
                    </strong>{' '}
                    global votes
                  </span>
                </div>

                {/* If Not VIP, Display Sleek VIP Lock Card with Secret Payment Number */}
                {!isVip && (
                  <div className="my-2 p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 text-center space-y-2.5 z-10 relative shadow-xl">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                      <Crown className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-white uppercase tracking-wide">
                        Worldwide Predictions Percentage (VIP Feature)
                      </h5>
                      <p className="text-xs text-slate-300 max-w-md mx-auto mt-0.5">
                        Unlock live world prediction percentages, exact scoreline probabilities, and continental polling consensus for just <strong className="text-amber-300">$2 / month</strong>.
                      </p>
                      <p className="text-[11px] text-amber-200/90 font-mono mt-1">
                        Send $2 to Secret Number: <strong className="underline text-amber-300">+256744062690</strong>
                      </p>
                    </div>

                    <button
                      onClick={onOpenVip}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all flex items-center gap-1.5 mx-auto"
                    >
                      <Crown className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Unlock VIP Access ($2/month)</span>
                    </button>
                  </div>
                )}

                {/* Multi-segment World Consensus Bar (Blurred if not VIP) */}
                <div className={`space-y-2 transition-all ${!isVip ? 'filter blur-[3px] select-none pointer-events-none opacity-40' : ''}`}>
                  <div className="h-6 w-full bg-slate-800 rounded-lg overflow-hidden flex shadow-inner border border-slate-700/60">
                    {/* Home Win */}
                    <div
                      style={{ width: `${prediction.worldConsensus.homeWinPercentage}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-xs font-black text-white transition-all duration-700 relative group"
                      title={`${prediction.homeTeam} Win: ${prediction.worldConsensus.homeWinPercentage}%`}
                    >
                      {prediction.worldConsensus.homeWinPercentage >= 15 && (
                        <span>{prediction.worldConsensus.homeWinPercentage}%</span>
                      )}
                    </div>
                    {/* Draw */}
                    <div
                      style={{ width: `${prediction.worldConsensus.drawPercentage}%` }}
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-500 flex items-center justify-center text-xs font-black text-white transition-all duration-700 relative group"
                      title={`Draw: ${prediction.worldConsensus.drawPercentage}%`}
                    >
                      {prediction.worldConsensus.drawPercentage >= 12 && (
                        <span>{prediction.worldConsensus.drawPercentage}%</span>
                      )}
                    </div>
                    {/* Away Win */}
                    <div
                      style={{ width: `${prediction.worldConsensus.awayWinPercentage}%` }}
                      className="h-full bg-gradient-to-r from-rose-600 to-rose-500 flex items-center justify-center text-xs font-black text-white transition-all duration-700 relative group"
                      title={`${prediction.awayTeam} Win: ${prediction.worldConsensus.awayWinPercentage}%`}
                    >
                      {prediction.worldConsensus.awayWinPercentage >= 15 && (
                        <span>{prediction.worldConsensus.awayWinPercentage}%</span>
                      )}
                    </div>
                  </div>

                  {/* Percentage Labels */}
                  <div className="flex items-center justify-between text-xs font-semibold pt-1">
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>{prediction.homeTeam} Win ({prediction.worldConsensus.homeWinPercentage}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Draw ({prediction.worldConsensus.drawPercentage}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>{prediction.awayTeam} Win ({prediction.worldConsensus.awayWinPercentage}%)</span>
                    </div>
                  </div>
                </div>

                {/* Interactive World Fan Polling */}
                <div className={`mt-4 pt-4 border-t border-slate-800/80 ${!isVip ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <Vote className="w-3.5 h-3.5 text-blue-400" />
                      <span>Cast Your Prediction into World Consensus:</span>
                    </div>
                    {userVote && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Vote Registered
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleVote('home')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                        userVote === 'home'
                          ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                          : 'bg-slate-800/80 hover:bg-blue-900/40 text-slate-200 border-slate-700 hover:border-blue-500/50'
                      }`}
                    >
                      {prediction.homeTeam} Win
                    </button>
                    <button
                      onClick={() => handleVote('draw')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                        userVote === 'draw'
                          ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30 ring-2 ring-amber-400'
                          : 'bg-slate-800/80 hover:bg-amber-900/40 text-slate-200 border-slate-700 hover:border-amber-500/50'
                      }`}
                    >
                      Draw
                    </button>
                    <button
                      onClick={() => handleVote('away')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                        userVote === 'away'
                          ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30 ring-2 ring-rose-400'
                          : 'bg-slate-800/80 hover:bg-rose-900/40 text-slate-200 border-slate-700 hover:border-rose-500/50'
                      }`}
                    >
                      {prediction.awayTeam} Win
                    </button>
                  </div>
                </div>
              </div>

              {/* NAVIGATION TABS FOR GRAPHICAL ANALYSIS */}
              <div className="flex border-b border-slate-800 gap-2">
                <button
                  onClick={() => setActiveTab('graphics')}
                  className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === 'graphics'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Graphical Analysis</span>
                </button>
                <button
                  onClick={() => setActiveTab('tactics')}
                  className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === 'tactics'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Tactical Breakdown & Duel</span>
                </button>
                <button
                  onClick={() => setActiveTab('consensus')}
                  className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === 'consensus'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Regional & Expert Sources</span>
                </button>
              </div>

              {/* TAB 1: GRAPHICAL ANALYSIS */}
              {activeTab === 'graphics' && (
                <div className="space-y-6">
                  {/* Radar Tactical Matrix & Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                    {/* SVG Radar Chart */}
                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
                      <div className="w-full flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Tactical Radar Comparison
                        </span>
                        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-semibold">
                          6 Attributes
                        </span>
                      </div>
                      <RadarChart
                        homeName={prediction.homeTeam}
                        awayName={prediction.awayTeam}
                        homeMetrics={prediction.graphicalAnalysis.radarMetrics.homeMetrics}
                        awayMetrics={prediction.graphicalAnalysis.radarMetrics.awayMetrics}
                        size={250}
                      />
                    </div>

                    {/* Secondary Visual Charts: Scoreline Probabilities & Goals */}
                    <div className="space-y-4">
                      {/* Scoreline Probability Matrix */}
                      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Most Likely Scorelines
                          </span>
                          <Target className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div className="space-y-2">
                          {prediction.scorelineProbabilities.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                              <span className="font-mono font-bold w-10 text-slate-200">{item.score}</span>
                              <div className="flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    idx === 0
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                      : idx === 1
                                      ? 'bg-blue-600/70'
                                      : 'bg-slate-600'
                                  }`}
                                  style={{ width: `${item.probability * 3}%` }}
                                />
                              </div>
                              <span className="w-10 text-right font-bold text-slate-300">{item.probability}%</span>
                              <span className="text-[10px] text-slate-400 hidden sm:inline w-28 truncate text-right">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Over/Under & BTTS dials */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
                          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                            Over 2.5 Goals
                          </span>
                          <div className="text-xl font-black text-emerald-400">
                            {prediction.worldConsensus.over25GoalsPercentage}%
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${prediction.worldConsensus.over25GoalsPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
                          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                            Both Teams To Score
                          </span>
                          <div className="text-xl font-black text-blue-400">
                            {prediction.worldConsensus.bttsYesPercentage}%
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${prediction.worldConsensus.bttsYesPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expected Goals (xG) & Possession Forecast */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Projected Expected Goals (xG)
                      </span>
                      <span className="text-xs text-slate-400">
                        {prediction.graphicalAnalysis.expectedGoals.homeXg.toFixed(2)} vs{' '}
                        {prediction.graphicalAnalysis.expectedGoals.awayXg.toFixed(2)}
                      </span>
                    </div>

                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        style={{
                          width: `${(prediction.graphicalAnalysis.expectedGoals.homeXg /
                            (prediction.graphicalAnalysis.expectedGoals.homeXg +
                              prediction.graphicalAnalysis.expectedGoals.awayXg || 1)) *
                            100}%`,
                        }}
                        className="bg-blue-500 h-full"
                      />
                      <div
                        style={{
                          width: `${(prediction.graphicalAnalysis.expectedGoals.awayXg /
                            (prediction.graphicalAnalysis.expectedGoals.homeXg +
                              prediction.graphicalAnalysis.expectedGoals.awayXg || 1)) *
                            100}%`,
                        }}
                        className="bg-rose-500 h-full"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>{prediction.homeTeam} xG: {prediction.graphicalAnalysis.expectedGoals.homeXg}</span>
                      <span>{prediction.awayTeam} xG: {prediction.graphicalAnalysis.expectedGoals.awayXg}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TACTICAL BREAKDOWN & DUEL */}
              {activeTab === 'tactics' && (
                <div className="space-y-4">
                  {/* Key Matchup Box */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <Zap className="w-4 h-4" />
                      <span>Key Duel to Decide the Match</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 text-sm font-bold text-white mb-2">
                      <span className="text-blue-400">{prediction.graphicalAnalysis.keyMatchup.playerHome}</span>
                      <span className="text-slate-500 text-xs uppercase">VERSUS</span>
                      <span className="text-rose-400">{prediction.graphicalAnalysis.keyMatchup.playerAway}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {prediction.graphicalAnalysis.keyMatchup.description}
                    </p>
                  </div>

                  {/* Tactical Summary */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                      Tactical Blueprint
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {prediction.graphicalAnalysis.tacticalSummary}
                    </p>
                  </div>

                  {/* Strengths & Weaknesses Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        {prediction.homeTeam} Strengths
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                        {prediction.graphicalAnalysis.keyStrengthsHome.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        {prediction.awayTeam} Strengths
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                        {prediction.graphicalAnalysis.keyStrengthsAway.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: REGIONAL & EXPERT SOURCES */}
              {activeTab === 'consensus' && (
                <div className="space-y-4">
                  {/* Regional Breakdown Tabs */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
                      Global Fan Consensus by Continent
                    </span>

                    <div className="flex gap-2 mb-3">
                      {(['europe', 'americas', 'asia', 'africa'] as const).map((reg) => (
                        <button
                          key={reg}
                          onClick={() => setActiveRegion(reg)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                            activeRegion === reg
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {reg}
                        </button>
                      ))}
                    </div>

                    {prediction.worldConsensus.sentimentByRegion[activeRegion] && (
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-800 rounded-md overflow-hidden flex">
                          <div
                            style={{
                              width: `${prediction.worldConsensus.sentimentByRegion[activeRegion].home}%`,
                            }}
                            className="bg-blue-500 h-full"
                          />
                          <div
                            style={{
                              width: `${prediction.worldConsensus.sentimentByRegion[activeRegion].draw}%`,
                            }}
                            className="bg-amber-500 h-full"
                          />
                          <div
                            style={{
                              width: `${prediction.worldConsensus.sentimentByRegion[activeRegion].away}%`,
                            }}
                            className="bg-rose-500 h-full"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-300 font-semibold">
                          <span className="text-blue-400">
                            {prediction.homeTeam}: {prediction.worldConsensus.sentimentByRegion[activeRegion].home}%
                          </span>
                          <span className="text-amber-400">
                            Draw: {prediction.worldConsensus.sentimentByRegion[activeRegion].draw}%
                          </span>
                          <span className="text-rose-400">
                            {prediction.awayTeam}: {prediction.worldConsensus.sentimentByRegion[activeRegion].away}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expert Sources List */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
                      Aggregated Expert & Engine Sources
                    </span>
                    <div className="space-y-2.5">
                      {prediction.expertSourcesConsensus.map((src, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-200 block">{src.source}</span>
                            <span className="text-slate-400">{src.prediction}</span>
                          </div>
                          <span className="font-mono font-bold text-blue-400 px-2 py-1 bg-blue-500/10 rounded border border-blue-500/20">
                            {src.confidence}% Match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Realtime Engine • Powered by PIUS TECH</span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors disabled:opacity-50"
            >
              Re-calculate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
