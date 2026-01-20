// src/components/Pricing.jsx
import React from "react";
import { FaCheck } from "react-icons/fa";

const pricingPlans = [
  {
    title: "FREE",
    price: "₹0 /year",
    features: [
      "100 Tracked Buses",
      "100 Seats (Children)",
      "Basic Live Tracking",
      "Community Support",
    ],
  },
  {
    title: "PAY AS YOU GO",
    price: "₹1000 /year",
    features: [
      "Unlimited Bus Tracking",
      "Unlimited Seats (Students)",
      "Priority Support",
      "Advanced Route Analytics",
    ],
  },
];

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(ellipse at bottom center, rgba(0,153,255,0.9) 0%, rgba(0,102,204,0.8) 25%, rgba(10,10,20,1) 70%)",
      }}
    >
      {/* 🔹 Curved White-Blue Glow Overlay */}
      <div className="absolute inset-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-[70vh] opacity-80"
        >
          <defs>
            <linearGradient id="pricingFullGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00bfff" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#0b0b0f" />
            </linearGradient>
          </defs>
          <path
            fill="url(#pricingFullGradient)"
            d="M0,192 C480,320 960,64 1440,192 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>

      {/* 🔹 PRICING CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Title */}
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-16
          bg-clip-text text-transparent
          bg-gradient-to-r from-green-400 via-blue-500 to-purple-500
          animate-gradient-x
          hover:scale-105 transition-transform duration-500"
        >
          PRICING
        </h2>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="bg-gray-800/80 rounded-xl p-8 text-center shadow-lg border border-gray-700
                         transition-transform transition-shadow duration-500 ease-in-out
                         hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:border-amber-500 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{plan.title}</h3>
              <p className="text-3xl font-bold text-amber-500 mb-8">{plan.price}</p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-center text-gray-300
                               transition-transform duration-300 hover:scale-110 hover:text-amber-400"
                  >
                    <FaCheck className="text-amber-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="w-full bg-amber-500 text-gray-900 hover:bg-amber-400 py-3 rounded-md font-semibold
                           transition-colors duration-300"
              >
                GET STARTED
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
