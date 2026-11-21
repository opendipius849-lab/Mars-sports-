import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Bell,
  Crown,
  MoreVertical,
  PlayCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { SportType } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  currentSport: SportType;
  onSelectSport: (sport: SportType) => void;
  onOpenSearch: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  liveMatchCount: number;
  onSimulateEvent: () => void;
  onLogoClick?: () => void;
  subscribedCount?: number;
  onOpenNotifications?: () => void;
  isVip?: boolean;
  onOpenVip?: () => void;
}

const SPORTS: { id: SportType; label: string; icon: string }[] = [
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'basketball', label: 'Basketball', icon: '🏀' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'cricket', label: 'Cricket', icon: '🏏' },
];

export const Header: React.FC<HeaderProps> = ({
  currentSport,
  onSelectSport,
  onOpenSearch,
  soundEnabled,
  onToggleSound,
  liveMatchCount,
  onSimulateEvent,
  onLogoClick,
  subscribedCount = 0,
  onOpenNotifications,
  isVip = false,
  onOpenVip,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Primary Top Bar - Clean & Orderly */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand with MS Icon in blue athletic style */}
        <Logo size="md" showText={true} onClick={onLogoClick} />

        {/* Global Search Bar (LiveScore Style with AI Trigger) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Search match or ask AI world prediction...</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1 text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-bold">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
              <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">⌘K</kbd>
            </div>
          </button>
        </div>

        {/* Right Section: Mobile Search + 3-Dotted Vertical Option Menu */}
        <div className="flex items-center gap-2">
          {/* Search Trigger for Mobile / Small Screens */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Search matches"
          >
            <Search className="w-4 h-4 text-blue-400" />
          </button>

          {/* 3-Dotted Vertical Option Menu Container */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`relative p-2 rounded-xl border transition-all duration-200 ${
                menuOpen
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 ring-2 ring-blue-500/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-850'
              }`}
              title="More Features & Options"
              aria-label="Features Menu"
            >
              <MoreVertical className="w-5 h-5" />

              {/* Badges on the 3-dots button for active state indicators */}
              {isVip && (
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-950"
                  title="VIP Active"
                />
              )}
              {!isVip && subscribedCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-950 animate-pulse"
                  title="Push Alerts Active"
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900/98 border border-slate-700/80 rounded-2xl shadow-2xl p-2 backdrop-blur-xl z-50 text-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150">
                {/* Header in Menu */}
                <div className="px-3 py-2 border-b border-slate-800 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    App Features & Tools
                  </span>
                  {isVip && (
                    <span className="text-[10px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5 fill-amber-300" /> VIP Active
                    </span>
                  )}
                </div>

                {/* 1. VIP Worldwide Predictions */}
                {onOpenVip && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenVip();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Crown className="w-4 h-4 fill-amber-400/30" />
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>Worldwide Predictions VIP</span>
                        </div>
                        <span className="text-[11px] text-amber-300/80 font-medium">
                          {isVip ? 'Manage VIP Membership' : '$2/month • Pay to +256744062690'}
                        </span>
                      </div>
                    </div>
                    {isVip ? (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        ON
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded shadow">
                        $2/mo
                      </span>
                    )}
                  </button>
                )}

                {/* 2. Match Push Notifications */}
                {onOpenNotifications && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenNotifications();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Push Alert Subscriptions</div>
                        <span className="text-[11px] text-slate-400">
                          {subscribedCount > 0
                            ? `${subscribedCount} active match alert${subscribedCount === 1 ? '' : 's'}`
                            : 'Goal & final score alerts'}
                        </span>
                      </div>
                    </div>
                    {subscribedCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono font-black text-[10px]">
                        {subscribedCount}
                      </span>
                    )}
                  </button>
                )}

                {/* 3. Simulate Live Goal / Event */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onSimulateEvent();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Simulate Live Goal</div>
                      <span className="text-[11px] text-slate-400">Test live score updates & alert chime</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/20">
                    Test
                  </span>
                </button>

                {/* 4. Live Sound Toggle */}
                <button
                  onClick={() => {
                    onToggleSound();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 group-hover:scale-105 transition-transform">
                      {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div>
                      <div className="font-bold text-white">Referee & Goal Chimes</div>
                      <span className="text-[11px] text-slate-400">
                        {soundEnabled ? 'Whistle & stadium audio enabled' : 'Sound alerts muted'}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      soundEnabled
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* 5. Replay Intro Screen */}
                {onLogoClick && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogoClick();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group text-left border-t border-slate-800/80 mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0 group-hover:scale-105 transition-transform">
                        <PlayCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Replay Intro Animation</div>
                        <span className="text-[11px] text-slate-500">MS logo & letter typing intro</span>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sports Category Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 border-t border-slate-800/80 overflow-x-auto no-scrollbar py-1">
        {SPORTS.map((sport) => {
          const isActive = currentSport === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => onSelectSport(sport.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{sport.icon}</span>
              <span>{sport.label}</span>
              {sport.id === 'football' && liveMatchCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                    isActive ? 'bg-white text-blue-600' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {liveMatchCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
