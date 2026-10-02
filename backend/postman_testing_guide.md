# Postman Testing Guide for Interactive Lessons API

Follow these steps in order to test the full backend flow. You will need to copy IDs generated in previous steps to use in the following ones.

## 1. Register a User
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/auth/register`
*   **Body (raw JSON):**
    ```json
    {
        "username": "BogdanTheCreator",
        "email": "bogdan@example.com",
        "password": "securepassword123",
        "role": "teacher"
    }
    ```
*   **Action:** Send the request. Copy the `token` from the response!

## 2. Setting Up Authorization in Postman
To avoid pasting your token manually into every request:
1. Go to your Postman Collection or a specific request.
2. Go to the **Authorization** tab.
3. Select Type: **Bearer Token**.
4. Paste the `token` you copied from Step 1 into the Token field. *(Use this for all `POST`, `PUT`, `DELETE` requests below).*

## 3. Create a Course
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/courses`
*   **Authorization:** Bearer Token required.
*   **Body (raw JSON):**
    ```json
    {
        "title": "React.js для начинающих",
        "description": "Изучаем основы React: компоненты, хуки, стейт-менеджмент."
    }
    ```
*   **Action:** Send. Copy the `id` of the course from the response. This is your `courseId`.

## 4. Create a Lesson
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/lessons`
*   **Authorization:** Bearer Token required.
*   **Body (raw JSON):** *(Replace `courseId` with the ID from Step 3)*
    ```json
    {
        "title": "Введение в JSX",
        "content": "JSX - это синтаксический сахар для React.createElement...",
        "videoUrl": "https://youtube.com/watch?v=example",
        "order": 1,
        "courseId": "PASTE_YOUR_COURSE_ID_HERE"
    }
    ```
*   **Action:** Send. Copy the `id` of the lesson from the response. This is your `lessonId`.

## 5. Create a Test for the Lesson
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/tests`
*   **Authorization:** Bearer Token required.
*   **Body (raw JSON):** *(Replace `lessonId` with the ID from Step 4)*
    ```json
    {
        "title": "Тест по JSX",
        "passingScore": 80,
        "lessonId": "PASTE_YOUR_LESSON_ID_HERE",
        "questions": [
            {
                "question": "Что такое JSX?",
                "options": ["Язык программирования", "Расширение синтаксиса JavaScript", "База данных"],
                "correctAnswer": 1
            }
        ]
    }
    ```

## 6. Create a Task for the Lesson
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/tasks`
*   **Authorization:** Bearer Token required.
*   **Body (raw JSON):** *(Replace `lessonId` with the ID from Step 4)*
    ```json
    {
        "description": "Напишите свой первый компонент App, который выводит 'Hello World' в теге h1.",
        "maxScore": 10,
        "lessonId": "PASTE_YOUR_LESSON_ID_HERE"
    }
    ```

## 7. Test Public GET Routes (No token needed)
*   `GET http://localhost:5000/api/courses` (You will need to update the course `isPublished` field to `true` via a PUT request to see it here).
*   `GET http://localhost:5000/api/lessons/course/YOUR_COURSE_ID`
*   `GET http://localhost:5000/api/tests/lesson/YOUR_LESSON_ID`
*   `GET http://localhost:5000/api/tasks/lesson/YOUR_LESSON_ID`