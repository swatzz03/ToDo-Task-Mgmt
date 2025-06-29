// src/pages/Login.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const session = document.cookie.includes('session_token');
    if (session) navigate('/dashboard');
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1>Welcome to Task Manager</h1>
      <motion.button
        onClick={handleLogin}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Sign in with Google
      </motion.button>
    </motion.div>
  );
};

export default Login;
