// Gamification System: Tiers (Bronze, Silver, Gold, Platinum, Diamond, Mythic),
// Level Progression, XP Calculation, and Badges for Goals & Plan Following

export const TIERS = {
  bronze: {
    name: 'Bronze',
    label: 'BRONZE',
    levelRange: 'Levels 1 – 4',
    minLevel: 1,
    maxLevel: 4,
    color: '#cd7f32',
    accentText: 'text-amber-400',
    borderClass: 'border-amber-600/40',
    bgClass: 'bg-amber-950/40',
    gradientBg: 'from-amber-700/20 via-orange-800/10 to-amber-900/5',
    pillBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    glowColor: 'shadow-amber-600/20',
    trophyIcon: 'Shield',
    description: 'The foundation of discipline. Forging powerful new routines.',
  },
  silver: {
    name: 'Silver',
    label: 'SILVER',
    levelRange: 'Levels 5 – 9',
    minLevel: 5,
    maxLevel: 9,
    color: '#c0c0c0',
    accentText: 'text-slate-200',
    borderClass: 'border-slate-400/40',
    bgClass: 'bg-slate-800/40',
    gradientBg: 'from-slate-400/20 via-slate-600/10 to-zinc-800/10',
    pillBg: 'bg-slate-300/15 text-slate-100 border-slate-400/30',
    glowColor: 'shadow-slate-400/25',
    trophyIcon: 'Award',
    description: 'Steady rhythm and relentless execution across daily plans.',
  },
  gold: {
    name: 'Gold',
    label: 'GOLD',
    levelRange: 'Levels 10 – 14',
    minLevel: 10,
    maxLevel: 14,
    color: '#ffd700',
    accentText: 'text-yellow-400',
    borderClass: 'border-yellow-500/50',
    bgClass: 'bg-yellow-950/40',
    gradientBg: 'from-yellow-500/25 via-amber-500/15 to-orange-950/10',
    pillBg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    glowColor: 'shadow-yellow-500/30',
    trophyIcon: 'Trophy',
    description: 'Mastery over personal growth. Consistent plan conqueror.',
  },
  platinum: {
    name: 'Platinum',
    label: 'PLATINUM',
    levelRange: 'Levels 15 – 19',
    minLevel: 15,
    maxLevel: 19,
    color: '#e5e4e2',
    accentText: 'text-cyan-300',
    borderClass: 'border-cyan-400/40',
    bgClass: 'bg-cyan-950/40',
    gradientBg: 'from-cyan-500/20 via-indigo-500/20 to-sky-900/10',
    pillBg: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30',
    glowColor: 'shadow-cyan-500/30',
    trophyIcon: 'Sparkles',
    description: 'Elite performer operating with unwavering focus and clarity.',
  },
  diamond: {
    name: 'Diamond',
    label: 'DIAMOND',
    levelRange: 'Levels 20 – 24',
    minLevel: 20,
    maxLevel: 24,
    color: '#b9f2ff',
    accentText: 'text-blue-300',
    borderClass: 'border-blue-400/50',
    bgClass: 'bg-blue-950/40',
    gradientBg: 'from-blue-500/25 via-cyan-400/20 to-indigo-950/15',
    pillBg: 'bg-blue-500/15 text-blue-200 border-blue-400/30',
    glowColor: 'shadow-blue-500/40',
    trophyIcon: 'Gem',
    description: 'Crystal-hard habits that nothing can break. True peak performance.',
  },
  mythic: {
    name: 'Mythic',
    label: 'MYTHIC',
    levelRange: 'Level 25+',
    minLevel: 25,
    maxLevel: 99,
    color: '#f43f5e',
    accentText: 'text-fuchsia-300',
    borderClass: 'border-fuchsia-500/50',
    bgClass: 'bg-fuchsia-950/40',
    gradientBg: 'from-fuchsia-600/30 via-rose-600/25 to-purple-900/20',
    pillBg: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/30',
    glowColor: 'shadow-fuchsia-500/40',
    trophyIcon: 'Crown',
    description: 'Living legend of self-mastery and holistic life alignment.',
  },
};

