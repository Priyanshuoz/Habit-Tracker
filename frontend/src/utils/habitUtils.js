// Helper for local date string in YYYY-MM-DD format
export const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Returns metadata for the past N days (including today)
export const getPastNDays = (count = 7) => {
  const days = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const isToday = i === 0;
    days.push({ dateStr, dayName, dayNumber, isToday });
  }
  return days;
};

// Check if a habit was completed on a specific date string
export const isDateCompleted = (habit, dateStr) => {
  if (!habit || !habit.completedDates) return false;
  return habit.completedDates.some((d) => {
    const str = typeof d === 'string' ? d.split('T')[0] : d?.date?.split('T')[0];
    return str === dateStr;
  });
};

// Check if a habit was skipped (rest day) on a specific date string
export const isDateSkipped = (habit, dateStr) => {
  if (!habit || !habit.skippedDates) return false;
  return habit.skippedDates.some((d) => {
    const str = typeof d === 'string' ? d.split('T')[0] : d?.date?.split('T')[0];
    return str === dateStr;
  });
};

// Check if a date is before the habit's creation date
export const isDateBeforeCreation = (habit, dateStr) => {
  if (!habit || !habit.createdAt) return false;
  const createdDate = new Date(habit.createdAt);
  const createdStr = getLocalDateString(createdDate);
  return dateStr < createdStr;
};

// Check if a workout date was missed (after creation, in the past, not completed or skipped)
export const isDateMissed = (habit, dateStr, todayStr) => {
  if (!habit) return false;
  if (dateStr >= todayStr) return false;
  if (isDateBeforeCreation(habit, dateStr)) return false;
  if (isDateCompleted(habit, dateStr)) return false;
  if (isDateSkipped(habit, dateStr)) return false;
  return true;
};

// Calculate current streak and all-time longest streak with skipped dates protection
export const calculateStreak = (completedDates = [], skippedDates = []) => {
  if (
    (!completedDates || completedDates.length === 0) &&
    (!skippedDates || skippedDates.length === 0)
  ) {
    return { current: 0, longest: 0 };
  }

  const compDates = new Set(
    (completedDates || []).map((d) =>
      typeof d === 'string' ? d.split('T')[0] : d?.date?.split('T')[0] || ''
    )
  );

  const skipDates = new Set(
    (skippedDates || []).map((d) =>
      typeof d === 'string' ? d.split('T')[0] : d?.date?.split('T')[0] || ''
    )
  );

  let current = 0;
  const cursor = new Date();
  const todayStr = getLocalDateString(cursor);

  // If today is neither completed nor skipped, start checking from yesterday
  if (!compDates.has(todayStr) && !skipDates.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  // Step backward: completed increments streak, skipped bridges over without breaking
  while (true) {
    const dStr = getLocalDateString(cursor);
    if (compDates.has(dStr)) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (skipDates.has(dStr)) {
      // Skipped day: bridges streak intact without breaking
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Longest streak calculation across historical data
  const allDates = Array.from(
    new Set([...Array.from(compDates), ...Array.from(skipDates)])
  )
    .filter(Boolean)
    .sort();

  let longest = 0;
  let streakCounter = 0;
  let previousDate = null;

  for (const dateStr of allDates) {
    if (!previousDate) {
      streakCounter = compDates.has(dateStr) ? 1 : 0;
    } else {
      const p = new Date(previousDate);
      const c = new Date(dateStr);
      const diffDays = Math.round((c - p) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        if (compDates.has(dateStr)) streakCounter += 1;
      } else {
        streakCounter = compDates.has(dateStr) ? 1 : 0;
      }
    }
    previousDate = dateStr;
    if (streakCounter > longest) {
      longest = streakCounter;
    }
  }

  return { current, longest: Math.max(longest, current) };
};

// Category tokens and visual mappings
export const CATEGORIES = [
  'All',
  'Fitness',
  'Productivity',
  'Mindfulness',
  'Health',
  'Learning',
];

export const CATEGORY_COLORS = {
  Fitness: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  Productivity: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    dot: 'bg-indigo-400',
  },
  Mindfulness: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
  },
  Health: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
  },
  Learning: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
};

export const DEFAULT_CATEGORY_COLOR = {
  bg: 'bg-slate-700/20',
  text: 'text-slate-300',
  border: 'border-slate-700/40',
  dot: 'bg-slate-400',
};
