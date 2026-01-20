import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";

// Connect to backend Socket.IO server
const socket = io(`${import.meta.env.VITE_TUNNEL_ADDRESS}`, {
  transports: ["websocket"], // ensures stable real-time updates
  reconnection: true,
});

const DriverMap = ({ drivers }) => {
  const mapRef = useRef(null);          // store Leaflet map instance
  const markersRef = useRef({});        // store markers for each driver
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map once
  useEffect(() => {
    if (mapRef.current) return; // prevent reinit

    const map = L.map("driverMap").setView([28.6139, 77.209], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
    setIsMapReady(true);
  }, []);

  // Add initial driver markers when map is ready
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    drivers.forEach((d) => {
      if (!d.latitude || !d.longitude) return;
      if (markersRef.current[d._id]) return; // skip if already added

      const busIcon = L.icon({
        iconUrl: "/bus-icon.png",
        iconSize: [32, 32],
      });

      const marker = L.marker([d.latitude, d.longitude], { icon: busIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>${d.name || "Driver"}</b>`);

      markersRef.current[d._id] = marker;
    });
  }, [drivers, isMapReady]);

  // Listen for live location updates via socket
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    const handleLocationUpdate = ({ driverId, latitude, longitude }) => {
      if (!latitude || !longitude) return;

      const existingMarker = markersRef.current[driverId];

      if (existingMarker) {
        // Update position
        existingMarker.setLatLng([latitude, longitude]);
      } else {
        // Create new marker if not found
        const busIcon = L.icon({
          iconUrl: "/bus-icon.png",
          iconSize: [32, 32],
        });

        const marker = L.marker([latitude, longitude], { icon: busIcon })
          .addTo(mapRef.current)
          .bindPopup(`<b>Driver ${driverId}</b>`);

        markersRef.current[driverId] = marker;
      }
    };

    socket.on("locationUpdated", handleLocationUpdate);
    console.log('Received IO')

    // Cleanup on unmount
    return () => {
      socket.off("locationUpdated", handleLocationUpdate);
    };
  }, [isMapReady]);

  return (
    <div
      id="driverMap"
      className="h-[500px] w-full rounded shadow"
      style={{ zIndex: 0 }}
    ></div>
  );
};

export default DriverMap;
