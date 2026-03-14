const express = require('express');
const Joi = require('joi');
const { register, login, getMe } = require('./auth.controller');
const { validate } = require('../../middleware/validate');
const { protect } = require('../../middleware/auth');

const router = express.Router();

const registerSchema = Joi.object({
  email:     Joi.string().email().required(),
  password:  Joi.string().min(8).required(),
  firstName: Joi.string().min(1).max(100).required(),
  lastName:  Joi.string().min(1).max(100).required(),
  phone:     Joi.string().max(20).optional(),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.get('/me',        protect,                  getMe);

module.exports = router;
