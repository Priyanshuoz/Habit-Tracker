import React, { useEffect } from 'react';
import { Bell, CheckCircle2, X, Droplets, Footprints } from 'lucide-react';

const NotificationToast = ({ notification, onClose, onMarkDone }) => {
  // Auto-dismiss after 12 seconds if not interacted with
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 12000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isHydration =
    notification.type === 'hydration' ||
    notification.reminderCategory === 'hydration' ||
    notification.habitTitle?.toLowerCase().includes('water') ||
    notification.habitTitle?.toLowerCase().includes('hydration');

  const isWalk =
    notification.type === 'walk' ||
    notification.reminderCategory === 'walk' ||
    notification.habitTitle?.toLowerCase().includes('walk') ||
    notification.habitTitle?.toLowerCase().includes('step');

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl relative overflow-hidden">
        {/* Glow ambient bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isHydration
              ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400'
              : isWalk
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500'
              : 'bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400'
          }`}
        />

        <div className="flex items-start justify-between gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isHydration
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                : isWalk
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}
          >
            {isHydration ? (
              <Droplets className="w-5 h-5 animate-pulse text-cyan-400" />
            ) : isWalk ? (
              <Footprints className="w-5 h-5 animate-bounce text-emerald-400" />
            ) : (
              <Bell className="w-5 h-5 animate-bounce" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  isHydration
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                    : isWalk
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {isHydration
                  ? '💧 Hydration Nudge'
                  : isWalk
                  ? '🚶 Walk & Move'
                  : 'Habit Reminder'}
              </span>
              <span className="text-xs text-slate-400">
                {notification.time}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white leading-tight">
              {notification.habitTitle}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              {notification.message || 'Time to stay consistent and check in!'}
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => {
                  if (notification.habit) {
                    onMarkDone(notification.habit);
                  }
                  onClose();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md transition-all cursor-pointer ${
                  isHydration
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/25'
                    : isWalk
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {isHydration
                    ? 'Drank Glass (💧)'
                    : isWalk
                    ? 'Walk Completed'
                    : 'Mark as Done'}
                </span>
              </button>

              <button
                onClick={onClose}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
