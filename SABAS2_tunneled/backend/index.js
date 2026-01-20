require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Initialize express app
const app = express();

// ---------------------- MIDDLEWARE ---------------------- //
app.use(express.json());

app.use(
  cors({
    origin: [ 'https://teamsabas.baazsmp.fun',"https://sabas.baazsmp.fun"],
    credentials: true,
  })
);

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const multer = require('multer');
const path = require('path');

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

app.locals.upload = upload;

// JWT Authentication Middleware
const jwt = require('jsonwebtoken');

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

app.locals.authenticateToken = authenticateToken;

// ---------------------- DATABASE ---------------------- //
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ---------------------- SERVER & SOCKET.IO ---------------------- //
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://teamsabas.baazsmp.fun',"https://sabas.baazsmp.fun"],
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// Make io accessible in routes
app.set('io', io);

// Socket.io handlers
io.on('connection', (socket) => {
  console.log('IO Client connected:', socket.id);

  // When driver app sends live updates directly
  socket.on('updateLocation', (data) => {
    console.log('Realtime update:', data);
    io.emit('locationUpdated', data); // broadcast to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('IO Client disconnected:', socket.id);
  });
});

// ---------------------- ROUTES ---------------------- //
app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/bus'));
app.use('/api/students', require('./routes/student'));
app.use('/api/drivers', require('./routes/driver'));
app.use('/api/users', require('./routes/user'));
app.use('/api/routes', require('./routes/schoolRoutes'));
app.use('/api/school', require('./routes/schoolRoutes'));
app.use('/api/location', require('./routes/location')); // includes io.emit inside
app.use('/api/geocode', require('./routes/geocode'));

// ---------------------- ERROR HANDLING ---------------------- //
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// ---------------------- START SERVER ---------------------- //
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
