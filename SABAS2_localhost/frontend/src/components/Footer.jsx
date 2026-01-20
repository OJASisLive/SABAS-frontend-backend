import React from 'react';
import { FaFacebook, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden text-gray-300 py-20 px-6 sm:px-8 lg:px-12"
      style={{
        background:
          "radial-gradient(ellipse at bottom center, rgba(0,153,255,0.9) 0%, rgba(0,102,204,0.8) 25%, rgba(10,10,20,1) 70%)",
      }}
    >
      {/* Blue-White Glow Wave */}
      <div className="absolute inset-0 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-[70vh] opacity-80"
        >
          <defs>
            <linearGradient id="footerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00bfff" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#0b0b0f" />
            </linearGradient>
          </defs>
          <path
            fill="url(#footerGradient)"
            d="M0,192 C480,320 960,64 1440,192 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>

      {/* FOOTER CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Title */}
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-16
          bg-clip-text text-transparent
          bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500
          animate-gradient-x
          hover:scale-105 transition-transform duration-500"
        >
          CONTACT & CONNECT
        </h2>

        {/* 3 COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {/* Contact Info */}
          <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-lg transition-transform duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-start justify-center gap-3">
                <FaEnvelope className="text-amber-500 text-lg mt-1" />
                Guru Marudhar Kesari Building, Jyothi Nagar, Thoraipakkam, Chennai - 600097
              </li>
              <li className="flex items-center justify-center gap-3">
                <FaPhone className="text-amber-500 text-lg" /> +91 9176333850
              </li>
              <li>
                Website:{' '}
                <a
                  href="https://www.mnmjec.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-pink-400 transition-colors"
                >
                  mnmjec.ac.in
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Terms */}
          <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-lg transition-transform duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              Privacy & Terms
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-lg transition-transform duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex justify-center space-x-8">
              {[
                {
                  icon: <FaFacebook size={28} />,
                  href: "https://www.facebook.com/nikunj.kumar.124787?mibextid=ZbWKwL",
                },
                {
                  icon: <FaLinkedin size={28} />,
                  href: "https://www.linkedin.com/in/padmaraju-kishore-kumar-raju-929921288",
                },
                {
                  icon: <FaTwitter size={28} />,
                  href: "https://www.linkedin.com/in/shrishti-nandawat",
                },
                {
                  icon: <FaGithub size={28} />,
                  href: "https://github.com/nik1062",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-125 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & Developer Credit */}
        <div className="border-t border-gray-700 mt-16 pt-6 flex flex-col md:flex-row items-center justify-between text-black-800 text-sm">
          <span className="mt-2 md:mt-0 text-white font-semibold hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">@ 2025 all rights reserved sabas team.</span>
          <span className="mt-2 md:mt-0 text-white font-semibold hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
            Developed with ❤️ by
            <span className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-gray-900 px-2 py-1 rounded-full hover:animate-pulse">
              SABAS TEAM
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
