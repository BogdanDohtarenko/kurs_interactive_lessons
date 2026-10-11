const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await lessonsService.getAll();
        setLessons(data);
      } catch (err) {
        console.error('Ошибка загрузки уроков');
      }
    };
    fetchLessons();
  }, []);

  
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Привет, {user?.name || 'Пользователь'}!</h1>
        <button onClick={logout}>Выйти</button>
      </header>
      
      <main>
        <h2>Доступные уроки</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {lessons.length === 0 ? (
            <p>Уроков пока нет.</p>
          ) : (
            lessons.map((lesson, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>{lesson.title || 'Урок без названия'}</h3>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
