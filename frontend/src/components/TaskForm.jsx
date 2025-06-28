// src/components/TaskForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/TaskForm.css';

const TaskForm = ({ onTaskCreated }) => {
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState({ title: '', description: '', priority: 'normal' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      setTask({ title: '', description: '', priority: 'normal' });
      setShowForm(false);
      onTaskCreated && onTaskCreated();
    }
  };

  return (
    <div className="task-form-wrapper">
      <button className="open-form" onClick={() => setShowForm(true)}>
        ➕ Add Task
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.form
            className="task-form"
            onSubmit={handleSubmit}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
          >
            <input
              type="text"
              placeholder="Title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
            />
            <select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <div className="form-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskForm;
