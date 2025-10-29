import axios from "axios";

// Simple token storage helpers
const TOKEN_KEY = "auth_token";
export const authToken = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to requests and handle 401s globally
api.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      authToken.remove();
      // Optional: redirect if running in browser context
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (payload: { name: string; email: string; password: string }) =>
    api.post("/api/auth/register", payload),
  login: (payload: { email: string; password: string }) =>
    api.post("/api/auth/login", payload),
  me: () => api.get("/api/auth/me"),
  logout: () => api.post("/api/auth/logout"),
};

// Expense API calls
export const expenseAPI = {
  // Get all expenses
  getAll: () => api.get("/api/expenses"),

  // Add new expense
  add: (expense: {
    title: string;
    amount: number;
    category: string;
    date: string;
  }) => api.post("/api/expenses", expense),

  // Delete expense
  delete: (id: string) => api.delete(`/api/expenses/${id}`),

  // Update expense (bonus)
  update: (
    id: string,
    expense: {
      title?: string;
      amount?: number;
      category?: string;
      date?: string;
    }
  ) => api.put(`/api/expenses/${id}`, expense),
};
