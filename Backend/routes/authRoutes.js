const express = require('express');
const router = express.Router();

// In-memory user store for development/testing only
const users = [];
let nextId = 1;

function makeToken() {
  return `dev-token-${Math.random().toString(36).slice(2, 10)}`;
}

router.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const user = { id: nextId++, name, email, role };
  users.push({ ...user, password }); // store password only in-memory for dev

  const token = makeToken();

  return res.status(201).json({ token, user });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password.' });
  }

  const found = users.find((u) => u.email === email && u.password === password);

  if (!found) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const { password: _p, ...user } = found;
  const token = makeToken();

  return res.json({ token, user });
});

module.exports = router;