// Level definitions with thresholds & titles
export const LEVEL_MILESTONES = [
  // Bronze Tier (Lv 1 - 4)
  { level: 1, tier: 'bronze', xp: 0, title: 'Bronze Novice' },
  { level: 2, tier: 'bronze', xp: 120, title: 'Bronze Striver' },
  { level: 3, tier: 'bronze', xp: 280, title: 'Bronze Apprentice' },
  { level: 4, tier: 'bronze', xp: 480, title: 'Bronze Practitioner' },

  // Silver Tier (Lv 5 - 9)
  { level: 5, tier: 'silver', xp: 720, title: 'Silver Achiever' },
  { level: 6, tier: 'silver', xp: 1020, title: 'Silver Pacesetter' },
  { level: 7, tier: 'silver', xp: 1380, title: 'Silver Strategist' },
  { level: 8, tier: 'silver', xp: 1800, title: 'Silver Specialist' },
  { level: 9, tier: 'silver', xp: 2280, title: 'Silver Elite' },

  // Gold Tier (Lv 10 - 14)
  { level: 10, tier: 'gold', xp: 2840, title: 'Gold Champion' },
  { level: 11, tier: 'gold', xp: 3480, title: 'Gold Virtuoso' },
  { level: 12, tier: 'gold', xp: 4200, title: 'Gold Vanguard' },
  { level: 13, tier: 'gold', xp: 5000, title: 'Gold Luminary' },
  { level: 14, tier: 'gold', xp: 5900, title: 'Gold Master' },

  // Platinum Tier (Lv 15 - 19)
  { level: 15, tier: 'platinum', xp: 6900, title: 'Platinum Sovereign' },
  { level: 16, tier: 'platinum', xp: 8020, title: 'Platinum Paragon' },
  { level: 17, tier: 'platinum', xp: 9260, title: 'Platinum Ascendant' },
  { level: 18, tier: 'platinum', xp: 10620, title: 'Platinum Apex' },
  { level: 19, tier: 'platinum', xp: 12100, title: 'Platinum Grandmaster' },

  // Diamond Tier (Lv 20 - 24)
  { level: 20, tier: 'diamond', xp: 13700, title: 'Diamond Overlord' },
  { level: 21, tier: 'diamond', xp: 15450, title: 'Diamond Transcendent' },
  { level: 22, tier: 'diamond', xp: 17350, title: 'Diamond Celestial' },
  { level: 23, tier: 'diamond', xp: 19400, title: 'Diamond Immortal' },
  { level: 24, tier: 'diamond', xp: 21600, title: 'Diamond Supreme' },

  // Mythic Tier (Lv 25)
  { level: 25, tier: 'mythic', xp: 24000, title: 'Mythic Sovereign' },
];

