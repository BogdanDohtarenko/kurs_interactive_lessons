import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; 

// Создаем изолированный экземпляр Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: подставляем токен авторизации в каждый запрос
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

// Response Interceptor: обрабатываем глобальные ошибки (например, 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // При необходимости можно сделать редирект или выбросить событие
    }
    return Promise.reject(error);
  }
);

// Эндпоинты авторизации и работы с пользователем
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const testsService = {
  getByLessonId: async (lessonId) => (await api.get(`/tests/lesson/${lessonId}`)).data,
  create: async (data) => (await api.post('/tests', data)).data,
  update: async (id, data) => (await api.put(`/tests/${id}`, data)).data,
  remove: async (id) => (await api.delete(`/tests/${id}`)).data,
};

export const tasksService = {
  getByLessonId: async (lessonId) => (await api.get(`/tasks/lesson/${lessonId}`)).data,
  create: async (data) => (await api.post('/tasks', data)).data,
  update: async (id, data) => (await api.put(`/tasks/${id}`, data)).data,
  remove: async (id) => (await api.delete(`/tasks/${id}`)).data,
};

export const coursesService = {
  getAll: async () => (await api.get('/courses')).data,
  getById: async (id) => (await api.get(`/courses/${id}`)).data,
  create: async (data) => (await api.post('/courses', data)).data,
  update: async (id, data) => (await api.put(`/courses/${id}`, data)).data,
  remove: async (id) => (await api.delete(`/courses/${id}`)).data,
};

export const lessonsService = {
  getByCourseId: async (courseId) => (await api.get(`/lessons/course/${courseId}`)).data,
  getById: async (id) => (await api.get(`/lessons/${id}`)).data,
  create: async (data) => (await api.post('/lessons', data)).data,
  update: async (id, data) => (await api.put(`/lessons/${id}`, data)).data,
  remove: async (id) => (await api.delete(`/lessons/${id}`)).data,
};

export default api;