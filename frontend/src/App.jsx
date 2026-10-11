import './index.css';
import {useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useParams, Link } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import AdminCoursePage from './pages/AdminCoursePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { coursesService, lessonsService, testsService, tasksService } from './services/api';
import { LessonPage } from './pages/LessonPage';
import LessonEditor from './pages/LessonEditor';

const Icons = {
  Book: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Play: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: () => <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  LogOut: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'teacher';
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <Icons.Book /> EduPlatform
            </Link>
            {canManage && (
            <Link
              to="/admin"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
              >
              Админ-панель
            </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">Привет, <b>{user?.username || user?.name}</b></span>
            <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
              <Icons.LogOut /> Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Layout = () => (
  <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
  </div>
);

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  return isAuthenticated ? <Layout /> : <Navigate to="/login" replace />;
};

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center">
        <h2 className="mt-2 text-3xl font-extrabold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Вход в систему" subtitle="Добро пожаловать обратно">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50">
          {loading ? 'Вход...' : 'Войти'}
        </button>
        <p className="text-center text-sm text-gray-600">
          Нет аккаунта? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Зарегистрироваться</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Создать аккаунт" subtitle="Присоединяйтесь к платформе">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Имя пользователя</label>
            <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50">
          {loading ? 'Создание...' : 'Зарегистрироваться'}
        </button>
        <p className="text-center text-sm text-gray-600">
          Уже есть аккаунт? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Войти</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

const DashboardPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesService.getAll()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">Загрузка курсов...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Доступные курсы</h1>
        <p className="text-gray-600 mt-1">Выберите курс, чтобы начать обучение</p>
      </div>
      
      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Пока нет доступных курсов.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link key={course.id} to={`/course/${course.id}`} className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-indigo-200 hover:-translate-y-1">
              <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white leading-tight">{course.title}</h3>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm line-clamp-2">{course.description || 'Описание отсутствует'}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                  Перейти к курсу <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      coursesService.getById(id).catch(() => ({ title: 'Неизвестный курс', description: '' })),
      lessonsService.getByCourseId(id).catch(() => [])
    ])
    .then(([courseData, lessonsData]) => {
      setCourse(courseData);
      setLessons(lessonsData);
    })
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-10">Загрузка программы...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 inline-block">← Назад к курсам</Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{course?.title}</h1>
        <p className="text-gray-600 text-lg">{course?.description}</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Программа курса</h2>
      <div className="space-y-3">
        {lessons.length === 0 ? (
          <p className="text-gray-500 py-4">В этом курсе пока нет уроков.</p>
        ) : (
          lessons.sort((a, b) => a.order - b.order).map((lesson, idx) => (
            <Link key={lesson.id} to={`/lesson/${lesson.id}`} className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold mr-4 group-hover:bg-indigo-100 transition-colors">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{lesson.title}</h3>
              </div>
              <div className="text-gray-400 group-hover:text-indigo-500">
                <Icons.Play />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const TestViewer = ({ lessonId }) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    testsService.getByLessonId(lessonId)
      .then(setTest)
      .catch(() => setTest(null))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const submitTest = () => {
    let correct = 0;
    test.questions.forEach((q, i) => { if (selectedAnswers[i] === q.correctAnswer) correct++; });
    const score = Math.round((correct / test.questions.length) * 100);
    setResult({ score, passed: score >= test.passingScore, correctCount: correct, total: test.questions.length });
  };

  if (loading) return <div className="py-8 text-center text-gray-500">Загрузка теста...</div>;
  if (!test) return <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 mt-6">Для этого урока нет тестов.</div>;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-xl font-bold text-gray-900">{test.title}</h3>
        <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100">
          Проходной балл: {test.passingScore}%
        </span>
      </div>

      {result ? (
        <div className={`p-6 rounded-xl text-center ${result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-white shadow-sm">
            {result.passed ? <span className="text-2xl">🎉</span> : <span className="text-2xl">👀</span>}
          </div>
          <h4 className={`text-xl font-bold mb-2 ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
            {result.passed ? 'Отличная работа! Тест пройден.' : 'Тест не пройден. Попробуйте еще раз.'}
          </h4>
          <p className={`mb-6 ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
            Вы набрали {result.score}% ({result.correctCount} из {result.total} правильных)
          </p>
          <button onClick={() => { setResult(null); setSelectedAnswers({}); }}
            className={`px-6 py-2.5 rounded-lg font-medium text-white transition-colors shadow-sm
            ${result.passed ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
            Пройти заново
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {test.questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <p className="font-semibold text-gray-900 mb-4">{qIndex + 1}. {q.question}</p>
              <div className="space-y-3">
                {q.options.map((option, oIndex) => {
                  const isSelected = selectedAnswers[qIndex] === oIndex;
                  return (
                    <label key={oIndex} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}>
                      <input type="radio" name={`question-${qIndex}`} checked={isSelected} onChange={() => setSelectedAnswers(p => ({...p, [qIndex]: oIndex}))}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                      <span className={`text-sm ${isSelected ? 'font-medium text-indigo-900' : 'text-gray-700'}`}>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          <button onClick={submitTest} disabled={Object.keys(selectedAnswers).length < test.questions.length}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm">
            Завершить тестирование
          </button>
        </div>
      )}
    </div>
  );
};

const TaskViewer = ({ lessonId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tasksService.getByLessonId(lessonId)
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) return <div className="py-8 text-center text-gray-500">Загрузка заданий...</div>;
  if (!tasks.length) return <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 mt-6">Для этого урока нет практических заданий.</div>;

  return (
    <div className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {tasks.map((task, idx) => (
        <div key={task.id || idx} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-indigo-600 bg-indigo-50 w-8 h-8 rounded-lg flex items-center justify-center text-sm">{idx + 1}</span>
              Практическое задание
            </h3>
            <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
              Макс. балл: {task.maxScore}
            </span>
          </div>
          <div className="prose prose-indigo text-gray-700 max-w-none mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100 whitespace-pre-wrap">
            {task.description}
          </div>
          <div className="mt-6 border-t border-gray-100 pt-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Ваше решение:</label>
            <textarea rows="6" placeholder="Напишите или вставьте свой код/текст сюда..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm shadow-sm transition-shadow"></textarea>
            <div className="mt-4 flex justify-end">
              <button className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                Отправить на проверку
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Публичные роуты */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Защищенные роуты */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/course/:id" element={<CoursePage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/course/:id" element={<AdminCoursePage />} />
            <Route path="/admin/lesson/:id" element={<LessonEditor />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}