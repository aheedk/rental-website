const express = require('express');
const Joi = require('joi');
const {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  getAllReservations,
  updateReservationStatus,
  checkAvailability,
} = require('./reservations.controller');
const { protect } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/requireAdmin');
const { validate } = require('../../middleware/validate');

const router = express.Router();

const createReservationSchema = Joi.object({
  vehicleId: Joi.string().uuid().required(),
  startDate: Joi.date().iso().greater('now').required(),
  endDate:   Joi.date().iso().greater(Joi.ref('startDate')).required(),
  notes:     Joi.string().max(500).optional(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('confirmed', 'cancelled', 'completed').required(),
});

// Public availability check
router.get('/availability', checkAvailability);

// Authenticated customer routes
router.use(protect);
router.post('/',         validate(createReservationSchema), createReservation);
router.get('/my',        getMyReservations);
router.get('/:id',       getReservationById);
router.patch('/:id/cancel', cancelReservation);

// Admin-only routes
router.get('/',              requireAdmin, getAllReservations);
router.patch('/:id/status',  requireAdmin, validate(updateStatusSchema), updateReservationStatus);

module.exports = router;
