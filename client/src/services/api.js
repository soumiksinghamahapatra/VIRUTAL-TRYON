import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized, except on login/register endpoints
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Wardrobe Services
export const wardrobeAPI = {
  getItems: (params) => api.get('/wardrobe', { params }),
  getItemById: (id) => api.get(`/wardrobe/${id}`),
  addItem: (formData) =>
    api.post('/wardrobe', formData, {
      headers: {
        'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    }),
  updateItem: (id, data) => api.put(`/wardrobe/${id}`, data),
  deleteItem: (id) => api.delete(`/wardrobe/${id}`),
  autoCategorize: () => api.post('/wardrobe/categorize'),
};

// Color Analysis Services
export const colorAPI = {
  getAnalysis: () => api.get('/color-analysis'),
  runAnalysis: (formData) =>
    api.post('/color-analysis', formData, {
      headers: {
        'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    }),
  getAllPalettes: () => api.get('/color-analysis/palettes'),
  getWardrobeMatch: () => api.get('/color-analysis/match-wardrobe'),
};

// Style Consultation Services
export const consultationAPI = {
  getConsultation: () => api.get('/consultation'),
  sendMessage: (message) => api.post('/consultation/message', { message }),
  resetSession: () => api.post('/consultation/reset'),
};

// Outfit Services
export const outfitAPI = {
  getOutfits: () => api.get('/outfits'),
  createOutfit: (data) => api.post('/outfits', data),
  deleteOutfit: (id) => api.delete(`/outfits/${id}`),
  analyzeInspo: (formData) =>
    api.post('/outfits/analyze-inspo', formData, {
      headers: {
        'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    }),
};

// Subscription Services
export const subscriptionAPI = {
  getPlans: () => api.get('/subscription/plans'),
  upgradePlan: (plan) => api.post('/subscription/upgrade', { plan }),
};

export default api;
