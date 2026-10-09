import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Shield,
  Gem,
  Crown,
  Sparkles,
  Flame,
  Zap,
  Target,
  CheckCircle2,
  Lock,
  X,
  Layers,
  Scale,
  Droplets,
  Footprints,
  Star,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { TIERS, LEVEL_MILESTONES } from '../utils/gamificationUtils';

// Icon mapping helper
const BADGE_ICONS = {
  Target,
  Layers,
  CheckCircle2,
  Scale,
  Flame,
  Sparkles,
  Award,
  Trophy,
  Crown,
  Droplets,
  Footprints,
  Lock,
  Gem,
  Shield,
};

const TIER_ICONS = {
  bronze: Shield,
  silver: Award,
  gold: Trophy,
  platinum: Sparkles,
  diamond: Gem,
  mythic: Crown,
};

const AchievementsModal = ({
  isOpen,
  onClose,
  gamificationData,
}) => {
  const [filterCategory, setFilterCategory] = useState('all');

  if (!isOpen || !gamificationData) return null;

  const {
    totalXp,
    currentLevel,
    levelTitle,
    currentTierKey,
    currentTier,
    nextLevel,
    nextLevelTitle,
    xpInCurrentLevel,
    xpForNextLevel,
    progressPercent,
    xpRemaining,
    nextTier,
    badges,
    unlockedBadgesCount,
    totalBadgesCount,
  } = gamificationData;

  const TierIcon = TIER_ICONS[currentTierKey] || Shield;

  // Filter badges
  const filteredBadges = badges.filter((b) => {
    if (filterCategory === 'unlocked') return b.unlocked;
    if (filterCategory === 'locked') return !b.unlocked;
    if (filterCategory === 'goals') return b.category === 'Goals';
    if (filterCategory === 'consistency') return b.category === 'Consistency';
    if (filterCategory === 'wellness') return b.category === 'Wellness';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Glow */}
        <div
          className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${currentTier.gradientBg} pointer-events-none opacity-80`}
        />

        {/* Modal Header */}
        <div className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${currentTier.borderClass} ${currentTier.bgClass} shadow-lg ${currentTier.glowColor}`}>
              <TierIcon className={`w-6 h-6 ${currentTier.accentText}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Achievements & Tier Progression
                </h2>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${currentTier.pillBg}`}>
                  {currentTier.label} TIER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Level up by following your plan, checking in routines, and conquering goals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar">

          {/* 1. Main Tier & Level Card */}
          <div className={`p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border ${currentTier.borderClass} shadow-xl relative overflow-hidden`}>
            
            {/* Ambient decorative circle */}
            <div
              className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: currentTier.color }}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              
              {/* Left: Big Tier Emblem & Level Title */}
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center p-1 border-2 ${currentTier.borderClass} shadow-2xl ${currentTier.glowColor}`}
                    style={{
                      background: `radial-gradient(circle at top, ${currentTier.color}33, #020617 80%)`,
                    }}
                  >
                    <TierIcon className={`w-10 h-10 ${currentTier.accentText}`} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-black text-white shadow-md">
                    Lv. {currentLevel}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Current Rank
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${currentTier.pillBg}`}>
                      {currentTier.levelRange}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {levelTitle}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    {currentTier.description}
                  </p>
                </div>
              </div>

              {/* Right: Total XP & Stats Pill */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <div className="text-left md:text-right">
                  <span className="text-[11px] font-medium text-slate-400 block">Total Experience</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white tracking-tight">
                      {totalXp.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-indigo-400">XP</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    <strong className="text-white">{unlockedBadgesCount}</strong> / {totalBadgesCount} Badges Unlocked
                  </span>
                </div>
              </div>
            </div>

            {/* Level XP Progress Bar */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Progress to <strong>{nextLevelTitle || 'Maximum Rank'}</strong>
                  </span>
                </span>
                <span className="font-bold text-white">
                  {nextLevel ? `${progressPercent}% (${xpRemaining} XP remaining)` : 'Max Level'}
                </span>
              </div>

              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${currentTier.color}, #6366f1)`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Level {currentLevel} ({totalXp} XP)</span>
                {nextLevel && (
                  <span>
                    Level {nextLevel} ({(totalXp + xpRemaining).toLocaleString()} XP)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Tier Roadmap Ladder */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tier Progression Roadmap</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Follow your plan to advance ranks
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.entries(TIERS).map(([key, tier]) => {
                const isCurrent = key === currentTierKey;
                const tierKeys = Object.keys(TIERS);
                const curIdx = tierKeys.indexOf(currentTierKey);
                const thisIdx = tierKeys.indexOf(key);
                const isPassed = thisIdx < curIdx;
                const TIcon = TIER_ICONS[key] || Shield;

                return (
                  <div
                    key={key}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? `bg-slate-900 border-2 ${tier.borderClass} shadow-md ${tier.glowColor} ring-1 ring-white/10`
                        : isPassed
                        ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex justify-center mb-1.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${tier.color}22`,
                          color: tier.color,
                        }}
                      >
                        <TIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className={`text-xs font-black uppercase ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                      {tier.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {tier.levelRange}
                    </p>
                    <div className="mt-1.5">
                      {isCurrent ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Active
                        </span>
                      ) : isPassed ? (
                        <span className="text-[9px] font-bold text-emerald-400">
                          ✓ Cleared
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-600">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Badges Showcase Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Goal & Plan Badges</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                    {unlockedBadgesCount} / {totalBadgesCount}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Earn achievement badges for completing specific goals and maintaining routine streaks
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'unlocked', label: `Unlocked (${unlockedBadgesCount})` },
                  { id: 'locked', label: `Locked (${totalBadgesCount - unlockedBadgesCount})` },
                  { id: 'goals', label: 'Goals' },
                  { id: 'consistency', label: 'Plans' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterCategory(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      filterCategory === tab.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredBadges.map((badge) => {
                const IconComponent = BADGE_ICONS[badge.icon] || Award;
                const isUnlocked = badge.unlocked;

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600 shadow-md hover:shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800/70 opacity-70 hover:opacity-90'
                    }`}
                  >
                    {/* Unlocked status accent banner */}
                    {isUnlocked && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/20 via-indigo-500/10 to-transparent pointer-events-none" />
                    )}

                    <div className="space-y-3">
                      {/* Badge Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center p-2 border transition-all ${
                            isUnlocked
                              ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-300 shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          {isUnlocked ? (
                            <IconComponent className="w-5 h-5" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-500" />
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              badge.rarity === 'Legendary'
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                : badge.rarity === 'Epic'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : badge.rarity === 'Rare'
                                ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {badge.rarity}
                          </span>
                          <span className="text-[10px] font-bold text-amber-400">
                            +{badge.xpReward} XP
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <span>{badge.title}</span>
                          {isUnlocked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                          )}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    </div>

                    {/* Badge Bottom Progress */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      {isUnlocked ? (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                            <span>Unlocked</span>
                          </span>
                          <span className="text-slate-400 font-semibold">
                            Completed
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium">Requirement Progress:</span>
                            <span className="text-slate-300 font-bold">
                              {badge.progressText}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round((badge.progress / badge.maxProgress) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Plan Following XP Breakdown Guide */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-slate-300 space-y-2">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>How Experience (XP) & Levels Increase:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-white block">+20 XP</span>
                <span className="text-slate-400">Per Goal sub-habit check-in</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-white block">+300 XP</span>
                <span className="text-slate-400">Per Completed Goal Plan</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-white block">+10 XP & Streaks</span>
                <span className="text-slate-400">Regular habits (+5 XP/day streak)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-white block">+80 to +500 XP</span>
                <span className="text-slate-400">Per Achievement Badge</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="relative z-10 px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Keep following your daily plans to reach <strong className="text-white">{nextTier ? `${nextTier.name} Tier` : 'Legend'}</strong>!
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default AchievementsModal;
