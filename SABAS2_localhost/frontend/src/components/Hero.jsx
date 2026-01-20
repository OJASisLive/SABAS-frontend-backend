// src/components/Hero.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Rotating Text Component
const RotatingText = () => {
  const words = ["Students", "Drivers", "College"];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="bg-amber-400 text-white px-4 py-2 text-xl md:text-2xl font-bold rounded-lg shadow-lg inline-block transition-all duration-500 transform hover:scale-105">
      {words[currentWord]}
    </span>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center justify-center text-center"
      style={{
        background:
          "radial-gradient(ellipse at bottom center, rgba(0,153,255,0.9) 0%, rgba(0,102,204,0.8) 25%, rgba(10,10,20,1) 70%)",
      }}
    >
      {/* Optional subtle white-blue curved glow overlay */}
      <div className="absolute inset-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-[70vh] opacity-80"
        >
          <defs>
            <linearGradient id="heroFullGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00bfff" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#0b0b0f" />
            </linearGradient>
          </defs>
          <path
            fill="url(#heroFullGradient)"
            d="M0,192 C480,320 960,64 1440,192 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>

      {/* 🔹 Existing Hero Content (unchanged) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          <span className="animate-gradient"> BUS ALERT SYSTEM</span>
        </h1>

        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Track your college bus in real-time with{" "}
          <b className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 animate-gradient-x">
            SABAS
          </b>{" "}
          <br />
          Ensure safety and peace of mind for <RotatingText />
        </p>

        <button
          onClick={() => navigate("/register")}
          className="bg-amber-500 text-gray-900 hover:bg-amber-400 px-8 py-4 rounded-lg text-xl font-semibold transition-colors mb-12"
        >
          START FOR FREE
        </button>

        <div className="flex justify-center items-center w-full">
          <img
            src="https://babybus.in/images/screens.png"
            alt="Dashboard Preview"
            className="w-full max-w-3xl rounded-lg shadow-2xl 
                       transition-transform duration-200 ease-in-out 
                       hover:scale-105 hover:-translate-y-2 hover:rotate-1"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
