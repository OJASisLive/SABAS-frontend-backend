const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendSMS } = require('../config/smsConfig');
const { sendEmail } = require('../config/emailConfig');

const multer = require('multer');
const path = require('path');

// Multer configuration (local for this route)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// JWT Authentication Middleware (local for this route)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ===== SEND OTP =====
router.post('/send-otp', async (req, res) => {
  try {
    const { email, mobile, method } = req.body;

    if ((method === 'email' && !email) || (method === 'mobile' && !mobile)) {
      return res.status(400).json({ message: `${method} required` });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Save OTP to DB
    const query = method === 'email' ? { email } : { mobile };
    await Otp.findOneAndUpdate(query, { otp, otpExpiry }, { upsert: true, new: true });

    // Send OTP
    const result = method === 'email'
      ? await sendEmail(email, 'BabyBus OTP', `Your OTP is ${otp}`)
      : await sendSMS(mobile, `Your OTP is ${otp}`);

    return res.json({
      success: result.success,
      message: result.success ? 'OTP sent successfully' : 'Failed to send OTP'
    });

  } catch (err) {
    console.error('SEND OTP ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ===== VERIFY OTP =====
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;
    const query = email ? { email } : { mobile };

    const otpRecord = await Otp.findOne(query);
    if (!otpRecord) return res.status(400).json({ message: 'OTP not found' });
    if (otpRecord.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (otpRecord.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP expired' });

    // Delete OTP after verification
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.json({ success: true, message: 'OTP verified successfully' });

  } catch (err) {
    console.error('VERIFY OTP ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ===== REGISTER =====
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    // Ensure OTP verification is done
    const otpPending = await Otp.findOne({ email }) || await Otp.findOne({ mobile });
    if (otpPending) return res.status(400).json({ message: 'OTP not verified yet' });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ success: true, user, token });

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Exclude password from response
    const { password: _, ...userResponse } = user.toObject();

    return res.json({ success: true, user: userResponse, token });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ===== GET USER PROFILE =====
router.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Security: Ensure user can only access their own profile
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to access this profile' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user without password
    const { password, ...userResponse } = user.toObject();

    res.json({ success: true, user: userResponse });

  } catch (err) {
    console.error('GET USER ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// ===== UPDATE USER PROFILE =====
router.put('/users/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, mobile } = req.body;

    // Security: Ensure user can only update their own profile
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this profile' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) {
      // Check if email is unique (if changed)
      if (email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = email;
      }
    }
    if (mobile) {
      // Check if mobile is unique (if changed)
      if (mobile !== user.mobile) {
        const existingMobile = await User.findOne({ mobile });
        if (existingMobile) {
          return res.status(400).json({ message: 'Mobile number already in use' });
        }
        user.mobile = mobile;
      }
    }

    // Handle image upload
    if (req.file) {
      // Optional: Delete old image if exists (implement if needed)
      user.image = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // Return updated user without password
    const { password, ...userResponse } = user.toObject();

    res.json({ success: true, user: userResponse });

  } catch (err) {
    console.error('UPDATE USER ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
