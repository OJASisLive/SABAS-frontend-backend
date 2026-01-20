import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Socket.IO
const socket = io(`${import.meta.env.VITE_TUNNEL_ADDRESS}`, {
  transports: ["websocket"],
  reconnection: true,
});

const DriverMapPage = () => {
  const { busId } = useParams();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const routeRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [busData, setBusData] = useState(null);
  const [autoFollow, setAutoFollow] = useState(true);

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("driverMap").setView([28.6139, 77.209], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Stop auto-follow on user interaction
    map.on("dragstart zoomstart", () => setAutoFollow(false));

    mapRef.current = map;
    setIsMapReady(true);
  }, []);

  // Fetch bus info and route
  useEffect(() => {
    if (!isMapReady) return;

    const fetchBusAndRoute = async () => {
      try {
        // Get driver location
        const res = await axios.get(
          `${import.meta.env.VITE_TUNNEL_ADDRESS}/api/drivers?assignedBus=${busId}`
        );
        const driver = res.data.data[0];
        setBusData(driver);

        // Bus marker
        if (driver.latitude && driver.longitude) {
          const busIcon = L.icon({
            iconUrl: "/icons/bus_icon",
            iconSize: [32, 32],
          });

          if (markerRef.current) {
            markerRef.current.setLatLng([driver.latitude, driver.longitude]);
          } else {
            const marker = L.marker([driver.latitude, driver.longitude], { icon: busIcon })
              .addTo(mapRef.current)
              .bindPopup(`<b>${driver.name}</b>`);
            markerRef.current = marker;
          }

          if (autoFollow) {
            mapRef.current.setView([driver.latitude, driver.longitude], 14);
          }
        }

        // Load route
        const geoRes = await axios.get(`/routes/${busId}.geojson`);
        if (routeRef.current) {
          routeRef.current.clearLayers();
          routeRef.current.addData(geoRes.data);
        } else {
          routeRef.current = L.geoJSON(geoRes.data, { style: { color: "blue", weight: 4 } }).addTo(mapRef.current);
        }
      } catch (err) {
        console.error("Error loading bus/route:", err);
      }
    };

    fetchBusAndRoute();
  }, [busId, isMapReady, autoFollow]);

  // Live location updates
  useEffect(() => {
    if (!isMapReady) return;

    const handleLocationUpdate = ({ driverId, latitude, longitude }) => {
      if (driverId !== busId || !latitude || !longitude) return;

      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        const busIcon = L.icon({
          iconUrl: "/icons/bus_icon",
          iconSize: [32, 32],
        });
        markerRef.current = L.marker([latitude, longitude], { icon: busIcon }).addTo(mapRef.current);
      }

      if (autoFollow) {
        mapRef.current.setView([latitude, longitude]);
      }
    };

    socket.on("locationUpdated", handleLocationUpdate);
    return () => socket.off("locationUpdated", handleLocationUpdate);
  }, [isMapReady, busId, autoFollow]);

  const recenter = () => {
    if (busData?.latitude && busData?.longitude) {
      mapRef.current.setView([busData.latitude, busData.longitude], 14);
      setAutoFollow(true);
    }
  };

  return (
    <div className="relative">
      <div id="driverMap" className="h-[600px] w-full rounded shadow" />

      {/* Recenter Icon Button */}
      {!autoFollow && (
        <button
          onClick={recenter}
          className="absolute top-4 right-4 z-50 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <img src="/icons/recenter_icon" alt="Recenter" className="h-6 w-6"/>
        </button>
      )}
    </div>
  );
};

export default DriverMapPage;
