// src/components/UserMenu.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Profile Circle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg hover:scale-105 transition-transform"
      >
        {/* Profile initials if no photo */}
        {user?.name
          ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
          : "U"}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl ring-1 ring-gray-200 overflow-hidden z-50">
          <div className="p-4 flex items-center gap-4 border-b">
            <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold text-lg">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <ul className="flex flex-col p-2 space-y-2">
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-amber-100 text-gray-700">
                Change Password
              </button>
            </li>
            <li>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-100 text-red-600 font-semibold"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
