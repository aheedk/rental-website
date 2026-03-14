const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };

  // PostgreSQL unique violation
  if (err.code === '23505') {
    error = new AppError('A record with that value already exists.', 409);
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    error = new AppError('Referenced record does not exist.', 400);
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    error = new AppError('Data validation failed at the database level.', 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong. Please try again.';

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status: 'error',
      message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({ status: 'error', message });
};

module.exports = { errorHandler };
