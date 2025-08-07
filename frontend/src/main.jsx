import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import MentorDashboard from './pages/mentor/MentorDashboard';
import UserDashboard from './pages/user/UserDashboard';
import UserSettings from './pages/user/UserSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import SelectRole from './pages/auth/SelectRole';
import VerifyOTP from './components/auth/VerifyOTP';
import ProtectedRoute from './components/ProtectedRoute'; 
import ForgotPassword from './components/auth/ForgotPassword';
import ProjectForm from './components/user/ProjectForm';
import AchievementsPage from './pages/user/AchievementsPage';

import './index.css';
import ProjectsIndex from './pages/user/ProjectsIndex';
import DetailedProjectView from './pages/user/DetailedProjectView';
import ShowMentorDetails from './pages/user/ShowMentorDetails';
import MilestonePage from './pages/user/MilestonePage';
import MentorSetting from './pages/mentor/MentorSetting';
import MentorProjectPage from './pages/mentor/MentorProjectPage';


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
        
        {/* Protected User Routes */}
        <Route path="/userdashboard" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/milestone-page" element={
          <ProtectedRoute requiredRole="user">
            <MilestonePage/>
          </ProtectedRoute>
        } />
        
        <Route path="/user/settings" element={
          <ProtectedRoute requiredRole="user">
            <UserSettings />
          </ProtectedRoute>
        } />

        {/* ✅ Projects Routes */}
        <Route path="/user/projects" element={
          <ProtectedRoute requiredRole="user">
            <ProjectsIndex />
          </ProtectedRoute>
        } />

        <Route path="/user/projects/create" element={
          <ProtectedRoute requiredRole="user">
            <ProjectForm />
          </ProtectedRoute>
        } />

        {/* ✅ Add other user routes as you build them */}
        <Route path="/user/sessions" element={
          <ProtectedRoute requiredRole="user">
            <div>Sessions Page - Coming Soon</div>
          </ProtectedRoute>
        } />

        <Route path="/user/messages" element={
          <ProtectedRoute requiredRole="user">
            <div>Messages Page - Coming Soon</div>
          </ProtectedRoute>
        } />

        {/* ✅ NEW: Achievements Page Route */}
        <Route path="/user/achievements" element={
          <ProtectedRoute requiredRole="user">
            <AchievementsPage />
          </ProtectedRoute>
        } />

        <Route path="/user/analytics" element={
          <ProtectedRoute requiredRole="user">
            <div>Analytics Page - Coming Soon</div>
          </ProtectedRoute>
        } />
        

        {/* <Route path="/mentordashboard" element={<MentorDashboard />} /> */}
        
        {/* Admin Routes */}
        <Route path="/admindashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/projects/edit/:id" element={
          <ProtectedRoute requiredRole="user">
            <ProjectForm mode="edit" />
          </ProtectedRoute>
        } />

        <Route path="/projects/:id" element={
          <ProtectedRoute requiredRole="user">
            <DetailedProjectView />
          </ProtectedRoute>
        } />

        <Route path="/user/mentors/:mentorId/ai-reason" element={
          <ProtectedRoute requiredRole="user">
            <ShowMentorDetails />
          </ProtectedRoute>
        } />
        
        {/* Mentor Routes */}
        <Route path="/mentordashboard" element={
          <ProtectedRoute requiredRole="mentor">
            <MentorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/mentor/settings" element={
          <ProtectedRoute requiredRole="mentor">
            <MentorSetting />
          </ProtectedRoute>
        } />


        <Route path="/mentor/projects" element={
          <ProtectedRoute requiredRole="mentor">
            <MentorProjectPage />
          </ProtectedRoute>
        } />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);