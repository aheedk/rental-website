const reservationsService = require('./reservations.service');
const asyncHandler = require('../../utils/asyncHandler');

const createReservation = asyncHandler(async (req, res) => {
  const { vehicleId, startDate, endDate, notes } = req.body;
  const reservation = await reservationsService.createReservation({
    userId: req.user.id,
    vehicleId,
    startDate,
    endDate,
    notes,
  });
  res.status(201).json({ status: 'success', data: { reservation } });
});

const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await reservationsService.getUserReservations(req.user.id);
  res.status(200).json({ status: 'success', results: reservations.length, data: { reservations } });
});

const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await reservationsService.getReservationById(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.status(200).json({ status: 'success', data: { reservation } });
});

const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationsService.cancelReservation(
    req.params.id,
    req.user.id,
    req.user.role
  );
  res.status(200).json({ status: 'success', data: { reservation } });
});

// Admin
const getAllReservations = asyncHandler(async (req, res) => {
  const { status, vehicleId } = req.query;
  const reservations = await reservationsService.getAllReservations({ status, vehicleId });
  res.status(200).json({ status: 'success', results: reservations.length, data: { reservations } });
});

const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const reservation = await reservationsService.updateReservationStatus(req.params.id, status);
  res.status(200).json({ status: 'success', data: { reservation } });
});

// Public availability check
const checkAvailability = asyncHandler(async (req, res) => {
  const { vehicleId, startDate, endDate } = req.query;
  const isAvailable = await reservationsService.checkAvailability(vehicleId, startDate, endDate);
  res.status(200).json({ status: 'success', data: { isAvailable } });
});

module.exports = {
  createReservation,
  getMyReservations,
  getReservationById,
  cancelReservation,
  getAllReservations,
  updateReservationStatus,
  checkAvailability,
};
