const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Проверяем, есть ли заголовок Authorization и начинается ли он с 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Извлекаем токен (формат "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Верифицируем токен с помощью нашего секретного ключа
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Добавляем расшифрованные данные (id и role) в объект запроса
      req.user = decoded;

      // Передаем управление следующему обработчику (контроллеру)
      next();
    } catch (error) {
      console.error('Ошибка верификации токена:', error.message);
      return res.status(401).json({ message: 'Не авторизован, неверный или истекший токен' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Не авторизован, токен отсутствует' });
  }
};

// Middleware для проверки ролей (например, только для админов или учителей)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Доступ запрещен для роли: ${req.user ? req.user.role : 'Неизвестно'}` });
    }
    next();
  };
};

module.exports = { protect, authorize };