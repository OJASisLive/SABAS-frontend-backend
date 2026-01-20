import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaMobile, FaArrowRight, FaCheck } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP related states
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [verificationMethod, setVerificationMethod] = useState('email'); // <-- default now 'email'

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (isNaN(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP key down
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length <= 6) {
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      const lastIndex = Math.min(pastedData.length, 6) - 1;
      const nextInput = document.getElementById(`otp-${lastIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  // OTP resend timer
  useEffect(() => {
    let timer;
    if (otpResendTimer > 0) {
      timer = setInterval(() => {
        setOtpResendTimer(prev => (prev <= 1 ? (clearInterval(timer), 0) : prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpResendTimer]);

  // Send OTP
  const sendOtp = async () => {
    if (verificationMethod === 'email' && !email) {
      setError('Please provide email address for verification');
      return;
    }
    if (verificationMethod === 'mobile' && !mobile) {
      setError('Please provide mobile number for verification');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: verificationMethod === 'email' ? email : '',
          mobile: verificationMethod === 'mobile' ? mobile : '',
          method: verificationMethod,
        }),
      });

      let data = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) { setError(data.message || 'Failed to send OTP'); setLoading(false); return; }

      setOtpSent(true);
      setStep(2);
      if (data.otp) alert(`Your OTP is ${data.otp}. Please enter it manually.`);
      setOtpResendTimer(30);
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally { setLoading(false); }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      // Prepare payload depending on verification method
      const payload = {
        otp: otpValue,
        method: verificationMethod,
        ...(verificationMethod === 'email' ? { email } : { mobile })
      };

      const res = await fetch(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.message || 'Invalid OTP');
        setLoading(false);
        return;
      }

      // OTP verified successfully → proceed to register user
      registerUser();

    } catch (err) {
      console.error(err);
      setOtpError('Server error. Please try again later.');
      setLoading(false);
    }
  };

  // Register user
  const registerUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_TUNNEL_ADDRESS}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile, password, role: 'user' }),
      });

      let data = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) { setError(data.message || 'Registration failed'); setLoading(false); return; }

      if (data.token && data.user) { contextLogin(data.user, data.token); navigate('/'); }
      else { alert('Registration successful! Please login.'); navigate('/login'); }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally { setLoading(false); }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) sendOtp(); else if (step === 2) verifyOtp();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center animate-gradient">Create Account</h2>
      {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

      {step === 1 ? (
        <>
          <h3 className="text-center text-gray-600 mb-6">Register with email or mobile</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required
                className="w-full pl-10 p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full pl-10 p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" />
            </div>

            {/* Mobile */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMobile className="text-gray-400" />
              </div>
              <input type="tel" placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} required
                className="w-full pl-10 p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full pl-10 p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" />
            </div>

            {/* Verification method (EMAIL first, then MOBILE) */}
            <div className="flex items-center space-x-2 text-sm">
              <span>Verify via:</span>

              {/* EMAIL button (works) */}
              <button
                type="button"
                onClick={() => setVerificationMethod('email')}
                className={`px-3 py-1 rounded-full ${verificationMethod === 'email' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Email
              </button>

              {/* MOBILE button (coming soon) */}
              <button
                type="button"
                onClick={() => {
                  // show message that mobile feature is not yet available
                  setError('This feature coming soon');
                  // clear message after 3 seconds
                  setTimeout(() => setError(''), 3000);
                }}
                className={`px-3 py-1 rounded-full bg-gray-200 text-gray-700`}
              >
                Mobile
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 text-white py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
              {loading ? 'Sending OTP...' : 'Send OTP'}
              <FaArrowRight />
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              We've sent a verification code to your {verificationMethod === 'mobile' ? 'mobile number' : 'email address'}
            </p>
            <p className="font-medium text-gray-800 mt-2">{verificationMethod === 'mobile' ? mobile : email}</p>
          </div>

          {otpError && <p className="mb-4 text-red-500 text-center">{otpError}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off"
                  value={digit} onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)} onPaste={index === 0 ? handleOtpPaste : undefined}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none bg-white text-black"
                />
              ))}
            </div>

            <div className="text-center">
              {otpResendTimer > 0 ? (
                <p className="text-gray-500">Resend OTP in {otpResendTimer} seconds</p>
              ) : (
                <button type="button" onClick={sendOtp} className="text-amber-500 font-medium hover:underline">Resend OTP</button>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 text-white py-3 rounded-md font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
              {loading ? 'Verifying...' : 'Verify & Create Account'}
              <FaCheck />
            </button>

            <button type="button" onClick={() => setStep(1)}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Back to Form
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-amber-500 font-medium hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
