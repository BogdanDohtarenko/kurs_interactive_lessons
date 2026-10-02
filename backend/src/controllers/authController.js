const User = require('../models/User');
const { generateToken } = require('../services/jwtService');

// @desc    Регистрация нового пользователя
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Проверка, существует ли пользователь с таким email или username
    const userExists = await User.findOne({
      where: { email }, // В реальном проекте можно проверять и username через Sequelize.Op.or
    });

    if (userExists) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создание пользователя. Хеширование пароля произойдет автоматически благодаря хуку beforeCreate в модели
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'student', // По умолчанию роль student, если не передана
    });

    if (user) {
      const token = generateToken(user.id, user.role);
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Неверные данные пользователя' });
    }
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации', error: error.message });
  }
};

// @desc    Авторизация пользователя и получение токена
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя по email
    const user = await User.findOne({ where: { email } });

    // Проверка существования пользователя и совпадения пароля
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user.id, user.role);
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Неверный email или пароль' });
    }
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    res.status(500).json({ message: 'Ошибка сервера при авторизации', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};