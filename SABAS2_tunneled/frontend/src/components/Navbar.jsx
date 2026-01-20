import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logoUrl = "https://i.postimg.cc/Hj5Yb4Xs/abhi1.jpg";

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const goHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-700">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          {/* --- LOGO SECTION (LEFT) --- */}
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={goHome}
          >
            <img
              src={logoUrl}
              alt="Bus Alert Logo"
              className="h-12 w-12 mr-2 object-cover rounded-full border border-gray-700 hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/2040/2040504.png";
              }}
            />
            <span className="text-white font-bold text-2xl tracking-wide hover:text-amber-400 transition-colors duration-200">
              Bus Alert
            </span>
          </div>

          {/* --- RIGHT SIDE NAVIGATION --- */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-300 hover:text-amber-400 transition text-sm font-medium"
            >
              FEATURES
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-300 hover:text-amber-400 transition text-sm font-medium"
            >
              PRICING
            </button>
            <button
              onClick={() => scrollToSection("technologies")}
              className="text-gray-300 hover:text-amber-400 transition text-sm font-medium"
            >
              TECHNOLOGIES
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-300 hover:text-amber-400 transition text-sm font-medium"
            >
              CONTACT
            </button>

            {/* --- LOGIN / REGISTER --- */}
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium border border-gray-600 transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              LOGIN
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-400 text-gray-900"
                    : "bg-amber-500 text-gray-900 hover:bg-amber-400"
                }`
              }
            >
              REGISTER
            </NavLink>
          </div>

          {/* --- MOBILE MENU BUTTON (RIGHT CORNER) --- */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 pt-2 pb-3 space-y-2 transition-all duration-300">
          {[
            { name: "FEATURES", id: "features" },
            { name: "PRICING", id: "pricing" },
            { name: "TECHNOLOGIES", id: "technologies" },
            { name: "CONTACT", id: "contact" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {link.name}
            </button>
          ))}

          <NavLink
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-md text-sm font-medium border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            LOGIN
          </NavLink>

          <NavLink
            to="/register"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-md text-sm font-medium bg-amber-500 text-gray-900 hover:bg-amber-400"
          >
            REGISTER
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
