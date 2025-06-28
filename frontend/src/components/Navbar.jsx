// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './styles/Navbar.css';
import { motion } from 'framer-motion';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "session_token=; Max-Age=0";
    navigate('/');
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="navbar-left">
        <h2>📝 TaskManager</h2>
      </div>
      <div className="navbar-right">
        <span>{user?.name}</span>
        <ThemeToggle />
        <button onClick={handleLogout}>Logout</button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
