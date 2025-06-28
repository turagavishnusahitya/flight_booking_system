import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Flights API
export const flightsAPI = {
  getFlights: async (params: any = {}) => {
    const response = await api.get('/flights', { params });
    return response.data;
  },

  getFlight: async (id: string) => {
    const response = await api.get(`/flights/${id}`);
    return response.data;
  },

  createFlight: async (flightData: any) => {
    const response = await api.post('/flights', flightData);
    return response.data;
  },

  updateFlight: async (id: string, flightData: any) => {
    const response = await api.put(`/flights/${id}`, flightData);
    return response.data;
  },

  deleteFlight: async (id: string) => {
    const response = await api.delete(`/flights/${id}`);
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getBooking: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;