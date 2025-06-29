// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
// import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        credentials: 'include',
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Invalid task format:', data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  // Fetch tasks initially
  useEffect(() => {
    fetchTasks();
  }, []);

  // Called after new task is added from TaskForm
  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]); // ⬅️ append to UI immediately
  };

  return (
    <>
      <Navbar user={{ name: 'User' }} />
      <main style={{ padding: '2rem' }}>
        <TaskForm onTaskCreated={handleTaskCreated} />
        <TaskList tasks={tasks} />
      </main>
    </>
  );
};

export default Dashboard;
