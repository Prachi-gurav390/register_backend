const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// const { OAuth2Client } = require('google-auth-library');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const guardRoutes = require('./routes/guards');
const logRoutes = require('./routes/Logs');

dotenv.config();
const app = express();

// Middleware

const allowedOrigins = [
  "http://localhost:3000",
  "https://register-frontend-six.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/guards', guardRoutes);
app.use('/api/logs', logRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
