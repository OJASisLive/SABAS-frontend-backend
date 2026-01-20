import React, { useState, useEffect } from "react";
import axios from "axios";

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    busNumber: "",
    capacity: "",
    routeFrom: "",
    assignedDriver: "",
  });
  const [editId, setEditId] = useState(null);

  const [availableDrivers, setAvailableDrivers] = useState([]);

  // Fetch buses on mount
  useEffect(() => {
    fetchBuses();
    fetchDrivers();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/buses`);
      setBuses(res.data.data || []);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/buses/${editId}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/buses`, formData);
      }
      setFormData({
        busNumber: "",
        capacity: "",
        routeFrom: "",
        assignedDriver: "",
      });
      setEditId(null);
      fetchBuses();
    } catch (err) {
      console.error("Error saving bus", err);
    }
  };

  const handleEdit = (bus) => {
    setFormData({
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      routeFrom: bus.routeFrom,
      assignedDriver: bus.assignedDriver,
    });
    setEditId(bus._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/buses/${id}`);
      fetchBuses();
    } catch (err) {
      console.error("Error deleting bus", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Buses</h2>

      {/* Bus Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl shadow-sm mb-8"
      >
        <input
          type="text"
          name="busNumber"
          placeholder="Bus Number"
          value={formData.busNumber}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          name="routeFrom"
          placeholder="Route Number and Name"
          value={formData.routeFrom}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        />
        {/* <input
          type="text"
          name="assignedDriver"
          placeholder="Assigned Driver"
          value={formData.assignedDriver}
          onChange={handleChange}
          className="p-3 border rounded-lg"
          required
        /> */}

        <div className="relative">
          <select
            name="assignedDriver"
            value={formData.assignedDriver}
            onChange={handleChange}
            className="p-3 border rounded-lg bg-white text-gray-900 appearance-none w-full"
          >
            <option value="">Assign Driver</option>
            {availableDrivers.map((driver) => (
              <option key={driver._id} value={driver.name}>
                {driver.name}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            ▼
          </span>
        </div>


        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition"
        >
          {editId ? "Update Bus" : "Add Bus"}
        </button>
      </form>

      {/* Bus Table */}
      <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border">Bus Number</th>
            <th className="p-3 border">Capacity</th>
            <th className="p-3 border">Route Name</th>
            <th className="p-3 border">Assigned Driver</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.length > 0 ? (
            buses.map((bus) => (
              <tr key={bus._id} className="hover:bg-gray-50">
                <td className="p-3 border">{bus.busNumber}</td>
                <td className="p-3 border">{bus.capacity}</td>
                <td className="p-3 border">{bus.routeFrom}</td>
                <td className="p-3 border">{bus.assignedDriver}</td>
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => handleEdit(bus)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bus._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No buses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BusManagement;
