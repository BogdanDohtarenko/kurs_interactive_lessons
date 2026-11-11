// frontend/src/utils/progress.js

const KEY = 'edu_progress_v1';

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const write = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const progress = {
  // Отметить урок как пройденный
  completeLesson(lessonId, courseId, lessonTitle = '') {
    const data = read();
    if (!data.lessons) data.lessons = {};
    data.lessons[lessonId] = {
      courseId,
      title: lessonTitle,
      completedAt: new Date().toISOString(),
    };
    write(data);
  },

  // Сохранить результат теста
  saveTestResult(lessonId, courseId, score, passed) {
    const data = read();
    if (!data.tests) data.tests = {};
    const prev = data.tests[lessonId];
    // Оставляем лучший результат
    if (!prev || score > prev.score) {
      data.tests[lessonId] = {
        courseId,
        score,
        passed,
        completedAt: new Date().toISOString(),
      };
    }
    write(data);
  },

  // Сохранить самооценку задания
  saveTaskScore(taskId, lessonId, courseId, score, maxScore) {
    const data = read();
    if (!data.tasks) data.tasks = {};
    const prev = data.tasks[taskId];
    if (!prev || score > prev.score) {
      data.tasks[taskId] = {
        lessonId,
        courseId,
        score,
        maxScore,
        completedAt: new Date().toISOString(),
      };
    }
    write(data);
  },

  getStats() {
    const data = read();
    const lessons = Object.values(data.lessons || {});
    const tests = Object.values(data.tests || {});
    const tasks = Object.values(data.tasks || {});

    const testsPassed = tests.filter((t) => t.passed).length;
    const avgTestScore = tests.length
      ? Math.round(tests.reduce((s, t) => s + t.score, 0) / tests.length)
      : 0;

    const avgTaskScore = tasks.length
      ? +(tasks.reduce((s, t) => s + t.score, 0) / tasks.length).toFixed(1)
      : 0;
    const avgTaskMax = tasks.length
      ? +(tasks.reduce((s, t) => s + t.maxScore, 0) / tasks.length).toFixed(1)
      : 0;

    // Уникальные курсы, в которых есть активность
    const courseIds = new Set([
      ...lessons.map((l) => l.courseId),
      ...tests.map((t) => t.courseId),
      ...tasks.map((t) => t.courseId),
    ].filter(Boolean));

    return {
      lessonsCount: lessons.length,
      testsCount: tests.length,
      testsPassed,
      avgTestScore,
      tasksCount: tasks.length,
      avgTaskScore,
      avgTaskMax,
      activeCourses: courseIds.size,
      raw: data,
    };
  },

  reset() {
    localStorage.removeItem(KEY);
  },
};