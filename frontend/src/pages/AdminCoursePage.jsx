import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesService, lessonsService } from '../services/api';

export default function AdminCoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', order: 1, videoUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
  try {
    const [c, l] = await Promise.all([
      coursesService.getById(id).catch((err) => {
        console.error('Ошибка загрузки курса:', err);
        return null;
      }),
      lessonsService.getByCourseId(id).catch((err) => {
        console.error('Ошибка загрузки уроков:', err);
        return [];
      }),
    ]);
    setCourse(c);
    setLessons(Array.isArray(l) ? l.sort((a, b) => a.order - b.order) : []);
        }  catch (err) {
            console.error('loadData error:', err);
        }
    };

  useEffect(() => { loadData(); }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await lessonsService.create({ ...form, courseId: id, order: Number(form.order) });
      setForm({ title: '', content: '', order: lessons.length + 2, videoUrl: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания урока');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Удалить урок?')) return;
    try {
      await lessonsService.remove(lessonId);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin" className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        ← Назад в админ-панель
      </Link>

      <h1 className="text-2xl font-bold mb-2">{course?.title || 'Курс'}</h1>
      <p className="text-gray-500 mb-6">{course?.description}</p>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4">Добавить урок</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Название урока</label>
              <input
                type="text" required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
              <input
                type="number" min="1"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на видео (embed)</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/embed/..."
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Содержание</label>
            <textarea
              rows="5"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Добавить урок'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold mb-4">Уроки курса ({lessons.length})</h2>
      <div className="space-y-3">
        {lessons.length === 0 ? (
          <p className="text-gray-500">Уроков пока нет.</p>
        ) : (
          lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
              <div>
                <span className="text-xs text-gray-400 mr-2">#{lesson.order}</span>
                <span className="font-semibold text-gray-900">{lesson.title}</span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/lesson/${lesson.id}`}
                  className="px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Просмотр
                </Link>
                <Link
                to={`/admin/lesson/${lesson.id}`}
                className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                >
                Редактировать
                </Link>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}