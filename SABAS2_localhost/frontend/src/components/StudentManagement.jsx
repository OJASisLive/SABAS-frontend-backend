import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    address: "",
    assignedBus: "",
    assignedDriver: "",
  });
  const [editingId, setEditingId] = useState(null);

  const [availableBuses, setAvailableBuses] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);

  // Fetch students, buses, and drivers from backend on component mount
  useEffect(() => {
    fetchStudents();
    fetchBuses();
    fetchDrivers();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/students`); // Your API endpoint
      setStudents(res.data.data || []);
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };

  const fetchBuses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/buses`);
      setAvailableBuses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching buses", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/drivers`);
      setAvailableDrivers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching drivers", err);
    }
  };

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    if (!newStudent.name || !newStudent.address) return;

    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/students/${editingId}`, newStudent);
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/students`, newStudent);
      }
      setNewStudent({ name: "", address: "", assignedBus: "", assignedDriver: "" });
      fetchStudents();
    } catch (err) {
      console.error("Error saving student", err);
    }
  };

  const handleEdit = (student) => {
    setNewStudent(student);
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">Manage Students</h2>

      {/* Add/Edit Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={newStudent.name}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300 bg-white text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none placeholder:text-gray-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newStudent.address}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300 bg-white text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none placeholder:text-gray-500"
          />
          <select
            name="assignedBus"
            value={newStudent.assignedBus}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300 bg-white text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
          >
            <option value="">Assign Bus</option>
            {availableBuses.map((bus) => (
              <option key={bus._id} value={bus.busNumber}>
                {bus.busNumber}
              </option>
            ))}
          </select>

          <select
            name="assignedDriver"
            value={newStudent.assignedDriver}
            onChange={handleInputChange}
            className="p-2 rounded border border-gray-300 bg-white text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
          >
            <option value="">Assign Driver</option>
            {availableDrivers.map((driver) => (
              <option key={driver._id} value={driver.name}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddOrUpdate}
          className="mt-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-400 flex items-center transition"
        >
          <FaPlus className="mr-2" />
          {editingId ? "Update Student" : "Add Student"}
        </button>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Assigned Bus</th>
              <th className="p-3 text-left">Assigned Driver</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-gray-200 hover:bg-orange-50 transition-colors duration-200"
              >
                <td className="p-3 text-gray-900">{student.name}</td>
                <td className="p-3 text-gray-900">{student.address}</td>
                <td className="p-3 text-gray-900">{student.assignedBus}</td>
                <td className="p-3 text-gray-900">{student.assignedDriver}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
