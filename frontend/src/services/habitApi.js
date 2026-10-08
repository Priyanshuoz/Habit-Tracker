import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create configured axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Attach Authorization header from localStorage on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Habit API service endpoints
export const habitApi = {
  // Get all habits for current user
  getAll: async () => {
    const response = await apiClient.get('/habits');
    return response.data;
  },

  // Create a new habit
  create: async (habitData) => {
    const response = await apiClient.post('/habits', habitData);
    return response.data;
  },

  // Update existing habit
  update: async (id, habitData) => {
    const response = await apiClient.put(`/habits/${id}`, habitData);
    return response.data;
  },

  // Delete habit
  delete: async (id) => {
    const response = await apiClient.delete(`/habits/${id}`);
    return response.data;
  },

  // Toggle completion or skip for a specific date (format: YYYY-MM-DD, status: 'completed' | 'skipped' | 'none')
  toggleDate: async (id, date, status) => {
    const response = await apiClient.post(`/habits/${id}/toggle`, { date, status });
    return response.data;
  },

  // Get habits summary/stats if backend has dedicated stats endpoint
  getStats: async () => {
    const response = await apiClient.get('/habits/stats');
    return response.data;
  },
};

export default apiClient;
