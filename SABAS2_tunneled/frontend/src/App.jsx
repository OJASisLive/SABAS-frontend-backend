import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout & Landing Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Technologies from './components/Technologies';
import Footer from './components/Footer';

// Auth & Dashboard Components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BusManagement from './components/BusManagement';
import DriverManagement from './components/DriverManagement';
import StudentManagement from './components/StudentManagement';
import SchoolForm from './components/SchoolForm';
import Profile from './components/Profile';
import DashboardHome from './components/DashboardHome';
import DriverMapPage from './components/DriverMapPage';

// Auth Context
import { useAuth } from './context/AuthContext';

// Landing Page Component
function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Technologies />
      <Footer />
    </>
  );
}

// App Content
function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const showNavbar = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="bg-gray-900 text-white font-sans min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/driver-map/:busId" element={<DriverMapPage />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="buses" element={<BusManagement />} />
            <Route path="drivers" element={<DriverManagement />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="parents" element={<SchoolForm />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
