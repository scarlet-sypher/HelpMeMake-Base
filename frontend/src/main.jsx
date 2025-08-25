import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import App from "./App";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import UserSettings from "./pages/user/UserSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SelectRole from "./pages/auth/SelectRole";
import VerifyOTP from "./components/auth/VerifyOTP";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./components/auth/ForgotPassword";
import ProjectForm from "./components/user/ProjectForm";
import AchievementsPage from "./pages/user/AchievementsPage";

import "./index.css";
import ProjectsIndex from "./pages/user/ProjectsIndex";
import DetailedProjectView from "./pages/user/DetailedProjectView";
import ShowMentorDetails from "./pages/user/ShowMentorDetails";
import MilestonePage from "./pages/user/MilestonePage";
import MentorSetting from "./pages/mentor/MentorSetting";
import MentorProjectPage from "./pages/mentor/MentorProjectPage";
import MentorDetailedProjectView from "./pages/mentor/MentorDetailedProjectView";
import UserProfileView from "./components/mentor/mentorProject/UserProfileView";
import MyMentor from "./pages/user/MyMentor";
import MyApprentice from "./pages/mentor/MyApprentice";
import MentorMilestonePage from "./pages/mentor/MentorMilestonePage";
import MentorSessions from "./pages/mentor/MentorSessions";
import UserSessions from "./pages/user/UserSessions";
import MentorAnalysis from "./pages/mentor/MentorAnalysis";
import UserAnalysis from "./pages/user/UserAnalysis";
import GoalSetter from "./pages/mentor/GoalSetter";
import MentorDetailsPageView from "./pages/user/MentorDetailsPageView";
import MentorMessages from "./pages/mentor/MentorMessages";
import LearnerMessagesPage from "./pages/user/LearnerMessagesPage";
import AdminUserDashboard from "./pages/admin/AdminUserDashboard";
import AdminLearnerDashboard from "./pages/admin/AdminLearnerDashboard";
import LearnerForm from "./components/admin/learner/LearnerForm";
import AdminMentorDashboard from "./pages/admin/AdminMentorDashboard";
import MentorForm from "./components/admin/mentor/MentorForm";
import AdminRoomDashboard from "./pages/admin/AdminRoomDashboard";
import RoomView from "./components/admin/room/RoomView";

ReactDOM.createRoot(document.getElementById("root")).render(
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
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/milestone-page"
          element={
            <ProtectedRoute requiredRole="user">
              <MilestonePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/settings"
          element={
            <ProtectedRoute requiredRole="user">
              <UserSettings />
            </ProtectedRoute>
          }
        />
        {/* ✅ Projects Routes */}
        <Route
          path="/user/projects"
          element={
            <ProtectedRoute requiredRole="user">
              <ProjectsIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/projects/create"
          element={
            <ProtectedRoute requiredRole="user">
              <ProjectForm />
            </ProtectedRoute>
          }
        />
        {/* ✅ Add other user routes as you build them */}
        <Route
          path="/user/sessions"
          element={
            <ProtectedRoute requiredRole="user">
              <UserSessions />
            </ProtectedRoute>
          }
        />
        {/* ✅ NEW: Achievements Page Route */}
        <Route
          path="/user/achievements"
          element={
            <ProtectedRoute requiredRole="user">
              <AchievementsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/analytics"
          element={
            <ProtectedRoute requiredRole="user">
              <UserAnalysis />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/mentordashboard" element={<MentorDashboard />} /> */}
        {/* Admin Routes */}
        <Route
          path="/admindashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUserDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/learners"
          element={
            <AdminProtectedRoute>
              <AdminLearnerDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/learners/edit/:learnerId"
          element={
            <AdminProtectedRoute>
              <LearnerForm />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/mentors"
          element={
            <AdminProtectedRoute>
              <AdminMentorDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/mentors/create"
          element={
            <AdminProtectedRoute>
              <MentorForm />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/mentors/edit/:mentorId"
          element={
            <AdminProtectedRoute>
              <MentorForm />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <AdminProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
                <div className="text-white text-2xl">
                  Projects Overview - Coming Soon
                </div>
              </div>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/sessions"
          element={
            <AdminProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
                <div className="text-white text-2xl">
                  Sessions Management - Coming Soon
                </div>
              </div>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms/:roomId/view"
          element={
            <AdminProtectedRoute>
              <RoomView />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/message-rooms"
          element={
            <AdminProtectedRoute>
              <AdminRoomDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <AdminProtectedRoute>
              <AdminRoomDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/projects/edit/:id"
          element={
            <ProtectedRoute requiredRole="user">
              <ProjectForm mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute requiredRole="user">
              <DetailedProjectView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/mentors/:mentorId/ai-reason"
          element={
            <ProtectedRoute requiredRole="user">
              <ShowMentorDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/mentor-details/:mentorId"
          element={<MentorDetailsPageView />}
        />
        {/* Mentor Routes */}
        <Route
          path="/mentordashboard"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/settings"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorSetting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/projects"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/project/:id"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorDetailedProjectView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/user/:userId"
          element={
            <ProtectedRoute requiredRole="mentor">
              <UserProfileView />
            </ProtectedRoute>
          }
        />
        {/* for users viewing other users Future use if needed */}
        <Route
          path="/user/profile/:userId"
          element={
            <ProtectedRoute requiredRole="mentor">
              <UserProfileView />
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/user/mentor"
          element={
            <ProtectedRoute requiredRole="user">
              <MyMentor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/my-apprentice"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MyApprentice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/mileStone"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorMilestonePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/sessions"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/analysis"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/goals"
          element={
            <ProtectedRoute requiredRole="mentor">
              <GoalSetter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/messages"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/messages"
          element={
            <ProtectedRoute requiredRole="user">
              <LearnerMessagesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>

    <Toaster position="top-right" reverseOrder={false} />
  </React.StrictMode>
);
