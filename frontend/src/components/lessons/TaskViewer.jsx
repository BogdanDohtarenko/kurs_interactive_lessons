export const TaskViewer = ({ lessonId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksService.getByLessonId(lessonId);
        setTasks(data);
      } catch (err) {
        console.error('Задания не найдены');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [lessonId]);

  if (loading) return <div className="p-4 text-gray-500">Загрузка заданий...</div>;
  if (!tasks || tasks.length === 0) return <div className="p-4 text-gray-500">Для этого урока нет практических заданий.</div>;

  return (
    <div className="space-y-6 mt-6">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">Практическое задание</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Макс. балл: {task.maxScore}
            </span>
          </div>
          <p className="text-gray-700 mb-6 whitespace-pre-wrap">{task.description}</p>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ваше решение (код или текст):</label>
            <textarea 
              rows="6" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Напишите свое решение здесь..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            ></textarea>
            <button className="mt-3 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition">
              Отправить на проверку
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};