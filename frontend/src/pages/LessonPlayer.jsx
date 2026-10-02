import { useEffect, useState } from 'react';
import { useParams } from 'react';
import { testsApi, tasksApi } from '../services/api';
import Spinner from '../components/common/Spinner';

const LessonPlayer = () => {
  const { id: lessonId } = useParams();
  const [tests, setTests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, tasksRes] = await Promise.all([
          testsApi.getByLesson(lessonId),
          tasksApi.getByLesson(lessonId)
        ]);
        setTests(testsRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error('Ошибка загрузки компонентов урока', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId]);

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Материалы урока</h2>

      {/* Тесты */}
      {tests.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          {tests.map((test) => (
            <div key={test.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
              <h3>{test.title}</h3>
              <p>Проходной балл: {test.passingScore}%</p>
              {test.questions?.map((q, qIndex) => (
                <div key={qIndex} style={{ margin: '12px 0' }}>
                  <p><strong>{q.question}</strong></p>
                  {q.options.map((opt, optIndex) => (
                    <label key={optIndex} style={{ display: 'block', margin: '4px 0' }}>
                      <input 
                        type="radio" 
                        name={`q_${qIndex}`} 
                        onChange={() => setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex })}
                      />
                      {' '}{opt}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>
      )}

      {/* Задания */}
      {tasks.length > 0 && (
        <section>
          <h3>Практическое задание</h3>
          {tasks.map((task) => (
            <div key={task.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
              <p>{task.description}</p>
              <p style={{ color: '#666', fontSize: '14px' }}>Максимальный балл: {task.maxScore}</p>
              <textarea 
                placeholder="Вставьте ваше решение здесь..." 
                style={{ width: '100%', height: '100px', marginTop: '8px', padding: '8px' }}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default LessonPlayer;