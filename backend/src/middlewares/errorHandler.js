// Если у вас подключен Sentry, его можно импортировать здесь
// const Sentry = require('@sentry/node');

const errorHandler = (err, req, res, next) => {
  // Логирование ошибки в консоль (или отправка в Sentry)
  console.error('Error:', err.message);
  
  // Sentry.captureException(err); // <-- раскомментируйте, если Sentry инициализирован

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Обработка специфичных ошибок Sequelize (база данных)
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(item => item.message).join(', ');
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Запись с такими данными уже существует';
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Скрываем stack trace на проде
  });
};

module.exports = errorHandler;