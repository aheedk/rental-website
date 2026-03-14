const AppError = require('../utils/AppError');

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new AppError('You do not have permission to perform this action.', 403);
  }
  next();
};

module.exports = { requireAdmin };
