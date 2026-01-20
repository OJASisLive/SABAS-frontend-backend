import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUserCircle, FaBusAlt, FaUsers, FaUserTie, FaChild } from 'react-icons/fa';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState([
    { title: 'Total Drivers', value: 0, icon: <FaUserTie size={28} />, color: 'bg-orange-500' },
    { title: 'Total Students', value: 0, icon: <FaChild size={28} />, color: 'bg-blue-500' },
    { title: 'Total Routes', value: 0, icon: <FaUsers size={28} />, color: 'bg-green-500' },
    { title: 'Total Buses', value: 0, icon: <FaBusAlt size={28} />, color: 'bg-purple-500' },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [driverStatsRes, studentStatsRes, routesRes, busesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/drivers/stats`),
        axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/students/stats`),
        axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/routes`),
        axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/buses`),
      ]);

      const driverStats = driverStatsRes.data || { total: 0 };
      const studentStats = studentStatsRes.data || { total: 0 };
      const routesCount = Array.isArray(routesRes.data) ? routesRes.data.length : routesRes.data.data?.length || 0;
      const busesCount = Array.isArray(busesRes.data) ? busesRes.data.length : busesRes.data.data?.length || 0;

      setStats([
        { title: 'Total Drivers', value: driverStats.total, icon: <FaUserTie size={28} />, color: 'bg-orange-500' },
        { title: 'Total Students', value: studentStats.total, icon: <FaChild size={28} />, color: 'bg-blue-500' },
        { title: 'Total Routes', value: routesCount, icon: <FaUsers size={28} />, color: 'bg-green-500' },
        { title: 'Total Buses', value: busesCount, icon: <FaBusAlt size={28} />, color: 'bg-purple-500' },
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center px-6 py-3 shadow-md bg-gradient-to-r from-amber-500 to-orange-400 text-white">
        <NavLink to="/" className="text-white no-underline hover:text-white">
          <h1 className="text-xl font-bold tracking-wide">SABAS Admin Dashboard</h1>
        </NavLink>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 rounded-full px-3 py-2 hover:bg-orange-500 transition"
          >
            {user.image ? (
              <img
                src={`${import.meta.env.VITE_TUNNEL_ADDRESS}${user.image}`}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <FaUserCircle size={28} className="text-white" />
            )}
            <span className="hidden md:inline font-medium">{user.name}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-3 z-50">
              <div className="px-4 pb-2 border-b border-gray-100">
                <p className="text-gray-800 font-semibold">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              <NavLink
                to="/dashboard/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-orange-100 rounded-md"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Content Area */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 border-r border-gray-200 flex flex-col shadow-sm">
          <NavLink to="/dashboard" className="text-2xl font-bold mb-8 text-orange-600 hover:text-orange-700 no-underline">
            Admin Panel
          </NavLink>
          <nav className="flex flex-col space-y-3">
            <NavLink
              to="/dashboard/drivers"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${isActive ? 'bg-orange-500 text-white shadow' : 'text-gray-700 hover:bg-orange-100'}` 
              }
            >
              <b>Manage Drivers</b>
            </NavLink>
            <NavLink
              to="/dashboard/students"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${isActive ? 'bg-orange-500 text-white shadow' : 'text-gray-700 hover:bg-orange-100'}` 
              }
            >
              <b>Manage Students</b>
            </NavLink>
            <NavLink
              to="/dashboard/parents"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${isActive ? 'bg-orange-500 text-white shadow' : 'text-gray-700 hover:bg-orange-100'}` 
              }
            >
              <b>Manage Routes</b>
            </NavLink>
            <NavLink
              to="/dashboard/buses"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${isActive ? 'bg-orange-500 text-white shadow' : 'text-gray-700 hover:bg-orange-100'}` 
              }
            >
              <b>Manage Buses</b>
            </NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-grow p-8 bg-gray-50 overflow-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition"
              >
                <div className={`p-3 rounded-full text-white ${stat.color}`}>{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Nested routes render here */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
