// src/components/TaskList.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        credentials: 'include', // Send session cookie
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Unauthorized');
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setTasks(data);
      setError('');
    } catch (err) {
      console.error('❌ Failed to fetch tasks:', err.message);
      setError(err.message || 'Failed to fetch tasks');
      setTasks([]); // Prevent crashing on .map
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-list">
      <h2>Your Tasks</h2>

      {error && (
        <div className="task-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            className="task-card"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
          >
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <span className={`priority ${task.priority}`}>{task.priority}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
