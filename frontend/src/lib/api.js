import axios from 'axios';

// NOTE: A URL base foi removida para permitir que o proxy do Vite funcione corretamente.
// As chamadas agora devem usar caminhos relativos (ex: '/api/auth/login').
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de requisições do Axios.
 * @description Adiciona o token JWT (se disponível no localStorage) ao cabeçalho
 * de autorização de todas as requisições.
 */
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

/**
 * Interceptor de respostas do Axios.
 * @description Trata erros globais da API. Se o erro for 401 (Não Autorizado),
 * o usuário é removido do localStorage e um evento 'unauthorized' é disparado
 * para que a UI possa reagir e redirecionar o usuário para o login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.data || error.message);
    if (error.response?.status === 401) {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('unauthorized')); // Dispara evento global
    }
    return Promise.reject(error);
  }
);

/**
 * @description Serviço para encapsular as chamadas de API relacionadas à autenticação.
 */
export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
};

/**
 * @description Serviço para encapsular as chamadas de API relacionadas à gestão de usuários.
 * Destinado a administradores.
 */
export const userService = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  updateUser: (id, user) => api.put(`/api/users/${id}`, user),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
};

/**
 * @description Serviço para encapsular as chamadas de API relacionadas à gestão de notícias.
 */
export const newsService = {
  getAll: () => api.get('/api/noticias'),
  getById: (id) => api.get(`/api/noticias/${id}`),
  create: (newsData) => api.post('/api/noticias', newsData),
  update: (id, newsData) => api.put(`/api/noticias/${id}`, newsData),
  delete: (id) => api.delete(`/api/noticias/${id}`),
};

export default api;
