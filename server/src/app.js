const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes         = require('./modules/auth/auth.routes');
const vehiclesRoutes     = require('./modules/vehicles/vehicles.routes');
const reservationsRoutes = require('./modules/reservations/reservations.routes');
const uploadsRoutes      = require('./modules/uploads/uploads.routes');
const { errorHandler }   = require('./middleware/errorHandler');
const AppError           = require('./utils/AppError');

const app = express();

// ─── Security & Request Parsing ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/vehicles',     vehiclesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/uploads',      uploadsRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found.`, 404));
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
