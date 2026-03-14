const express = require('express');
const Joi = require('joi');
const { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('./vehicles.controller');
const { protect } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/requireAdmin');
const { validate } = require('../../middleware/validate');

const router = express.Router();

const createVehicleSchema = Joi.object({
  make:         Joi.string().required(),
  model:        Joi.string().required(),
  year:         Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).required(),
  category:     Joi.string().valid('sports', 'suv', 'sedan', 'convertible', 'coupe').required(),
  transmission: Joi.string().valid('automatic', 'manual').default('automatic'),
  seats:        Joi.number().integer().min(1).max(10).default(2),
  dailyRate:    Joi.number().positive().required(),
  description:  Joi.string().max(2000).optional(),
});

const updateVehicleSchema = Joi.object({
  make:         Joi.string(),
  model:        Joi.string(),
  year:         Joi.number().integer().min(1990).max(new Date().getFullYear() + 1),
  category:     Joi.string().valid('sports', 'suv', 'sedan', 'convertible', 'coupe'),
  transmission: Joi.string().valid('automatic', 'manual'),
  seats:        Joi.number().integer().min(1).max(10),
  dailyRate:    Joi.number().positive(),
  description:  Joi.string().max(2000).allow(''),
  isAvailable:  Joi.boolean(),
}).min(1);

// Public routes
router.get('/',    getAllVehicles);
router.get('/:id', getVehicleById);

// Admin-only routes
router.use(protect, requireAdmin);
router.post('/',    validate(createVehicleSchema), createVehicle);
router.patch('/:id', validate(updateVehicleSchema), updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
