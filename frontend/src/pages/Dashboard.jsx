import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { coursesApi } from '../services/api';
import Spinner from '../components/common/Spinner';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  const fetchCourses = async () => {
    try {
      const { data } = await coursesApi.getAll();
      setCourses(data);
    } catch (err) {
      console.error('Ошибка загрузки курсов', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await coursesApi.create(newCourse);
      setShowModal(false);
      setNewCourse({ title: '', description: '' });
      fetchCourses();
    } catch (err) {
      alert('Ошибка при создании курса');
    }
  };

  return (