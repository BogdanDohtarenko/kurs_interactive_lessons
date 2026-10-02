require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, sequelize } = require('./src/config/db.js');

// Importing models to initialize associations
require('./src/models/User.js');
require('./src/models/Course.js');
require('./src/models/Lesson.js');
require('./src/models/Test.js');      
require('./src/models/Task.js');     
require('./src/models/Progress.js');

// Importing routes
const authRoutes = require('./src/routes/authRoutes'); 
const courseRoutes = require('./src/routes/courseRoutes');
const lessonRoutes = require('./src/routes/lessonRoutes');
const testRoutes = require('./src/routes/testRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const progressRoutes = require('./src/routes/progressRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Mounting routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API работает стабильно' });
});

app.use((req, res, next) => {
  const error = new Error(`Маршрут не найден - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    await sequelize.sync({ alter: true });
    console.log('Модели синхронизированы с базой данных.');

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Не удалось запустить сервер:', error);
  }
};

startServer();