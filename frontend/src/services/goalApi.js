import apiClient from './habitApi';

const GOALS_STORAGE_KEY = 'habit_tracker_goals';

const DEFAULT_DEMO_GOALS = [
  {
    _id: 'goal_diet_sample',
    id: 'goal_diet_sample',
    title: 'Strict Clean Diet & Fat Loss Plan',
    description: 'Eliminate ultra-processed sugars, prioritize whole foods, and maintain a high-protein deficit.',
    category: 'Diet & Nutrition',
    color: 'emerald',
    targetDate: '2026-11-30',
    targetMetric: 'Target: 72 kg & 14% Body Fat',
    status: 'active',
    habits: [
      {
        id: 'gh_1',
        title: 'Drink 3.5 Liters of Water',
        frequency: 'daily',
        targetDays: 7,
        completedDates: [new Date().toISOString().split('T')[0]],
      },
      {
        id: 'gh_2',
        title: 'Zero Sugar & No Soda Drinks',
        frequency: 'daily',
        targetDays: 7,
        completedDates: [new Date().toISOString().split('T')[0]],
      },
      {
        id: 'gh_3',
        title: 'Eat 140g+ Protein (Whole Foods)',
        frequency: 'daily',
        targetDays: 7,
        completedDates: [],
      },
      {
        id: 'gh_4',
        title: 'Calorie Deficit Under 2,100 kcal',
        frequency: 'daily',
        targetDays: 7,
        completedDates: [],
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

const getStoredLocalGoals = () => {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_GOALS));
      return DEFAULT_DEMO_GOALS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEMO_GOALS;
  }
};

const saveLocalGoals = (goals) => {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (e) {
    console.error('Error saving local goals:', e);
  }
};

export const goalApi = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/goals');
      return response.data;
    } catch {
      // Fallback for demo mode or offline server
      return getStoredLocalGoals();
    }
  },

  create: async (goalData) => {
    try {
      const response = await apiClient.post('/goals', goalData);
      return response.data;
    } catch {
      // Fallback
      const current = getStoredLocalGoals();
      const newGoal = {
        ...goalData,
        _id: 'goal_' + Date.now(),
        id: 'goal_' + Date.now(),
        habits: (goalData.habits || []).map((h, i) => ({
          ...h,
          id: h.id || `gh_${Date.now()}_${i}`,
          completedDates: h.completedDates || [],
        })),
        createdAt: new Date().toISOString(),
      };
      const updated = [newGoal, ...current];
      saveLocalGoals(updated);
      return newGoal;
    }
  },

  update: async (id, goalData) => {
    try {
      const response = await apiClient.put(`/goals/${id}`, goalData);
      return response.data;
    } catch {
      const current = getStoredLocalGoals();
      const updated = current.map((g) => ((g._id === id || g.id === id) ? { ...g, ...goalData } : g));
      saveLocalGoals(updated);
      return updated.find((g) => g._id === id || g.id === id);
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/goals/${id}`);
      return response.data;
    } catch {
      const current = getStoredLocalGoals();
      const updated = current.filter((g) => g._id !== id && g.id !== id);
      saveLocalGoals(updated);
      return { id };
    }
  },

  toggleHabitDate: async (goalId, habitId, date) => {
    try {
      const response = await apiClient.post(`/goals/${goalId}/habits/${habitId}/toggle`, { date });
      return response.data;
    } catch {
      const current = getStoredLocalGoals();
      const goal = current.find((g) => g._id === goalId || g.id === goalId);
      if (goal) {
        const habit = goal.habits?.find((h) => h.id === habitId || h._id === habitId);
        if (habit) {
          if (!habit.completedDates) habit.completedDates = [];
          if (habit.completedDates.includes(date)) {
            habit.completedDates = habit.completedDates.filter((d) => d !== date);
          } else {
            habit.completedDates.push(date);
          }
        }
        saveLocalGoals(current);
        return goal;
      }
      return null;
    }
  },
};

export default goalApi;
