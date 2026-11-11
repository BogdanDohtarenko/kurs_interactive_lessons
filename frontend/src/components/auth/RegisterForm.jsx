import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  /* ───────────── Валидация ───────────── */
  const validate = (data) => {
    const errs = {};

    if (!data.username.trim()) {
      errs.username = 'Введите имя пользователя';
    } else if (data.username.trim().length < 3) {
      errs.username = 'Имя должно быть минимум 3 символа';
    }

    if (!data.email.trim()) {
      errs.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Некорректный email';
    }

    if (!data.password) {
      errs.password = 'Введите пароль';
    } else if (data.password.length < 6) {
      errs.password = 'Пароль минимум 6 символов';   // ← то, что нужно
    }

    return errs;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Сбрасываем ошибку поля при вводе
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // 🔍 Клиентская валидация
    const errs = validate(formData);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;                    // ⛔ не отправляем запрос
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      // Серверная валидация (если что-то не так на бэке)
      const message = err.response?.data?.message || 'Ошибка регистрации';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {serverError}
        </div>
      )}

      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Имя пользователя
          </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={handleChange('username')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
              errors.username ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={handleChange('email')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
              errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Пароль</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={handleChange('password')}
            className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${
              errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">Минимум 6 символов</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Создание...' : 'Зарегистрироваться'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Войти
        </Link>
      </p>
    </form>
  );
}