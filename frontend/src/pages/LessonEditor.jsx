import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonsService, testsService, tasksService } from '../services/api';

export default function LessonEditor() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('test');

  useEffect(() => {
    lessonsService.getById(id).then(setLesson).catch(() => setLesson(null));
  }, [id]);

  if (!lesson) return <div className="p-10 text-center">Загрузка урока...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin" className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        ← Назад в админ-панель
      </Link>

      <h1 className="text-2xl font-bold mb-1">{lesson.title}</h1>
      <p className="text-sm text-gray-500 mb-6">Урок #{lesson.order}</p>

      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'test', label: 'Тест' },
          { id: 'task', label: 'Практика' },
          { id: 'content', label: 'Материал' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`py-3 px-5 font-medium text-sm border-b-2 transition-colors ${
              activeTab === t.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'test' && <TestEditor lessonId={lesson.id} />}
      {activeTab === 'task' && <TaskEditor lessonId={lesson.id} />}
      {activeTab === 'content' && <ContentEditor lesson={lesson} onSaved={setLesson} />}
    </div>
  );
}

/* ============== РЕДАКТОР ТЕСТА ============== */
function TestEditor({ lessonId }) {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    testsService
      .getByLessonId(lessonId)
      .then((data) => setTest(data))
      .catch(() => setTest(null))
      .finally(() => setLoading(false));
  };

  useEffect(load, [lessonId]);

  const handleCreate = async () => {
    setSaving(true);
    setError('');
    try {
      await testsService.create({
        lessonId,
        title: 'Новый тест',
        passingScore: 60,
        questions: [
          { question: 'Пример вопроса', options: ['Вариант 1', 'Вариант 2'], correctAnswer: 0 },
        ],
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания теста');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    setSaving(true);
    setError('');
    try {
      await testsService.update(test.id, payload);
      setTest({ ...test, ...payload });
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Удалить тест?')) return;
    await testsService.remove(test.id);
    setTest(null);
  };

  if (loading) return <div className="py-8 text-center text-gray-500">Загрузка...</div>;

  if (!test) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500 mb-4">У этого урока пока нет теста.</p>
        <button
          onClick={handleCreate}
          disabled={saving}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Создание...' : '+ Создать тест'}
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Название теста</label>
          <input
            type="text"
            value={test.title}
            onChange={(e) => setTest({ ...test, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">Проходной %</label>
          <input
            type="number" min="0" max="100"
            value={test.passingScore}
            onChange={(e) => setTest({ ...test, passingScore: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Вопросы</label>
          <button
            onClick={() =>
              setTest({
                ...test,
                questions: [...(test.questions || []), { question: '', options: ['', ''], correctAnswer: 0 }],
              })
            }
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Добавить вопрос
          </button>
        </div>

        <div className="space-y-3">
          {(test.questions || []).map((q, qi) => (
            <div key={qi} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 font-medium">Вопрос {qi + 1}</span>
                <button
                  onClick={() => {
                    const next = test.questions.filter((_, i) => i !== qi);
                    setTest({ ...test, questions: next });
                  }}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Удалить
                </button>
              </div>
              <input
                type="text"
                placeholder="Текст вопроса"
                value={q.question}
                onChange={(e) => {
                  const next = [...test.questions];
                  next[qi] = { ...q, question: e.target.value };
                  setTest({ ...test, questions: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm"
              />
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correctAnswer === oi}
                      onChange={() => {
                        const next = [...test.questions];
                        next[qi] = { ...q, correctAnswer: oi };
                        setTest({ ...test, questions: next });
                      }}
                    />
                    <input
                      type="text"
                      placeholder={`Вариант ${oi + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const next = [...test.questions];
                        const opts = [...q.options];
                        opts[oi] = e.target.value;
                        next[qi] = { ...q, options: opts };
                        setTest({ ...test, questions: next });
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-2 border-t border-gray-100">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          Удалить тест
        </button>
        <button
          onClick={() => handleUpdate({ title: test.title, passingScore: test.passingScore, questions: test.questions })}
          disabled={saving}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}

/* ============== РЕДАКТОР ПРАКТИКИ ============== */
function TaskEditor({ lessonId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({ description: '', maxScore: 10 });

  const load = () => {
    setLoading(true);
    tasksService
      .getByLessonId(lessonId)
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [lessonId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!draft.description.trim()) return;
    setSaving(true);
    setError('');
    try {
      await tasksService.create({ ...draft, lessonId });
      setDraft({ description: '', maxScore: 10 });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (task, patch) => {
    try {
      await tasksService.update(task.id, { ...task, ...patch });
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, ...patch } : t)));
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Удалить задание?')) return;
    await tasksService.remove(taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  if (loading) return <div className="py-8 text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <h3 className="font-semibold text-gray-900">Новое задание</h3>
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        <textarea
          rows="3"
          placeholder="Описание задания..."
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Макс. балл:</label>
          <input
            type="number" min="1"
            value={draft.maxScore}
            onChange={(e) => setDraft({ ...draft, maxScore: Number(e.target.value) })}
            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="ml-auto px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
          >
            {saving ? 'Создание...' : '+ Добавить задание'}
          </button>
        </div>
      </form>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Заданий пока нет.</p>
      ) : (
        tasks.map((task, idx) => (
          <div key={task.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-gray-400">Задание #{idx + 1}</span>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Удалить
              </button>
            </div>
            <textarea
              rows="3"
              value={task.description}
              onChange={(e) => handleUpdate(task, { description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
            />
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Макс. балл:</label>
              <input
                type="number" min="1"
                value={task.maxScore}
                onChange={(e) => handleUpdate(task, { maxScore: Number(e.target.value) })}
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ============== РЕДАКТОР КОНТЕНТА ============== */
function ContentEditor({ lesson, onSaved }) {
  const [form, setForm] = useState({
    title: lesson.title,
    content: lesson.content || '',
    videoUrl: lesson.videoUrl || '',
    order: lesson.order,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await lessonsService.update(lesson.id, form);
      onSaved(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube embed URL</label>
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
          rows="8"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}