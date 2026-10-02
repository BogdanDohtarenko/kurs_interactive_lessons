import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API Эндпоинты
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const coursesApi = {
  getAll: () => api.get('/courses'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
};

export const lessonsApi = {
  getByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
  create: (data) => api.post('/lessons', data),
};

export const testsApi = {
  getByLesson: (lessonId) => api.get(`/tests/lesson/${lessonId}`),
  create: (data) => api.post('/tests', data),
};

export const tasksApi = {
  getByLesson: (lessonId) => api.get(`/tasks/lesson/${lessonId}`),
  create: (data) => api.post('/tasks', data),
};