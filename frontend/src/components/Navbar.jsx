import React from 'react';
import {
  Flame,
  Plus,
  LogOut,
  Shield,
  Lock,
  Camera,
  Sparkles,
  Award,
  Trophy,
  Gem,
  Crown,
  Zap,
} from 'lucide-react';

const TIER_ICONS = {
  bronze: Shield,
  silver: Award,
  gold: Trophy,
  platinum: Sparkles,
  diamond: Gem,
  mythic: Crown,
};

const Navbar = ({
  currentUser,
  onNewHabit,
  onLogout,
  onOpenProfile,
  onOpenVault,
  gamificationData,
  onOpenAchievements,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/70 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              HabitTracker
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              PRO
            </span>
          </div>
        </div>

        {/* Right Actions: Level & Tier Pill, New Habit, Private Vault, User Avatar, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Level & Tier Badge Pill */}
          {gamificationData && (() => {
            const TierIcon = TIER_ICONS[gamificationData.currentTierKey] || Shield;
            return (
              <button
                type="button"
                onClick={onOpenAchievements}
                title={`Rank: ${gamificationData.currentTier.name} Tier • Level ${gamificationData.currentLevel} (${gamificationData.levelTitle}) • Click to view Badges & Tier progression`}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border ${gamificationData.currentTier.borderClass} ${gamificationData.currentTier.bgClass} hover:brightness-110 shadow-md ${gamificationData.currentTier.glowColor} transition-all cursor-pointer group`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center p-1 bg-slate-950/70 border border-white/10"
                  style={{ color: gamificationData.currentTier.color }}
                >
                  <TierIcon className="w-4 h-4" />
                </div>
                <div className="text-left hidden xs:block">
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${gamificationData.currentTier.accentText}`}>
                      {gamificationData.currentTier.name}
                    </span>
                    <span className="text-[9px] font-extrabold text-white bg-slate-950/80 px-1 py-0.2 rounded border border-slate-800">
                      Lv.{gamificationData.currentLevel}
                    </span>
                  </div>
                  <div className="w-12 sm:w-16 h-1 bg-slate-950 rounded-full overflow-hidden mt-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${gamificationData.progressPercent}%`,
                        backgroundColor: gamificationData.currentTier.color,
                      }}
                    />
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-0.5 text-[10px] font-bold text-amber-400 pl-0.5">
                  <Zap className="w-2.5 h-2.5 fill-amber-400" />
                  <span>{gamificationData.totalXp}</span>
                </div>
              </button>
            );
          })()}

          {/* New Habit CTA */}
          <button
            onClick={onNewHabit}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Habit</span>
          </button>

          {/* Quick Access to Private Vault */}
          <button
            onClick={onOpenVault}
            title="Open Private Vault (PIN Protected)"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline text-slate-200">Vault</span>
            <Lock className="w-3 h-3 text-amber-400" />
          </button>

          {/* User Profile Avatar (Clickable to open Profile & Photo settings) */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-800">
            <button
              onClick={() => onOpenProfile('profile')}
              title="Click to edit profile & change photo"
              className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-800/60 transition-all cursor-pointer group text-left"
            >
              {/* Avatar Frame with Image / Initials */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:ring-2 group-hover:ring-indigo-500/40 transition-all">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] overflow-hidden flex items-center justify-center font-bold text-white text-sm">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentUser?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                </div>

                {/* Subtle Camera Badge */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Name & Email info */}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-slate-200 leading-tight group-hover:text-white transition-colors">
                  {currentUser?.name || 'Habit Builder'}
                </p>
                <p className="text-xs text-slate-400 truncate max-w-[110px]">
                  {currentUser?.email || 'user@example.com'}
                </p>
              </div>
            </button>

            {/* Logout CTA */}
            <button
              onClick={onLogout}
              title="Log Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700/60 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
