import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({name: "", licenseNo: "", mobileNo: "", assignedBus: "", verified: false, email: "", collegeCode: ""});
  const [editId, setEditId] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [routeLayer, setRouteLayer] = useState(null);
  const [autoFollow, setAutoFollow] = useState(true);
  const prevPositionRef = useRef(null);
  const socket = useRef(null);

  // ---------------------- ICON ---------------------- //
  const busIcon = L.icon({
    iconUrl: "/icons/bus_icon.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  // ---------------------- INITIALIZATION ---------------------- //
  useEffect(() => {
    fetchDrivers();

    if (!map) {
      const mapInstance = L.map("driverMap").setView([28.6139, 77.209], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance);

      // Detect manual map movement
      mapInstance.on("dragstart zoomstart", () => setAutoFollow(false));

      setMap(mapInstance);
    }

    // Initialize Socket.IO
    if (!socket.current) {
      socket.current = io(import.meta.env.VITE_SOCKET_IO_URL);
      socket.current.on("locationUpdated", (data) => {
        if (selectedDriver && data.busId === selectedDriver.assignedBus) {
          updateBusMarker(data.latitude, data.longitude);
        }
      });
    }

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [map, selectedDriver]);

  // ---------------------- FETCH DRIVERS ---------------------- //
  const fetchDrivers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/drivers`);
    setDrivers(res.data.data || []);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await axios.put(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/drivers/${editId}`, formData);
    else await axios.post(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/drivers`, formData);

    setFormData({ name: "", licenseNo: "", mobileNo: "", assignedBus: "" });
    setEditId(null);
    fetchDrivers();
  };

  const handleEdit = (driver) => {
    setFormData(driver);
    setEditId(driver._id);
    showDriverLocation(driver);
  };

  const handleSelect = async (driver) => {
    setSelectedDriver(driver);
    showDriverLocation(driver);
    await showRouteForDriver(driver);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/drivers/${id}`);
    fetchDrivers();
  };

  // ---------------------- LOCATION ---------------------- //
  const showDriverLocation = async (driver) => {
    if (!map) return;

    const busId = driver.assignedBus;
    if (!busId) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/location/get-location?bus_id=${busId}`);
      const data = await res.json();
      if (data.status !== "success") return;

      const { latitude: lat = 28.6139, longitude: lng = 77.209 } = data.location;
      updateBusMarker(lat, lng);
    } catch (err) {
      console.error("Error fetching driver location:", err);
    }
  };

  const updateBusMarker = (lat, lng) => {
    if (!map) return;

    let angle = 0;
    if (prevPositionRef.current) {
      const [prevLat, prevLng] = prevPositionRef.current;
      const dy = lat - prevLat;
      const dx = lng - prevLng;
      angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    }
    prevPositionRef.current = [lat, lng];

    if (marker) {
      marker.setLatLng([lat, lng]);
      const el = marker.getElement();
      if (el) el.style.transform = `rotate(${angle}deg)`;
    } else {
      const m = L.marker([lat, lng], { icon: busIcon }).addTo(map);
      m.on("click", () => setAutoFollow(true));
      setMarker(m);
    }

    if (autoFollow) {
      map.setView([lat, lng], 16, { animate: true });
    }
  };

  // ---------------------- RECENTER ---------------------- //
  const handleRecenter = () => {
    if (!marker || !map) return;
    const latlng = marker.getLatLng();
    map.setView([latlng.lat, latlng.lng], 16, { animate: true });
    setAutoFollow(true);

      // Temporarily ignore drag/zoom events for 500ms
      const ignoreEvents = true;
      setTimeout(() => setAutoFollow(true), 500);
  };

  // ---------------------- ROUTE ---------------------- //
  const showRouteForDriver = async (driver) => {
    if (!map) return;

    if (routeLayer) {
      map.removeLayer(routeLayer);
      setRouteLayer(null);
    }

    const busId = driver.assignedBus;
    try {
      const res = await fetch(`/routes/${busId}.geojson`);
      if (!res.ok) throw new Error("Route not found");
      const geojsonData = await res.json();

      const newLayer = L.geoJSON(geojsonData, { style: { color: "blue", weight: 4 } }).addTo(map);
      map.fitBounds(newLayer.getBounds());
      setRouteLayer(newLayer);
    } catch (err) {
      console.warn(`No route found for bus ${busId}`);
    }
  };

  // ---------------------- RENDER ---------------------- //
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Driver Management Form & Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Manage Drivers</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-50 p-4 rounded shadow mb-6">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Driver Name"
            required
            className="p-2 border rounded"
          />

          <input
            name="licenseNo"
            value={formData.licenseNo}
            onChange={handleChange}
            placeholder="License Number"
            required
            className="p-2 border rounded"
          />

          <input
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            placeholder="Mobile Number"
            required
            className="p-2 border rounded"
          />

          <input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="p-2 border rounded"
          />

          <input
            name="collegeCode"
            value={formData.collegeCode || ""}
            onChange={handleChange}
            placeholder="College Code"
            className="p-2 border rounded"
          />

          <input
            name="assignedBus"
            value={formData.assignedBus}
            onChange={handleChange}
            placeholder="Assigned Bus"
            required
            className="p-2 border rounded"
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="verified"
              checked={formData.verified || false}
              onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
            />
            <span>Verified</span>
          </label>

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition"
          >
            {editId ? "Update" : "Add"}
          </button>
        </form>
        <table className="w-full border text-left mb-6">
          <thead className="bg-gray-100"><tr><th>Name</th><th>Bus</th><th>Actions</th></tr></thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.assignedBus}</td>
                <td className="space-x-2">
                  <button onClick={() => handleEdit(d)} className="bg-blue-500 text-white px-2 rounded">Edit</button>
                  <button onClick={() => handleSelect(d)} className="bg-green-500 text-white px-2 rounded">Select</button>
                  <button onClick={() => handleDelete(d._id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Driver Location Map */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Driver Location</h2>

        <div id="driverMapWrapper" className="relative h-96 w-full rounded shadow">
          <div id="driverMap" className="h-full w-full"></div>

          {/* Recenter button */}
          {!autoFollow && marker && (
            <button
              onClick={handleRecenter}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg z-[1000]"
            >
              <img src="/icons/recenter_icon.png" alt="Recenter" className="w-9 h-9"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
