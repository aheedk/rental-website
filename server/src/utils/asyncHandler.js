/**
 * Wraps an async Express route handler and forwards errors to next().
 * Eliminates repetitive try/catch blocks in every controller.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
