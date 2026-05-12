# Eeeztrip — Backend Server

Express.js REST API that secures the Anthropic API key and handles user authentication for the Eeeztrip frontend.

---

## Quick Start

### 1 — Install dependencies
```bash
cd eeeztrip-backend
npm install
```

### 2 — Configure environment
```bash
cp .env.example .env
```

Open `.env` and set:
- `ANTHROPIC_API_KEY` — get from https://console.anthropic.com/
- `JWT_SECRET` — run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` to generate one

### 3 — Start server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Server runs at **http://localhost:5000**

---

## API Reference

### Auth Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | ❌ | Create a new account |
| POST | `/api/auth/login` | ❌ | Log in, receive JWT |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| POST | `/api/auth/logout` | ✅ | Logout (client drops token) |

#### Register
```json
POST /api/auth/register
{
  "fullName": "Priya Sharma",
  "email": "priya@example.com",
  "password": "mypassword"
}
```
Response:
```json
{
  "success": true,
  "token": "<JWT>",
  "user": { "id": "...", "email": "...", "fullName": "..." }
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "demo@eeeztrip.com",
  "password": "demo123"
}
```

---

### AI Endpoint (Protected)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/ai/chat` | ✅ JWT | Proxy to Claude API |

```json
POST /api/ai/chat
Authorization: Bearer <token>
{
  "messages": [
    { "role": "user", "content": "Plan a 3-day trip to Goa for ₹8000" }
  ]
}
```
Response:
```json
{
  "success": true,
  "reply": "Great choice! Here's your Goa plan... 🏖"
}
```

---

### Health Check

```
GET /api/health
```
```json
{ "status": "ok", "service": "Eeeztrip API", "users": 1 }
```

---

## Authentication Flow

All protected routes require:
```
Authorization: Bearer <JWT token>
```

JWTs expire after 7 days by default (configurable via `JWT_EXPIRES_IN`).

---

## Project Structure

```
eeeztrip-backend/
├── server.js                 # Entry point — Express app, startup, seeding
├── package.json
├── .env.example              # Environment variable template
├── .gitignore
├── routes/
│   ├── auth.js               # /api/auth/* routes + validation + rate limiting
│   └── ai.js                 # /api/ai/* routes + rate limiting
├── middleware/
│   └── authMiddleware.js     # JWT verification → req.user
├── controllers/
│   ├── authController.js     # register / login / getMe / logout logic
│   └── aiController.js       # Anthropic API proxy
└── db/
    └── userStore.js          # File-based JSON user store
```

---

## Frontend Integration

Update `REACT_APP_API_URL` (or a constant in your frontend) to `http://localhost:5000`.

After login, store the returned JWT and send it in every request:
```js
localStorage.setItem('eeeztrip_token', token);

// In API calls:
headers: { 'Authorization': `Bearer ${localStorage.getItem('eeeztrip_token')}` }
```

See the updated frontend files (`frontend-fixes/`) for the complete integration.

---

## Security Notes

- Passwords are hashed with **bcrypt** (cost factor 12) — never stored in plain text
- API key lives only on the server — never exposed to the browser
- Rate limiting: 10 auth attempts / 15 min per IP, 30 AI requests / min per IP
- Input validation via `express-validator` on all auth endpoints
- CORS restricted to `FRONTEND_URL` in `.env`

---

## Production Deployment

For production, replace `db/userStore.js` with a real database driver (MongoDB/Mongoose or PostgreSQL/pg). The controller interfaces (`findByEmail`, `create`, etc.) are stable — only the store implementation changes.
