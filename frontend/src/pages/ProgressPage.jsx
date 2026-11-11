import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesService } from '../services/api';
import { progress } from '../utils/progress';

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setStats(progress.getStats());
    coursesService.getAll().then(setCourses).catch(() => setCourses([]));
  }, []);

  if (!stats) return <div className="text-center py-10 text-gray-500">Загрузка...</div>;

  const resetProgress = () => {
    if (!confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) return;
    progress.reset();
    setStats(progress.getStats());
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Мой прогресс</h1>
        <p className="text-gray-600 mt-1">
          Привет, <b>{user?.username}</b>! Вот что ты уже успел сделать.
        </p>
      </div>

      {/* Карточки-показатели */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon="📖"
          label="Уроков пройдено"
          value={stats.lessonsCount}
          accent="from-indigo-500 to-indigo-600"
        />
        <StatCard
          icon="✅"
          label="Тестов пройдено"
          value={`${stats.testsPassed} / ${stats.testsCount}`}
          accent="from-emerald-500 to-emerald-600"
          hint={stats.testsCount ? `Средний балл: ${stats.avgTestScore}%` : 'Пока нет тестов'}
        />
        <StatCard
          icon="💻"
          label="Заданий сдано"
          value={stats.tasksCount}
          accent="from-amber-500 to-orange-500"
          hint={
            stats.tasksCount
              ? `Средняя самооценка: ${stats.avgTaskScore} / ${stats.avgTaskMax}`
              : 'Пока нет заданий'
          }
        />
        <StatCard
          icon="📚"
          label="Курсов в работе"
          value={stats.activeCourses}
          accent="from-purple-500 to-fuchsia-600"
        />
      </div>

      {/* Прогресс по курсам */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Прогресс по курсам</h2>

      {courses.length === 0 ? (
        <p className="text-gray-500">Курсов пока нет.</p>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => {
            const lessonsDone = Object.values(stats.raw.lessons || {}).filter(
              (l) => l.courseId === course.id
            ).length;
            // Можно добавить: сколько всего уроков в курсе — если API позволяет
            // Пока покажем просто количество пройденных
            return (
              <div
                key={course.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {lessonsDone > 0
                        ? `Пройдено уроков: ${lessonsDone}`
                        : 'Прогресса пока нет'}
                    </p>
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
                  >
                    Продолжить →
                  </Link>
                </div>

                {/* Прогресс-бар (упрощённый) */}
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{
                      width: lessonsDone > 0 ? `${Math.min(lessonsDone * 20, 100)}%` : '0%',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Сброс */}
      <div className="mt-10 text-center">
        <button
          onClick={resetProgress}
          className="text-xs text-red-500 hover:text-red-700 underline"
        >
          Сбросить прогресс
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, hint, accent }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-2xl mb-3 shadow-sm`}
      >
        {icon}
      </div>
      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}