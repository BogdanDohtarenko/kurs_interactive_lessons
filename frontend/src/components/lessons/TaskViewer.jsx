import { useState, useEffect } from 'react';
import { tasksService } from '../../services/api';
import { progress } from '../../utils/progress';

export const TaskViewer = ({ lessonId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});        // { [taskId]: 'текст' }
  const [submitted, setSubmitted] = useState({});    // { [taskId]: true }
  const [selfScore, setSelfScore] = useState({});    // { [taskId]: 8 }

  useEffect(() => {
    tasksService
      .getByLessonId(lessonId)
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Загрузка заданий...</div>;
  }

  if (!tasks.length) {
    return (
      <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 mt-6">
        Для этого урока нет практических заданий.
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {tasks.map((task, idx) => {
        const isSubmitted = submitted[task.id];

        return (
          <div
            key={task.id || idx}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200"
          >
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Задание #{idx + 1}
              </h3>
              <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
                Макс. балл: {task.maxScore}
              </span>
            </div>

            {/* Описание задания */}
            <div className="prose prose-indigo text-gray-700 max-w-none mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100 whitespace-pre-wrap">
              {task.description}
            </div>

            {/* Поле ввода решения */}
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Ваше решение:
            </label>
            <textarea
              rows="5"
              value={answers[task.id] || ''}
              onChange={(e) =>
                setAnswers({ ...answers, [task.id]: e.target.value })
              }
              disabled={isSubmitted}
              placeholder="Напишите решение или вставьте ссылку на результат..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />

            {/* Кнопка «Проверить себя» / блок результата */}
            {!isSubmitted ? (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() =>
                    setSubmitted({ ...submitted, [task.id]: true })
                  }
                  disabled={!answers[task.id]?.trim()}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  🔍 Проверить себя
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Эталонный результат */}
                {task.expectedResultUrl && (
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm font-semibold text-amber-900 mb-2">
                      🎯 Эталонный результат:
                    </p>
                    <img
                      src={task.expectedResultUrl}
                      alt="Эталон"
                      className="rounded-lg border border-gray-200 max-h-80 mb-2 bg-white"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <a
                      href={task.expectedResultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 underline"
                    >
                      Открыть в новой вкладке
                    </a>
                  </div>
                )}

                {/* Блок самооценки */}
                <div className="p-5 bg-green-50 border border-green-200 rounded-xl space-y-3">
                  <p className="text-sm text-green-900 font-medium">
                    ✅ Сравните своё решение с эталоном выше.
                  </p>

                  {task.allowSelfCheck && (
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="text-sm font-medium text-gray-800">
                        Оцените себя:
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={task.maxScore}
                        value={selfScore[task.id] ?? ''}
                        onChange={(e) => {
  const score = Number(e.target.value);
  setSelfScore({ ...selfScore, [task.id]: score });

  if (!isNaN(score)) {
    progress.saveTaskScore(task.id, task.lessonId, task.courseId, score, task.maxScore);
  }
}}
                        className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <span className="text-sm text-gray-500">
                        из {task.maxScore} баллов
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      setSubmitted({ ...submitted, [task.id]: false })
                    }
                    className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                  >
                    ✎ Изменить решение
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};