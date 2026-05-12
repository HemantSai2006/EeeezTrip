/**
 * routes/ai.js
 * /api/ai  —  protected Anthropic proxy
 */

const { Router }    = require('express');
const rateLimit     = require('express-rate-limit');
const authMiddleware = require('../middleware/authMiddleware');
const aiController  = require('../controllers/aiController');

const router = Router();

// ─── Rate limiter: 30 AI requests per minute per IP ─────────────────────────
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max:      30,
  message:  { success: false, message: 'Too many AI requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

// POST /api/ai/chat  (requires valid JWT)
router.post('/chat', authMiddleware, aiLimiter, aiController.chat);

module.exports = router;
