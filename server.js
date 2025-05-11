const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();

// ENV
require('dotenv').config();

// DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB verbunden'))
  .catch(err => console.error('MongoDB Fehler:', err));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(session({ secret: 'supersecret', resave: false, saveUninitialized: false }));
app.use(flash());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global Vars für Flash
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Routes
app.use('/', require('./routes/client/shop'));
app.use('/', require('./routes/client/video'));

app.use('/creator', require('./routes/creator/auth'));
app.use('/creator', require('./routes/creator/dashboard'));
app.use('/creator', require('./routes/creator/coupons'));

app.use('/admin', require('./routes/admin/auth'));
app.use('/admin', require('./routes/admin/dashboard'));
app.use('/admin', require('./routes/admin/videos'));
app.use('/admin', require('./routes/admin/creators'));
app.use('/admin', require('./routes/admin/admins'));
app.use('/admin', require('./routes/admin/coupons'));
app.use('/admin', require('./routes/admin/support'));

// 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'Seite nicht gefunden.' });
});

// Fehlerbehandlung für nicht gefundene Routen
app.use((req, res, next) => {
  const error = new Error('Nicht gefunden');
  error.status = 404;
  next(error);
});

// Globaler Fehler-Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log in der Konsole (Render Logs)
  
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'Stack versteckt' : err.stack,
  });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
