import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCourses = () => {
    coursesService.getAll().then(setCourses).catch(console.error);
  };

  useEffect(() => { loadCourses(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await coursesService.create(form);
      setForm({ title: '', description: '' });
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания курса');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить курс? Все уроки и тесты тоже удалятся.')) return;
    try {
      await coursesService.remove(id);
      loadCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Админ-панель</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4">Создать новый курс</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              type="text" required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать курс'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold mb-4">Существующие курсы</h2>
      <div className="space-y-3">
        {courses.length === 0 ? (
          <p className="text-gray-500">Курсов пока нет.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Автор: {course.author?.username || '—'} | Опубликован: {course.isPublished ? 'да' : 'нет'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/admin/course/${course.id}`}
                  className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                >
                  Уроки
                </Link>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}