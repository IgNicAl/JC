import axios from 'axios';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.data || error.message);
    if (error.response?.status === 401) {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
};

export const userService = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  updateUser: (id, user) => api.put(`/api/users/${id}`, user),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  getPublicProfile: (username) => api.get(`/api/users/perfil/${username}`),
  followUser: (userId) => api.post(`/api/users/${userId}/follow`),
};

export const newsService = {
  getAll: () => api.get('/api/noticias'),
  getBySlug: (slug) => api.get(`/api/noticias/slug/${slug}`),
  getAllForManagement: () => api.get('/api/noticias/manage'),
  getById: (id) => api.get(`/api/noticias/${id}`),
  create: (newsData) => api.post('/api/noticias', newsData),
  update: (id, newsData) => api.put(`/api/noticias/${id}`, newsData),
  delete: (id) => api.delete(`/api/noticias/${id}`),
};

export const engagementService = {
  trackView: (newsId) => api.post(`/api/news/${newsId}/view`),
  getComments: (newsId) => api.get(`/api/news/${newsId}/comments`),
  addComment: (newsId, content) => api.post(`/api/news/${newsId}/comments`, { content }),
  deleteComment: (newsId, commentId) => api.delete(`/api/news/${newsId}/comments/${commentId}`),
  toggleLike: (newsId) => api.post(`/api/news/${newsId}/like`),
  getEngagementStats: (newsId) => api.get(`/api/news/${newsId}/engagement-stats`),
};

export const dashboardService = {
  getAdminStats: () => api.get('/api/dashboard/admin-stats'),
  getNewsDashboard: (newsId) => api.get(`/api/dashboard/news/${newsId}`),
};

export default api;
