const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setError('Ошибка при регистрации');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
      <h2>Регистрация</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label>Имя:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
      </div>
      
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
      </div>
      
      <div>
        <label>Пароль:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
      </div>
      
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};