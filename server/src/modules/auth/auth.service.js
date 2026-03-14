const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

async function register({ email, password, firstName, lastName, phone }) {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new AppError('An account with that email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await db.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, first_name, last_name, role`,
    [email, passwordHash, firstName, lastName, phone || null]
  );

  const user = result.rows[0];
  const token = signToken(user.id);

  return { user, token };
}

async function login({ email, password }) {
  const result = await db.query(
    'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Incorrect email or password.', 401);
  }

  const { password_hash, ...safeUser } = user;
  const token = signToken(user.id);

  return { user: safeUser, token };
}

async function getMe(userId) {
  const result = await db.query(
    'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('User not found.', 404);
  }

  return result.rows[0];
}

module.exports = { register, login, getMe };
