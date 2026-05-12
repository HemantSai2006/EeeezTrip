/**
 * routes/auth.js
 * /api/auth  —  register · login · me · logout
 */

const { Router }                     = require('express');
const { body, validationResult }     = require('express-validator');
const authController                 = require('../controllers/authController');
const authMiddleware                 = require('../middleware/authMiddleware');
const rateLimit                      = require('express-rate-limit');

const router = Router();

// ─── Rate limiter: max 10 auth attempts per 15 min per IP ───────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      10,
  message:  { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

// ─── Validation helpers ──────────────────────────────────────────────────────
const validateRegister = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Full name must be 2–60 characters.'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),
];

const validateLogin = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()[0].msg, // first error message
      errors:  errors.array(),
    });
  }
  next();
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  validateRegister,
  handleValidation,
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  validateLogin,
  handleValidation,
  authController.login
);

// GET  /api/auth/me  (protected)
router.get('/me', authMiddleware, authController.me);

// POST /api/auth/logout  (client drops token — server just acks)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
