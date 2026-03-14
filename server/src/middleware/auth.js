const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const db = require('../config/db');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Not authenticated. Please log in.', 401);
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired token.', 401);
  }

  const result = await db.query(
    'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
    [decoded.id]
  );

  if (result.rows.length === 0) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  req.user = result.rows[0];
  next();
});

module.exports = { protect };