// Master list of Achievable Badges
export const BADGES_DEFINITION = [
  // ── Goal Achiever Badges ─────────────────────────────
  {
    id: 'goal_architect',
    title: 'Goal Architect',
    description: 'Create your first dedicated Goal Plan with actionable routines.',
    category: 'Goals',
    rarity: 'Common',
    xpReward: 100,
    icon: 'Target',
    color: 'emerald',
    evaluator: (habits, goals) => {
      const count = goals.length;
      return {
        unlocked: count >= 1,
        progress: Math.min(count, 1),
        maxProgress: 1,
        progressText: count >= 1 ? 'Completed' : '0/1 Goal created',
      };
    },
  },
  {
    id: 'goal_triad',
    title: 'Multi-Goal Strategist',
    description: 'Design and manage 3 or more active goal plans at the same time.',
    category: 'Goals',
    rarity: 'Rare',
    xpReward: 200,
    icon: 'Layers',
    color: 'indigo',
    evaluator: (habits, goals) => {
      const count = goals.length;
      return {
        unlocked: count >= 3,
        progress: Math.min(count, 3),
        maxProgress: 3,
        progressText: `${Math.min(count, 3)}/3 Goals planned`,
      };
    },
  },
  {
    id: 'goal_finisher',
    title: 'Goal Finisher',
    description: 'Mark at least one dedicated goal plan as completed or reach 100% adherence.',
    category: 'Goals',
    rarity: 'Epic',
    xpReward: 300,
    icon: 'CheckCircle2',
    color: 'emerald',
    evaluator: (habits, goals) => {
      const hasCompleted = goals.some((g) => {
        if (g.status === 'completed') return true;
        const total = (g.habits || []).length;
        if (total === 0) return false;
        const allDone = g.habits.every((h) => (h.completedDates || []).length >= (h.targetDays || 7));
        return allDone;
      });
      return {
        unlocked: hasCompleted,
        progress: hasCompleted ? 1 : 0,
        maxProgress: 1,
        progressText: hasCompleted ? 'Unlocked' : '0/1 Goal completed',
      };
    },
  },
  {
    id: 'diet_virtuoso',
    title: 'Nutrition Virtuoso',
    description: 'Create and check in on a Diet & Nutrition goal plan.',
    category: 'Goals',
    rarity: 'Common',
    xpReward: 120,
    icon: 'Scale',
    color: 'emerald',
    evaluator: (habits, goals) => {
      const dietGoal = goals.find((g) => g.category === 'Diet & Nutrition');
      let checkIns = 0;
      if (dietGoal) {
        (dietGoal.habits || []).forEach((h) => {
          checkIns += (h.completedDates || []).length;
        });
      }
      return {
        unlocked: checkIns >= 1,
        progress: Math.min(checkIns, 1),
        maxProgress: 1,
        progressText: checkIns >= 1 ? 'Unlocked' : 'Log 1 Diet check-in',
      };
    },
  },
  {
    id: 'fitness_iron_will',
    title: 'Iron Discipline',
    description: 'Log 5 or more total check-ins under a Fitness & Muscle plan.',
    category: 'Goals',
    rarity: 'Rare',
    xpReward: 180,
    icon: 'Flame',
    color: 'rose',
    evaluator: (habits, goals) => {
      const fitGoal = goals.find((g) => g.category === 'Fitness & Muscle');
      let checkIns = 0;
      if (fitGoal) {
        (fitGoal.habits || []).forEach((h) => {
          checkIns += (h.completedDates || []).length;
        });
      }
      return {
        unlocked: checkIns >= 5,
        progress: Math.min(checkIns, 5),
        maxProgress: 5,
        progressText: `${Math.min(checkIns, 5)}/5 Fitness check-ins`,
      };
    },
  },
  {
    id: 'scholar_focus',
    title: 'Scholar Mindset',
    description: 'Create and complete at least 3 sessions in a Learning & Study goal plan.',
    category: 'Goals',
    rarity: 'Rare',
    xpReward: 160,
    icon: 'Sparkles',
    color: 'purple',
    evaluator: (habits, goals) => {
      const studyGoal = goals.find((g) => g.category === 'Learning & Study');
      let checkIns = 0;
      if (studyGoal) {
        (studyGoal.habits || []).forEach((h) => {
          checkIns += (h.completedDates || []).length;
        });
      }
      return {
        unlocked: checkIns >= 3,
        progress: Math.min(checkIns, 3),
        maxProgress: 3,
        progressText: `${Math.min(checkIns, 3)}/3 Study check-ins`,
      };
    },
  },

  // ── Plan Following & Consistency Badges ──────────────
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first habit or goal sub-habit check-in.',
    category: 'Consistency',
    rarity: 'Common',
    xpReward: 80,
    icon: 'Award',
    color: 'indigo',
    evaluator: (habits, goals) => {
      let totalCompleted = 0;
      habits.forEach((h) => (totalCompleted += (h.completedDates || []).length));
      goals.forEach((g) =>
        (g.habits || []).forEach((sh) => (totalCompleted += (sh.completedDates || []).length))
      );
      return {
        unlocked: totalCompleted >= 1,
        progress: Math.min(totalCompleted, 1),
        maxProgress: 1,
        progressText: totalCompleted >= 1 ? 'Unlocked' : '0/1 Check-in',
      };
    },
  },
  {
    id: 'perfect_plan_day',
    title: 'Perfect Plan Day',
    description: 'Complete 100% of all goal plan sub-habits scheduled for today.',
    category: 'Consistency',
    rarity: 'Rare',
    xpReward: 200,
    icon: 'CheckCircle2',
    color: 'emerald',
    evaluator: (habits, goals, todayStr) => {
      let totalGoalHabits = 0;
      let completedToday = 0;
      goals.forEach((g) => {
        (g.habits || []).forEach((h) => {
          totalGoalHabits++;
          if (h.completedDates && h.completedDates.includes(todayStr)) {
            completedToday++;
          }
        });
      });
      const unlocked = totalGoalHabits > 0 && completedToday === totalGoalHabits;
      return {
        unlocked,
        progress: completedToday,
        maxProgress: Math.max(1, totalGoalHabits),
        progressText: `${completedToday}/${totalGoalHabits} Completed today`,
      };
    },
  },
  {
    id: 'streak_3_days',
    title: '3-Day Momentum',
    description: 'Build a consecutive 3-day completion streak on any habit.',
    category: 'Consistency',
    rarity: 'Common',
    xpReward: 120,
    icon: 'Flame',
    color: 'amber',
    evaluator: (habits) => {
      let maxStreak = 0;
      habits.forEach((h) => {
        maxStreak = Math.max(maxStreak, h.currentStreak || 0, h.longestStreak || 0);
      });
      return {
        unlocked: maxStreak >= 3,
        progress: Math.min(maxStreak, 3),
        maxProgress: 3,
        progressText: `${Math.min(maxStreak, 3)}/3 Day streak`,
      };
    },
  },
  {
    id: 'weekly_warrior',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day streak on any core habit or goal routine.',
    category: 'Consistency',
    rarity: 'Rare',
    xpReward: 250,
    icon: 'Award',
    color: 'indigo',
    evaluator: (habits) => {
      let maxStreak = 0;
      habits.forEach((h) => {
        maxStreak = Math.max(maxStreak, h.currentStreak || 0, h.longestStreak || 0);
      });
      return {
        unlocked: maxStreak >= 7,
        progress: Math.min(maxStreak, 7),
        maxProgress: 7,
        progressText: `${Math.min(maxStreak, 7)}/7 Day streak`,
      };
    },
  },
  {
    id: 'fortnight_master',
    title: 'Fortnight Champion',
    description: 'Achieve a 14-day streak, transforming routine into second nature.',
    category: 'Consistency',
    rarity: 'Epic',
    xpReward: 400,
    icon: 'Trophy',
    color: 'yellow',
    evaluator: (habits) => {
      let maxStreak = 0;
      habits.forEach((h) => {
        maxStreak = Math.max(maxStreak, h.currentStreak || 0, h.longestStreak || 0);
      });
      return {
        unlocked: maxStreak >= 14,
        progress: Math.min(maxStreak, 14),
        maxProgress: 14,
        progressText: `${Math.min(maxStreak, 14)}/14 Day streak`,
      };
    },
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Complete a total of 100 check-ins across all habits and plans.',
    category: 'Milestones',
    rarity: 'Legendary',
    xpReward: 500,
    icon: 'Crown',
    color: 'purple',
    evaluator: (habits, goals) => {
      let totalCompleted = 0;
      habits.forEach((h) => (totalCompleted += (h.completedDates || []).length));
      goals.forEach((g) =>
        (g.habits || []).forEach((sh) => (totalCompleted += (sh.completedDates || []).length))
      );
      return {
        unlocked: totalCompleted >= 100,
        progress: Math.min(totalCompleted, 100),
        maxProgress: 100,
        progressText: `${Math.min(totalCompleted, 100)}/100 Check-ins`,
      };
    },
  },

  // ── Wellness & Life Tracking Badges ───────────────────
  {
    id: 'hydration_champion',
    title: 'Hydration Hero',
    description: 'Drink 8 or more glasses of water in a single day.',
    category: 'Wellness',
    rarity: 'Common',
    xpReward: 100,
    icon: 'Droplets',
    color: 'cyan',
    evaluator: (habits, goals, todayStr, extra) => {
      const glasses = extra?.waterGlasses || 0;
      return {
        unlocked: glasses >= 8,
        progress: Math.min(glasses, 8),
        maxProgress: 8,
        progressText: `${Math.min(glasses, 8)}/8 Glasses`,
      };
    },
  },
  {
    id: 'active_walker',
    title: 'Active Strider',
    description: 'Log 5 or more walking breaks in a single day.',
    category: 'Wellness',
    rarity: 'Common',
    xpReward: 100,
    icon: 'Footprints',
    color: 'emerald',
    evaluator: (habits, goals, todayStr, extra) => {
      const walks = extra?.walkBreaks || 0;
      return {
        unlocked: walks >= 5,
        progress: Math.min(walks, 5),
        maxProgress: 5,
        progressText: `${Math.min(walks, 5)}/5 Walking breaks`,
      };
    },
  },
  {
    id: 'vault_guardian',
    title: 'Vault Sentinel',
    description: 'Unlock and secure your Private Vault with a personal PIN & photo.',
    category: 'Milestones',
    rarity: 'Rare',
    xpReward: 150,
    icon: 'Lock',
    color: 'amber',
    evaluator: (habits, goals, todayStr, extra) => {
      const hasVault = !!(extra?.user?.vaultPin || (extra?.user?.vaultPhotos && extra.user.vaultPhotos.length > 0));
      return {
        unlocked: hasVault,
        progress: hasVault ? 1 : 0,
        maxProgress: 1,
        progressText: hasVault ? 'Secured' : '0/1 Vault set',
      };
    },
  },
  {
    id: 'habit_polymath',
    title: 'Habit Polymath',
    description: 'Active habits covering at least 3 distinct categories.',
    category: 'Milestones',
    rarity: 'Rare',
    xpReward: 180,
    icon: 'Sparkles',
    color: 'indigo',
    evaluator: (habits) => {
      const uniqueCategories = new Set(habits.map((h) => h.category || 'Productivity'));
      return {
        unlocked: uniqueCategories.size >= 3,
        progress: Math.min(uniqueCategories.size, 3),
        maxProgress: 3,
        progressText: `${Math.min(uniqueCategories.size, 3)}/3 Categories`,
      };
    },
  },
];

