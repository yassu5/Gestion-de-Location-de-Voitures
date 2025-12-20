import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentification
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  getAllUtilisateurs: () => api.get('/auth/utilisateurs'),
  createUtilisateur: (data) => api.post('/auth/utilisateurs', data),
  deleteUtilisateur: (id) => api.delete(`/auth/utilisateurs/${id}`),
};

// Véhicules
export const vehiculeAPI = {
  getAll: () => api.get('/vehicules'),
  getById: (id) => api.get(`/vehicules/${id}`),
  create: (data) => api.post('/vehicules', data),
  update: (id, data) => api.put(`/vehicules/${id}`, data),
  delete: (id) => api.delete(`/vehicules/${id}`),
};

// Clients
export const clientAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  getHistorique: (id) => api.get(`/clients/${id}/historique`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Locations
export const locationAPI = {
  getAll: () => api.get('/locations'),
  getById: (id) => api.get(`/locations/${id}`),
  getDashboardStats: () => api.get('/locations/stats/dashboard'),
  create: (data) => api.post('/locations', data),
  terminer: (id, data) => api.put(`/locations/${id}/terminer`, data),
  annuler: (id) => api.put(`/locations/${id}/annuler`),
};

export default api;
