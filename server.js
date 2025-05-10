const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routen
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const shopRoutes = require('./routes/shopRoutes');
const videoRoutes = require('./routes/videoRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien
app.use(express.static(path.join(__dirname, 'public')));

// Views konfigurieren
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routen
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/videos', videoRoutes);

// Startseite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Datenbankverbindung & Start
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB verbunden');
  app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
})
.catch(err => console.error('MongoDB Fehler:', err));
