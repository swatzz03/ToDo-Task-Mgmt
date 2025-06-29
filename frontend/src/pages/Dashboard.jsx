import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    const res = await fetch('https://todo-task-mgmt.onrender.com/tasks', {
      credentials: 'include',
    });
    const data = await res.json();
    if (Array.isArray(data)) setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleTaskUpdated = (updated) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
  };

  const handleTaskDeleted = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    const now = new Date();
    const taskTime = task.time
      ? new Date(`${task.createdAt.split('T')[0]}T${task.time}`)
      : null;

    switch (filter) {
      case 'today':
        return (
          task.date &&
          new Date(task.date).toDateString() === now.toDateString()
        );
      case 'overdue':
        return (
          task.status !== 'done' &&
          taskTime &&
          taskTime < now
        );
      case 'priority-high':
        return task.priority === 'high';
      case 'done':
        return task.status === 'done';
      case 'in-progress':
        return task.status === 'in-progress';
      default:
        return true;
    }
  });

  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <TaskForm onTaskCreated={handleTaskCreated} />
        
        <div style={{ margin: '1rem 0' }}>
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="today">Due Today</option>
            <option value="overdue">Overdue</option>
            <option value="priority-high">High Priority</option>
            <option value="done">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>

        <TaskList
          tasks={filteredTasks}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      </main>
    </>
  );
};

export default Dashboard;
