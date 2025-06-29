// src/components/TaskList.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/TaskList.css';

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  const toggleStatus = async (task) => {
    const updatedStatus = task.status === 'done' ? 'in-progress' : 'done';

    await fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: updatedStatus }),
    });

    onTaskUpdated({ ...task, status: updatedStatus });
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    onTaskDeleted(id);
  };

  return (
    <div className="task-list">
      <h2>Your Tasks</h2>
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            className={`task-card ${task.status === 'done' ? 'completed' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            layout
          >
            <div className="task-top">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => toggleStatus(task)}
                />
                <span className="checkmark" />
              </label>
              <div className="task-texts">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
              <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                🗑️
              </button>
            </div>
            <span className={`priority ${task.priority}`}>{task.priority}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
