// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [user, setUser] = useState({ name: 'User' });

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Navbar user={user} />
      <main style={{ padding: '2rem' }}>
        <TaskForm />
        <TaskList />
      </main>
    </motion.div>
  );
};

export default Dashboard;
