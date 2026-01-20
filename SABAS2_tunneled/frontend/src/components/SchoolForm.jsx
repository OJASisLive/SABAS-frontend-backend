import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaSave, FaSchool, FaTrash } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SchoolForm = () => {
  const [school, setSchool] = useState({
    _id: null,
    name: "",
    code: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [schools, setSchools] = useState([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch schools
  const fetchSchools = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/school`);
      const data = await res.json();
      setSchools(data);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!map) {
      const mapInstance = L.map("map").setView([28.6139, 77.209], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance);

      const markerInstance = L.marker([28.6139, 77.209], { draggable: true }).addTo(mapInstance);

      markerInstance.on("dragend", async () => {
        const { lat, lng } = markerInstance.getLatLng();
        setSchool((prev) => ({ ...prev, latitude: lat, longitude: lng }));
        fetchAddressFromLatLng(lat, lng);
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    }
  }, [map]);

  // Reverse Geocoding
  const fetchAddressFromLatLng = async (lat, lng) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_TUNNEL_ADDRESS}/api/geocode/reverse?lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data.display_name) {
        setSchool((prev) => ({ ...prev, address: data.display_name }));
      }
    } catch (err) {
      console.error("Reverse geocode failed:", err);
    }
  };

  // Debounce timer reference
  const typingTimeoutRef = useRef(null);

  const handleNameChange = (value) => {
    setSchool((prev) => ({ ...prev, name: value }));

    // Clear the previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new debounce timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (value.trim().length >= 3) {
        handleSearch(value);
      } else {
        setSuggestions([]);
      }
    }, 1500);
  };


  // Autocomplete search
  const handleSearch = async (value) => {
    setSchool((prev) => ({ ...prev, name: value }));
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_TUNNEL_ADDRESS}/api/geocode/search?q=${value}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSuggestionClick = (s) => {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);

    setSchool((prev) => ({
      ...prev,
      name: s.display_name.split(",")[0] || "",
      address: s.display_name || "",
      latitude: lat,
      longitude: lon,
    }));

    if (map && marker) {
      const latlng = [lat, lon];
      map.setView(latlng, 15);
      marker.setLatLng(latlng);
    }

    setSuggestions([]);
  };

  // Input change
  const handleChange = (e) => {
    setSchool((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save School (POST or PUT)
  const handleSave = async () => {
  try {
      const isEditing = !!school._id; // if school has _id, it's an existing record
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${import.meta.env.VITE_TUNNEL_ADDRESS}/api/school/${school.code}`
        : `${import.meta.env.VITE_TUNNEL_ADDRESS}/api/school`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(school),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      alert(isEditing ? "School updated successfully!" : "School added successfully!");

      setSchool({
        _id: null,
        name: "",
        code: "",
        address: "",
        latitude: "",
        longitude: "",
      }); // clear form after save

      fetchSchools();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };


  // Delete School
  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await fetch(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/school/${code}`, {
        method: "DELETE",
      });
      fetchSchools();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Edit School
  const handleEdit = (s) => {
    setSchool({
      _id: s._id || null,
      code: s.code || "",
      name: s.name || "",
      address: s.address || "",
      latitude: s.latitude || "",
      longitude: s.longitude || "",
    });

    if (map && marker) {
      const latlng = [parseFloat(s.latitude) || 28.6139, parseFloat(s.longitude) || 77.209];
      map.setView(latlng, 15);
      marker.setLatLng(latlng);
    }
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* Form + Map */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaSchool className="mr-2 text-yellow-600" /> College Form
        </h2>

        {/* Autocomplete */}
        <label className="block text-sm">College Name</label>
        <input
          type="text"
          name="name"
          value={school.name || ""}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        {suggestions.length > 0 && (
          <ul className="border bg-white max-h-40 overflow-y-auto mb-3">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}

        <label className="block text-sm">College Code</label>
        <input
          type="text"
          name="code"
          value={school.code || ""}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block text-sm">Address</label>
        <input
          type="text"
          name="address"
          value={school.address || ""}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <div id="map" className="h-64 w-full mb-3 rounded shadow"></div>

        <button
          onClick={handleSave}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          <FaSave className="inline mr-2" /> Save
        </button>
      </div>

      {/* Schools Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">College List</h2>
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((s) => (
              <tr key={s._id} className="align-middle"> {/* ensures row content is vertically centered */}
                <td className="p-2 border">{s.code}</td>
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.address}</td>

                <td className="p-2 border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="w-8 h-8 rounded flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white leading-none"
                      aria-label="Edit"
                    >
                      <FaEdit className="w-4 h-4 block" />
                    </button>

                    <button
                      onClick={() => handleDelete(s.code)}
                      className="w-8 h-8 rounded flex items-center justify-center bg-red-500 hover:bg-red-600 text-white leading-none"
                      aria-label="Delete"
                    >
                      <FaTrash className="w-4 h-4 block" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolForm;
