// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// .env laden
dotenv.config();

// DB verbinden
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routen (werden später hinzugefügt)
app.use('/api/shop', require('./routes/public/shopRoutes'));
app.use('/api/support', require('./routes/public/supportRoutes'));
app.use('/api/creator', require('./routes/creator/creatorPanel'));
app.use('/api/creator/auth', require('./routes/creator/creatorAuth'));
app.use('/api/admin', require('./routes/admin/adminPanel'));
app.use('/api/admin/auth', require('./routes/admin/adminAuth'));

// Fallback Route
app.use((req, res) => {
  res.status(404).json({ message: 'Route nicht gefunden.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
