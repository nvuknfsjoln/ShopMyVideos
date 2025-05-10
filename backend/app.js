const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
require('./config/db')();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shop', require('./routes/shopRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/creator', require('./routes/creatorRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

// Static for frontend (optional until integration)
app.use(express.static(path.join(__dirname, '../frontend/public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
