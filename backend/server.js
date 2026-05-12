/**
 * server.js  —  Eeeztrip Backend Entry Point
 *
 * Responsibilities:
 *  1. Bootstrap Express with security/utility middleware
 *  2. Mount API routers
 *  3. Seed the demo account on first run
 *  4. Start the HTTP server
 */

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const bcrypt     = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const authRoutes = require('./routes/auth');
const aiRoutes   = require('./routes/ai');
const tripRoutes = require('./routes/trips');
const flightRoutes = require('./routes/flights');
const trainRoutes  = require('./routes/trains');
const busRoutes    = require('./routes/buses');
const hotelRoutes  = require('./routes/hotels');
const connectDB  = require('./db/db');

// Connect to MongoDB
connectDB();

// ─── App ─────────────────────────────────────────────────────────────────────
const app = express();
app.set('trust proxy', 1);

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: true,
  credentials: true,
}));

// ─── Body & Logging ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/ai',   aiRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/hotels', hotelRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// ─── 404 & Error Handler ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║        Eeeztrip Backend Running          ║');
    console.log(`║  URL  →  http://localhost:${PORT}            ║`);
    console.log(`║  ENV  →  ${(process.env.NODE_ENV || 'development').padEnd(32)}║`);
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
});
