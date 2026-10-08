import React, { useEffect } from 'react';
import { Bell, CheckCircle2, X } from 'lucide-react';

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

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl relative overflow-hidden">
        {/* Glow ambient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400" />

        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                Habit Reminder
              </span>
              <span className="text-xs text-slate-400">
                {notification.time}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white leading-tight">
              {notification.habitTitle}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              {notification.message || 'Time to stay consistent and complete your routine!'}
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => {
                  onMarkDone(notification.habit);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Done</span>
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
