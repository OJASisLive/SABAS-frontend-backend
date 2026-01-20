// src/components/Technologies.jsx
import React from "react";

const technologies = [
  "Android",
  "ReactJS",
  "ExpressJS",
  "Firebase",
  "Leaflet",
  "Socket.io",
  "OpenStreetMap",
];

const Technologies = () => {
  return (
    <section
      id="technologies"
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at bottom center, rgba(0,153,255,0.9) 0%, rgba(0,102,204,0.8) 25%, rgba(10,10,20,1) 70%)",
      }}
    >
      {/* 🔹 Curved Blue-White Glow Overlay */}
      <div className="absolute inset-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-[70vh] opacity-80"
        >
          <defs>
            <linearGradient id="techFullGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00bfff" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#0b0b0f" />
            </linearGradient>
          </defs>
          <path
            fill="url(#techFullGradient)"
            d="M0,192 C480,320 960,64 1440,192 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>

      {/* 🔹 TECHNOLOGIES CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Animated Heading */}
        <h2
          className="text-4xl md:text-5xl font-bold mb-12
          bg-clip-text text-transparent
          bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500
          animate-gradient-x
          hover:scale-105 transition-transform duration-500"
        >
          TECHNOLOGIES
        </h2>

        {/* Technology Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 
                         text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg
                         transition-transform transition-shadow duration-300 ease-in-out
                         hover:scale-110 hover:-translate-y-1 hover:shadow-2xl cursor-pointer backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Optional Brand Image */}
        <div className="flex justify-center items-center">
          <img
            // src="https://babybus.in/images/branffds.png"
            // alt="Technologies & Brands"
            className="max-w-full h-auto rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105 hover:-translate-y-2"
          />
        </div>
      </div>
    </section>
  );
};

export default Technologies;
