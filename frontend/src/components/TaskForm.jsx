// src/components/TaskForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/TaskForm.css';

const TaskForm = ({ onTaskCreated }) => {
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState({
  title: '',
  description: '',
  priority: 'normal',
  time: '',
  date: '',
  status: 'in-progress',
  sharedWith: '',
});

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(task),
    });

    const data = await res.json();

    if (res.ok && data._id) {
      const newTask = {
        ...data, // use returned data from backend
      };

      setTask({ title: '', description: '', priority: 'normal' });
      setShowForm(false);
      onTaskCreated && onTaskCreated(newTask);
    } else {
      console.error('❌ Failed to create task:', data.error || data);
    }
  } catch (err) {
    console.error('❌ Error creating task:', err.message);
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
            <input
              type="date"
              value={task.date}
              onChange={(e) => setTask({ ...task, date: e.target.value })}
              required
            />

            <input
              type="time"
              value={task.time}
              onChange={(e) => setTask({ ...task, time: e.target.value })}
              className="time-input"
            />
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
