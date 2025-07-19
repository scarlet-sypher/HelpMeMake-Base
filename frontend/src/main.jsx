import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Login from './pages/auth/Login';     
import Signup from './pages/auth/Signup';   
import MentorDashboard from './pages/mentor/MentorDashboard';
import UserDashboard from './pages/user/UserDashboard';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/mentordashboard" element={<MentorDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
