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
            <div className="task-card-header">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => toggleStatus(task)}
                  className="rounded-checkbox"
                />
              </label>

              <div className="task-title">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>

              <button onClick={() => deleteTask(task._id)} className="delete-btn">
                🗑️
              </button>
            </div>

            <div className="task-details">
              <span className="priority-icon">
                {task.priority === 'high'
                  ? '🔥 High'
                  : task.priority === 'normal'
                  ? '⚠️ Normal'
                  : '💤 Low'}
              </span>
              {task.date && <span>📅 {task.date}</span>}
              {task.time && <span>⏰ {task.time}</span>}
              <span>{task.status === 'done' ? '✅ Done' : '⏳ In Progress'}</span>
              {task.sharedWith?.length > 0 && <span>📤 Shared</span>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
