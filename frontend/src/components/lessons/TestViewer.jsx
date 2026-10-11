export const TestViewer = ({ lessonId }) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await testsService.getByLessonId(lessonId);
        setTest(data);
      } catch (err) {
        console.error('Тест не найден или ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [lessonId]);

  const handleSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const submitTest = () => {
    let correctCount = 0;
    test.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / test.questions.length) * 100);
    setResult({
      score,
      passed: score >= test.passingScore,
      correctCount,
      total: test.questions.length
    });
  };

  if (loading) return <div className="p-4 text-gray-500">Загрузка теста...</div>;
  if (!test) return <div className="p-4 text-gray-500">Для этого урока нет тестов.</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">{test.title}</h3>
      <p className="text-sm text-gray-500 mb-6">Проходной балл: {test.passingScore}%</p>

      {result ? (
        <div className={`p-4 rounded-lg mb-4 ${result.passed ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <h4 className="font-bold text-lg mb-2">
            {result.passed ? '🎉 Тест пройден!' : 'Ой, тест не пройден.'}
          </h4>
          <p>Ваш результат: {result.score}% ({result.correctCount} из {result.total} правильных)</p>
          <button 
            onClick={() => { setResult(null); setSelectedAnswers({}); }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Пройти заново
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {test.questions.map((q, qIndex) => (
            <div key={qIndex} className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-3">{qIndex + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => (
                  <label key={oIndex} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded transition">
                    <input 
                      type="radio" 
                      name={`question-${qIndex}`}
                      checked={selectedAnswers[qIndex] === oIndex}
                      onChange={() => handleSelect(qIndex, oIndex)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          <button 
            onClick={submitTest}
            disabled={Object.keys(selectedAnswers).length < test.questions.length}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Завершить тест
          </button>
        </div>
      )}
    </div>
  );
};

