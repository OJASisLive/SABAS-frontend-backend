import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'user';
  const emailFromForgot = queryParams.get('email') || '';

  const [email, setEmail] = useState(emailFromForgot);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (emailFromForgot) {
      setEmail(emailFromForgot);
    }
  }, [emailFromForgot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try { data = await res.json(); } catch { data = {}; }

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      contextLogin(data.user, data.token);

      navigate('/dashboard');
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Please enter your email address to reset password');
      setTimeout(() => setError(''), 3000);
      return;
    }
    navigate(`/forgot-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 animate-pulse bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
        {role === 'admin' ? 'School Admin Login' : 'Login To SABAS'}
      </h2>
      {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

      <h3 className="text-center text-gray-600 mb-6">
        Login with your credentials
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="text-gray-400" />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-10 p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-amber-500 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-white py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Register Link */}
      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-amber-500 font-medium hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
