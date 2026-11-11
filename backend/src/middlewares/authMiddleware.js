const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Не авторизован, токен отсутствует' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Ошибка верификации токена:', error.message);
    return res.status(401).json({ message: 'Не авторизован, неверный или истекший токен' });
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