/**
 * Calculates complete user gamification state:
 * XP, Tier (Bronze, Silver, Gold, Platinum, Diamond, Mythic),
 * Current Level (1 - 25+), Progress to next level, and Badges list.
 */
export function calculateUserGamification(habits = [], goals = [], todayStr = '', extra = {}) {
  let earnedXp = 0;

  // 1. Regular Habit Check-in XP (+10 per completed date)
  let totalHabitCheckIns = 0;
  let maxStreak = 0;
  habits.forEach((h) => {
    const count = (h.completedDates || []).length;
    totalHabitCheckIns += count;
    earnedXp += count * 10;

    const curStreak = h.currentStreak || 0;
    const longStreak = h.longestStreak || 0;
    maxStreak = Math.max(maxStreak, curStreak, longStreak);

    // Active streak bonus: +5 XP per day of active streak
    earnedXp += curStreak * 5;
  });

  // 2. Goal Plan Check-in XP (+20 per sub-habit check-in)
  let totalGoalCheckIns = 0;
  let completedGoalsCount = 0;
  goals.forEach((g) => {
    if (g.status === 'completed') {
      completedGoalsCount++;
      earnedXp += 300; // Big bonus for goal completion
    }
    (g.habits || []).forEach((sh) => {
      const c = (sh.completedDates || []).length;
      totalGoalCheckIns += c;
      earnedXp += c * 20;
    });
  });

  // 3. Evaluate Badges and Add Badge XP Rewards
  const evaluatedBadges = BADGES_DEFINITION.map((b) => {
    const res = b.evaluator(habits, goals, todayStr, extra);
    return {
      ...b,
      unlocked: res.unlocked,
      progress: res.progress,
      maxProgress: res.maxProgress,
      progressText: res.progressText,
    };
  });

  // Add XP from unlocked badges
  let unlockedCount = 0;
  evaluatedBadges.forEach((b) => {
    if (b.unlocked) {
      unlockedCount++;
      earnedXp += b.xpReward;
    }
  });

  // 4. Determine Current Level and Tier
  let currentLevelObj = LEVEL_MILESTONES[0];
  let nextLevelObj = LEVEL_MILESTONES[1];

  for (let i = LEVEL_MILESTONES.length - 1; i >= 0; i--) {
    if (earnedXp >= LEVEL_MILESTONES[i].xp) {
      currentLevelObj = LEVEL_MILESTONES[i];
      nextLevelObj = LEVEL_MILESTONES[i + 1] || null;
      break;
    }
  }

  const currentLevel = currentLevelObj.level;
  const currentTierKey = currentLevelObj.tier;
  const currentTier = TIERS[currentTierKey] || TIERS.bronze;

  // Calculate progress % within current level towards next level
  let xpForNextLevel = 0;
  let xpInCurrentLevel = 0;
  let progressPercent = 100;
  let xpRemaining = 0;

  if (nextLevelObj) {
    const levelBaseXp = currentLevelObj.xp;
    const levelTargetXp = nextLevelObj.xp;
    xpForNextLevel = levelTargetXp - levelBaseXp;
    xpInCurrentLevel = earnedXp - levelBaseXp;
    progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpForNextLevel) * 100)));
    xpRemaining = Math.max(0, levelTargetXp - earnedXp);
  } else {
    // Max level achieved
    xpForNextLevel = currentLevelObj.xp;
    xpInCurrentLevel = earnedXp;
    progressPercent = 100;
    xpRemaining = 0;
  }

  // Next tier preview
  let nextTier = null;
  const tierKeys = Object.keys(TIERS);
  const curTierIndex = tierKeys.indexOf(currentTierKey);
  if (curTierIndex < tierKeys.length - 1) {
    nextTier = TIERS[tierKeys[curTierIndex + 1]];
  }

  return {
    totalXp: earnedXp,
    currentLevel,
    levelTitle: currentLevelObj.title,
    currentTierKey,
    currentTier,
    nextLevel: nextLevelObj ? nextLevelObj.level : null,
    nextLevelTitle: nextLevelObj ? nextLevelObj.title : null,
    xpInCurrentLevel,
    xpForNextLevel,
    progressPercent,
    xpRemaining,
    nextTier,
    badges: evaluatedBadges,
    unlockedBadgesCount: unlockedCount,
    totalBadgesCount: evaluatedBadges.length,
    stats: {
      totalHabitCheckIns,
      totalGoalCheckIns,
      completedGoalsCount,
      maxStreak,
    },
  };
}
