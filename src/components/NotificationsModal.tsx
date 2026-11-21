import React, { useState } from 'react';
import { Bell, BellOff, X, Check, Volume2, ShieldCheck, Zap, Trash2 } from 'lucide-react';
import { Match } from '../types';
import { pushNotificationManager } from '../utils/notifications';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribedMatchIds: string[];
  matches: Match[];
  onToggleNotification: (matchId: string) => void;
  onClearAll: () => void;
  onTestNotification: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  subscribedMatchIds,
  matches,
  onToggleNotification,
  onClearAll,
  onTestNotification,
}) => {
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [finalScoreAlerts, setFinalScoreAlerts] = useState(true);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const subscribedMatches = matches.filter((m) => subscribedMatchIds.includes(m.id));
  const hasBrowserPermission = pushNotificationManager.isGranted();

  const handleTest = () => {
    onTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4 fill-amber-400/30" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Match Push Alerts & Subscriptions
              </h3>
              <span className="text-xs text-slate-400">
                {subscribedMatches.length} match{subscribedMatches.length === 1 ? '' : 'es'} subscribed
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-100 text-xs">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <div>
                <span className="font-bold text-white block">System Push Notifications</span>
                <span className="text-[11px] text-slate-400">
                  {hasBrowserPermission
                    ? 'Browser notification permission granted'
                    : 'In-app toasts & audio alerts active (Click to request system alerts)'}
                </span>
              </div>
            </div>
            {!hasBrowserPermission && (
              <button
                onClick={async () => {
                  await pushNotificationManager.requestPermission();
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors whitespace-nowrap"
              >
                Enable
              </button>
            )}
          </div>

          {/* Granular Alert Preferences */}
          <div className="space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider block">
              Active Alert Types
            </span>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800 cursor-pointer hover:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚽</span>
                  <div>
                    <span className="font-bold text-white block">Goal Alerts</span>
                    <span className="text-[11px] text-slate-400">Instant notification when a goal is scored</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={goalAlerts}
                  onChange={(e) => setGoalAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800 cursor-pointer hover:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏁</span>
                  <div>
                    <span className="font-bold text-white block">Final Score Updates</span>
                    <span className="text-[11px] text-slate-400">Full-time result & match conclusion alert</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={finalScoreAlerts}
                  onChange={(e) => setFinalScoreAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
                />
              </label>
            </div>
          </div>

          {/* List of Subscribed Matches */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-400 uppercase tracking-wider">
                Subscribed Matches ({subscribedMatches.length})
              </span>
              {subscribedMatches.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {subscribedMatches.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/40 rounded-xl border border-slate-800 space-y-1">
                <BellOff className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-bold text-slate-300">No match subscriptions yet</p>
                <p className="text-slate-500 text-[11px]">
                  Click the bell icon on any match card to receive live goal alerts and final score updates.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {subscribedMatches.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs">{m.leagueBadge}</span>
                      <span className="font-bold text-white truncate">
                        {m.homeTeam.name} vs {m.awayTeam.name}
                      </span>
                      {m.status === 'LIVE' && (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                          {m.minute}' LIVE
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onToggleNotification(m.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Unsubscribe"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-t border-slate-800 text-xs">
          <button
            onClick={handleTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-colors"
          >
            {testSent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
            <span>{testSent ? 'Alert Dispatched!' : 'Test Push Alert'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
