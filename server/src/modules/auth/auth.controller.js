const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  const { user, token } = await authService.register({ email, password, firstName, lastName, phone });

  res.status(201).json({ status: 'success', token, data: { user } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  res.status(200).json({ status: 'success', token, data: { user } });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.status(200).json({ status: 'success', data: { user } });
});

module.exports = { register, login, getMe };
