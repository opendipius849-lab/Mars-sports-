import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Trophy,
  Flame,
  Globe,
  Bell,
  RefreshCw,
  ExternalLink,
  Info,
  Calendar,
  Layers,
  BarChart3,
  Search,
} from 'lucide-react';
import { Match, SportType, PredictionData } from './types';
import { initialMatches } from './data/mockMatches';
import { soundManager } from './utils/sound';
import { Header } from './components/Header';
import { DateStrip } from './components/DateStrip';
import { FilterBar, FilterStatus } from './components/FilterBar';
import { MatchCard } from './components/MatchCard';
import { AiPredictionModal } from './components/AiPredictionModal';
import { MatchDetailModal } from './components/MatchDetailModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { StandingsTable } from './components/StandingsTable';
import { SplashScreen } from './components/SplashScreen';
import { NotificationsModal } from './components/NotificationsModal';
import { VipModal } from './components/VipModal';
import { CalendarModal } from './components/CalendarModal';
import { GpsBanner } from './components/GpsBanner';
import { pushNotificationManager } from './utils/notifications';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [matches, setMatches] = useState<Match[]>(() => {
    return initialMatches;
  });

  const [currentSport, setCurrentSport] = useState<SportType>('football');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-20');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [favorites, setFavorites] = useState<string[]>(['epl-1', 'caf-1']);
  const [subscribedMatches, setSubscribedMatches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mars_subscribed_matches');
      return saved ? JSON.parse(saved) : ['caf-1', 'epl-1'];
    } catch {
      return ['caf-1', 'epl-1'];
    }
  });
  const [isVip, setIsVip] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mars_vip_active') === 'true';
    } catch {
      return false;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [predictionModalOpen, setPredictionModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [activePrediction, setActivePrediction] = useState<PredictionData | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeDetailMatch, setActiveDetailMatch] = useState<Match | null>(null);

  // Live Toast for Match Event
  const [liveToast, setLiveToast] = useState<{
    team: string;
    score: string;
    player: string;
    match: string;
  } | null>(null);

  // Toggle Push Notification for a specific match
  const handleToggleNotification = async (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    const isNowSubscribed = !subscribedMatches.includes(matchId);
    const updated = isNowSubscribed
      ? [...subscribedMatches, matchId]
      : subscribedMatches.filter((id) => id !== matchId);

    setSubscribedMatches(updated);
    try {
      localStorage.setItem('mars_subscribed_matches', JSON.stringify(updated));
    } catch {
      // Storage unavailable
    }

    if (isNowSubscribed) {
      await pushNotificationManager.requestPermission();
      soundManager.playWhistle();
      setLiveToast({
        team: match?.homeTeam.name || 'Match',
        score: '🔔 Alerts ON',
        player: 'Subscribed to Goal Alerts & Final Score Updates',
        match: match ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : 'Match Alerts Active',
      });
      setTimeout(() => setLiveToast(null), 4500);
    } else {
      setLiveToast({
        team: match?.homeTeam.name || 'Match',
        score: '🔕 Alerts OFF',
        player: 'Unsubscribed from goal & score updates',
        match: match ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : 'Match Alerts Removed',
      });
      setTimeout(() => setLiveToast(null), 3500);
    }
  };

  const handleClearAllNotifications = () => {
    setSubscribedMatches([]);
    try {
      localStorage.removeItem('mars_subscribed_matches');
    } catch {}
  };

  const handleTestNotification = () => {
    pushNotificationManager.send(
      '⚽ MARS SPORTS Test Push Alert',
      'Goal alerts and final score updates are active for your subscribed matches!'
    );
    soundManager.playGoalChime();
    setLiveToast({
      team: 'MARS SPORTS',
      score: 'Test Alert 🔔',
      player: 'System Push Notifications Active',
      match: 'Goal & Final Score Updates',
    });
    setTimeout(() => setLiveToast(null), 4000);
  };

  const handleActivateVip = () => {
    setIsVip(true);
    try {
      localStorage.setItem('mars_vip_active', 'true');
    } catch {}
    soundManager.playGoalChime();
    setLiveToast({
      team: 'MARS VIP',
      score: '👑 UNLOCKED',
      player: 'Worldwide Predictions VIP Active ($2/mo)',
      match: 'Full Global Percentages Unlocked',
    });
    setTimeout(() => setLiveToast(null), 5000);
  };

  const handleDeactivateVip = () => {
    setIsVip(false);
    try {
      localStorage.removeItem('mars_vip_active');
    } catch {}
    setLiveToast({
      team: 'MARS VIP',
      score: 'VIP Reset',
      player: 'VIP status deactivated',
      match: 'Worldwide Predictions Locked',
    });
    setTimeout(() => setLiveToast(null), 3500);
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync sound manager state
  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.enabled = newState;
    if (newState) {
      soundManager.playWhistle();
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Available leagues for current sport & date
  const availableLeagues = useMemo(() => {
    const sportMatches = matches.filter((m) => m.sport === currentSport);
    const set = new Set<string>();
    sportMatches.forEach((m) => set.add(m.league));
    return Array.from(set);
  }, [matches, currentSport]);

  // Filtered Matches
  const displayedMatches = useMemo(() => {
    return matches.filter((m) => {
      // Filter by sport
      if (m.sport !== currentSport) return false;

      // Filter by league
      if (selectedLeague !== 'ALL' && m.league !== selectedLeague) return false;

      // Filter by status
      if (filterStatus === 'LIVE' && m.status !== 'LIVE') return false;
      if (filterStatus === 'UPCOMING' && m.status !== 'UPCOMING') return false;
      if (filterStatus === 'FINISHED' && m.status !== 'FINISHED') return false;
      if (filterStatus === 'FAVORITES' && !favorites.includes(m.id)) return false;
      if (filterStatus === 'PREDICTIONS' && (!m.quickPredictionPreview || m.quickPredictionPreview.percentage < 55)) {
        return false;
      }

      return true;
    });
  }, [matches, currentSport, selectedLeague, filterStatus, favorites]);

  // Group matches by league
  const groupedMatches = useMemo(() => {
    const groups: { [league: string]: { meta: { country: string; badge: string }; items: Match[] } } = {};
    displayedMatches.forEach((m) => {
      if (!groups[m.league]) {
        groups[m.league] = {
          meta: { country: m.leagueCountry, badge: m.leagueBadge },
          items: [],
        };
      }
      groups[m.league].items.push(m);
    });
    return groups;
  }, [displayedMatches]);

  const liveMatchCount = useMemo(() => {
    return matches.filter((m) => m.status === 'LIVE' && m.sport === currentSport).length;
  }, [matches, currentSport]);

  // AI Match Prediction Fetcher (Calls server-side Gemini AI)
  const handleFetchPrediction = async (
    homeTeam: string,
    awayTeam: string,
    league?: string,
    sport: string = 'football'
  ) => {
    setPredictionModalOpen(true);
    setIsAiLoading(true);
    setActivePrediction(null);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam,
          awayTeam,
          league: league || 'World League',
          sport,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch prediction: ${res.statusText}`);
      }

      const data: PredictionData = await res.json();
      setActivePrediction(data);
    } catch (err) {
      console.error('Error fetching prediction:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Simulate a live event (Goal scored or card)
  const handleSimulateEvent = () => {
    const liveIndex = matches.findIndex((m) => m.status === 'LIVE');
    if (liveIndex === -1) return;

    setMatches((prev) => {
      const updated = [...prev];
      const match = { ...updated[liveIndex] };

      // Alternate home or away goal
      const isHomeScore = Math.random() > 0.45;
      const newScore = {
        ...match.score,
        home: isHomeScore ? match.score.home + 1 : match.score.home,
        away: !isHomeScore ? match.score.away + 1 : match.score.away,
      };

      const scoringPlayer = isHomeScore
        ? (match.homeLineup.startingXI[9]?.name || match.homeTeam.name)
        : (match.awayLineup.startingXI[10]?.name || match.awayTeam.name);

      const newMinute = Math.min(94, (match.minute || 60) + Math.floor(Math.random() * 4) + 1);

      match.minute = newMinute;
      match.score = newScore;
      match.events = [
        ...match.events,
        {
          minute: newMinute,
          type: 'goal',
          teamId: isHomeScore ? match.homeTeam.id : match.awayTeam.id,
          player: scoringPlayer,
          detail: 'Goal! Clinical strike into the net',
        },
      ];

      updated[liveIndex] = match;

      // Send System Push Notification if match is subscribed
      const isSubscribedToMatch = subscribedMatches.includes(match.id);
      if (isSubscribedToMatch) {
        pushNotificationManager.send(
          `⚽ GOAL! ${isHomeScore ? match.homeTeam.name : match.awayTeam.name} (${newScore.home} - ${newScore.away})`,
          `${scoringPlayer} scores! ${match.homeTeam.name} vs ${match.awayTeam.name} • ${newMinute}'`,
          `match-goal-${match.id}`
        );
      }

      // Play Sound
      soundManager.playGoalChime();

      // Show Toast Notification
      setLiveToast({
        team: isHomeScore ? match.homeTeam.name : match.awayTeam.name,
        score: `${newScore.home} - ${newScore.away}`,
        player: isSubscribedToMatch ? `🔔 ${scoringPlayer} (Alert)` : scoringPlayer,
        match: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      });
      setTimeout(() => setLiveToast(null), 5000);

      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Intro / Splash Screen with MS Icon and Letter-by-Letter Animated Reveal */}
      {showIntro && <SplashScreen onComplete={() => setShowIntro(false)} />}

      {/* Live Goal Alert Toast Banner */}
      {liveToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-400/40 flex items-center gap-3.5 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
            ⚽
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-black tracking-wider bg-black/30 px-1.5 py-0.2 rounded">
                GOAL ALERT
              </span>
              <span className="text-xs font-bold text-blue-200">{liveToast.match}</span>
            </div>
            <p className="text-sm font-black mt-0.5">
              {liveToast.player} scored for {liveToast.team}! ({liveToast.score})
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        currentSport={currentSport}
        onSelectSport={(s) => {
          setCurrentSport(s);
          setSelectedLeague('ALL');
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        liveMatchCount={liveMatchCount}
        onSimulateEvent={handleSimulateEvent}
        onLogoClick={() => setShowIntro(true)}
        subscribedCount={subscribedMatches.length}
        onOpenNotifications={() => setNotificationsModalOpen(true)}
        isVip={isVip}
        onOpenVip={() => setVipModalOpen(true)}
      />

      {/* Date Strip */}
      <DateStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onOpenCalendar={() => setCalendarModalOpen(true)}
      />

      {/* Live GPS Banner */}
      <GpsBanner
        onRegionDetected={(reg) => {
          // If user region is Africa, we can optionally highlight local matches or notify
          console.log('GPS Region detected:', reg);
        }}
      />

      {/* Filter Bar */}
      <FilterBar
        currentFilter={filterStatus}
        onSelectFilter={setFilterStatus}
        liveCount={liveMatchCount}
        favoritesCount={favorites.length}
        selectedLeague={selectedLeague}
        onSelectLeague={setSelectedLeague}
        availableLeagues={availableLeagues}
      />

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* HERO AI PREDICTION SPOTLIGHT BANNER */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/30 p-4 sm:p-5 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  MARS AI Engine
                </span>
                <span className="text-xs text-slate-400">
                  Global Consensus & Graphical Analysis
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Search Any Match for World Prediction & Tactical Radar
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                MARS SPORTS AI fetches the most given prediction across global fan polls and sports analytics models, giving you a full tactical radar chart and world win probability percentages.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>Search & Predict Match</span>
              </button>
              <button
                onClick={() => handleFetchPrediction('Arsenal', 'Chelsea', 'Premier League', 'football')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs transition-colors whitespace-nowrap"
              >
                Featured: ARS vs CHE
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Matches List & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matches Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {Object.keys(groupedMatches).length === 0 ? (
              <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800 p-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Matches Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No fixtures match your current filter ({filterStatus}). Try selecting "All Matches" or another sport above.
                </p>
                <button
                  onClick={() => {
                    setFilterStatus('ALL');
                    setSelectedLeague('ALL');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              Object.entries(groupedMatches).map(([leagueName, group]) => (
                <div key={leagueName} className="space-y-2">
                  {/* League Section Header */}
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{group.meta.badge}</span>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">
                        {leagueName}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">• {group.meta.country}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {group.items.length} {group.items.length === 1 ? 'match' : 'matches'}
                    </span>
                  </div>

                  {/* Matches under this league */}
                  <div className="space-y-2">
                    {group.items.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        isFavorite={favorites.includes(match.id)}
                        onToggleFavorite={handleToggleFavorite}
                        isSubscribed={subscribedMatches.includes(match.id)}
                        onToggleNotification={handleToggleNotification}
                        onClick={(m) => setActiveDetailMatch(m)}
                        onRequestPrediction={(home, away, lg, sp) => {
                          handleFetchPrediction(home, away, lg, sp);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar Column: Standings & Quick AI Form Widget */}
          <div className="space-y-6">
            {/* Spotlight AI Consensus Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Top AI Consensus Today
                  </span>
                </div>
                <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                  92% Confidence
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1">
                  <span>Arsenal vs Chelsea</span>
                  <span className="text-emerald-400">2 - 1 Pred.</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Most given world prediction: <strong className="text-slate-200">Arsenal Win (64%) & BTTS Yes</strong>
                </p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">248,500 votes analyzed</span>
                  <button
                    onClick={() => handleFetchPrediction('Arsenal', 'Chelsea', 'Premier League', 'football')}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>View Radar Analysis</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Standings Table */}
            <StandingsTable />

            {/* Quick Live Tips & Sports News */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm text-xs space-y-2.5">
              <span className="font-bold text-slate-300 uppercase tracking-wider block">
                MARS SPORTS AI Features
              </span>
              <ul className="text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>World Consensus %:</strong> Aggregates worldwide fan polling, sports computer models, and implied probabilities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Tactical Radar Chart:</strong> 6-dimensional comparative analysis of Attack, Defense, Form, H2H, Depth, and Tactics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span><strong>Search Any Match:</strong> Type any two teams in the search bar to run an instant AI prediction on demand.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 py-4 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-400 tracking-wider">MARS SPORTS</span>
            <span>•</span>
            <span>Real-time Scores & AI Prediction Consensus</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Powered by PIUS TECH • Realtime Sports Intelligence
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. AI Prediction Modal */}
      <AiPredictionModal
        prediction={activePrediction}
        isLoading={isAiLoading}
        onClose={() => setPredictionModalOpen(false)}
        isVip={isVip}
        onOpenVip={() => setVipModalOpen(true)}
        onRefresh={() => {
          if (activePrediction) {
            handleFetchPrediction(
              activePrediction.homeTeam,
              activePrediction.awayTeam,
              activePrediction.league,
              activePrediction.sport
            );
          }
        }}
      />

      {/* 2. Match Details Modal */}
      <MatchDetailModal
        match={activeDetailMatch}
        prediction={activePrediction}
        isAiLoading={isAiLoading}
        onClose={() => setActiveDetailMatch(null)}
        isSubscribed={activeDetailMatch ? subscribedMatches.includes(activeDetailMatch.id) : false}
        onToggleNotification={handleToggleNotification}
        onRequestPrediction={() => {
          if (activeDetailMatch) {
            handleFetchPrediction(
              activeDetailMatch.homeTeam.name,
              activeDetailMatch.awayTeam.name,
              activeDetailMatch.league,
              activeDetailMatch.sport
            );
          }
        }}
      />

      {/* 3. Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        matches={matches}
        onSelectMatch={(m) => setActiveDetailMatch(m)}
        onRequestPrediction={(home, away, lg, sp) => {
          handleFetchPrediction(home, away, lg, sp);
        }}
      />

      {/* 4. Match Push Notifications Modal */}
      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        subscribedMatchIds={subscribedMatches}
        matches={matches}
        onToggleNotification={handleToggleNotification}
        onClearAll={handleClearAllNotifications}
        onTestNotification={handleTestNotification}
      />

      {/* 5. VIP Predictions Subscription Modal ($2/month to +256744062690) */}
      <VipModal
        isOpen={vipModalOpen}
        onClose={() => setVipModalOpen(false)}
        isVip={isVip}
        onActivateVip={handleActivateVip}
        onDeactivateVip={handleDeactivateVip}
      />

      {/* 6. Month-View Calendar Modal */}
      <CalendarModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={(d) => setSelectedDate(d)}
      />
    </div>
  );
}
