import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardHome = () => {
  const [breakdowns, setBreakdowns] = useState({
    drivers: { total: 0, verified: 0, notVerified: 0 },
    students: { total: 0, assigned: 0, unassigned: 0 },
    parents: { total: 0, verified: 0, notVerified: 0 }
  });

  useEffect(() => {
    fetchBreakdowns();
  }, []);

  const fetchBreakdowns = async () => {
    try {
      const [driverStatsRes, studentStatsRes, parentStatsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/drivers/stats`),
        axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/students/stats`),
        axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/users/stats`),
      ]);

      const driverStats = driverStatsRes.data || { total: 0, verified: 0, notVerified: 0 };
      const studentStats = studentStatsRes.data || { total: 0, assigned: 0, unassigned: 0 };
      const parentStats = parentStatsRes.data || { total: 0, verified: 0, notVerified: 0 };

      setBreakdowns({
        drivers: driverStats,
        students: studentStats,
        parents: parentStats
      });
    } catch (error) {
      console.error('Error fetching breakdowns:', error);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const getPieData = (labels, data, title) => ({
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: ['#f59e0b', '#9ca3af'], // Orange for positive, gray for negative
        borderWidth: 1,
      },
    ],
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Dashboard</h2>
      <p className="text-gray-600 mb-8">Select an option from the sidebar to get started.</p>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Drivers Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Drivers Progress</h3>
          <Pie
            data={getPieData(['Verified', 'Not Verified'], [breakdowns.drivers.verified, breakdowns.drivers.notVerified], 'Drivers')}
            options={chartOptions}
          />
        </div>

        {/* Students Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Students Progress</h3>
          <Pie
            data={getPieData(['Assigned', 'Unassigned'], [breakdowns.students.assigned, breakdowns.students.unassigned], 'Students')}
            options={chartOptions}
          />
        </div>

        {/* Parents Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Parents Progress</h3>
          <Pie
            data={getPieData(['Verified', 'Not Verified'], [breakdowns.parents.verified, breakdowns.parents.notVerified], 'Parents')}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
