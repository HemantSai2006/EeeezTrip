/**
 * db/userStore.js
 * Simple file-based user store (JSON).
 * For production, replace with a real database (MongoDB, PostgreSQL, etc.)
 */

const fs   = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'users.json');

// ─── Helpers ────────────────────────────────────────────────────────────────

function readAll() {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

function writeAll(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// ─── Public API ─────────────────────────────────────────────────────────────

const UserStore = {
  getAll() {
    return readAll();
  },

  findById(id) {
    return readAll().find(u => u.id === id) || null;
  },

  findByEmail(email) {
    return readAll().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  create(userData) {
    const users = readAll();
    users.push(userData);
    writeAll(users);
    return userData;
  },

  update(id, updates) {
    const users = readAll();
    const idx   = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    writeAll(users);
    return users[idx];
  },

  delete(id) {
    const users  = readAll();
    const filtered = users.filter(u => u.id !== id);
    writeAll(filtered);
    return filtered.length < users.length;
  },

  count() {
    return readAll().length;
  },
};

module.exports = UserStore;
