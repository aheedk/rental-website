const vehiclesService = require('./vehicles.service');
const asyncHandler = require('../../utils/asyncHandler');

const getAllVehicles = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, available } = req.query;
  const vehicles = await vehiclesService.getAllVehicles({ category, minPrice, maxPrice, available });
  res.status(200).json({ status: 'success', results: vehicles.length, data: { vehicles } });
});

const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.getVehicleById(req.params.id);
  res.status(200).json({ status: 'success', data: { vehicle } });
});

const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.createVehicle(req.body);
  res.status(201).json({ status: 'success', data: { vehicle } });
});

const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.updateVehicle(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: { vehicle } });
});

const deleteVehicle = asyncHandler(async (req, res) => {
  await vehiclesService.deleteVehicle(req.params.id);
  res.status(204).send();
});

module.exports = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
