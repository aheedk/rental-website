const uploadsService = require('./uploads.service');
const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided.', 400);
  }

  const { vehicleId } = req.params;
  const isPrimary = req.body.isPrimary === 'true';

  const image = await uploadsService.uploadVehicleImage(vehicleId, req.file, isPrimary);

  res.status(201).json({ status: 'success', data: { image } });
});

const deleteImage = asyncHandler(async (req, res) => {
  await uploadsService.deleteVehicleImage(req.params.imageId);
  res.status(204).send();
});

module.exports = { uploadImage, deleteImage };
