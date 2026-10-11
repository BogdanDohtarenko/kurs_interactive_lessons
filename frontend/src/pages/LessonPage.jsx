import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonsService } from '../services/api';

export const LessonPage = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    lessonsService.getById(id)
      .then(setLesson)
      .catch(() => setLesson(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center text-xl">Загрузка урока...</div>;
  if (!lesson) return <div className="p-10 text-center text-red-500">Урок не найден</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <nav className="mb-6 text-sm text-gray-500 flex items-center space-x-2">
        <Link to="/dashboard" className="hover:text-blue-600 transition">Курсы</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{lesson.title}</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{lesson.title}</h1>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('content')}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'content' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Материал урока
        </button>
        <button
          onClick={() => setActiveTab('task')}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'task' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Практика
        </button>
        <button
          onClick={() => setActiveTab('test')}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'test' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Тест
        </button>
      </div>

      <div>
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fade-in">
            {lesson.videoUrl && (
              <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg">
                <iframe
                src={lesson.videoUrl}
                title="Lesson Video"
                className="w-full h-full"
                allowFullScreen
                />
            </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 prose max-w-none">
              {(lesson.content || '').split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'test' && (
          <div className="animate-fade-in">
            <TestViewer lessonId={lesson.id} />
          </div>
        )}

        {activeTab === 'task' && (
          <div className="animate-fade-in">
            <TaskViewer lessonId={lesson.id} />
          </div>
        )}
      </div>
    </div>
  );
};