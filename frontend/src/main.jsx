import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import MentorDashboard from './pages/mentordash/MentorDashboard';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SelectRole from './pages/auth/SelectRole';
import VerifyOTP from './components/auth/VerifyOTP';
import ProtectedRoute from './components/ProtectedRoute'; 

import './index.css';
import ForgotPassword from './components/auth/ForgotPassword';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/select-role" element={<SelectRole />} />
        
        {/* Protected Routes */}
        <Route path="/userdashboard" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/mentordashboard" element={
          <ProtectedRoute requiredRole="mentor">
            <MentorDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admindashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);