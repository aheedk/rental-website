const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const s3 = require('../../config/s3');
const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadVehicleImage(vehicleId, file, isPrimary = false) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError('Only JPEG, PNG, and WebP images are allowed.', 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new AppError('Image must be under 5MB.', 400);
  }

  // Verify vehicle exists
  const vehicleCheck = await db.query('SELECT id FROM vehicles WHERE id = $1', [vehicleId]);
  if (vehicleCheck.rows.length === 0) {
    throw new AppError('Vehicle not found.', 404);
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const s3Key = `vehicles/${vehicleId}/${uuidv4()}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

  // If this is set as primary, unset existing primary
  if (isPrimary) {
    await db.query(
      'UPDATE vehicle_images SET is_primary = FALSE WHERE vehicle_id = $1',
      [vehicleId]
    );
  }

  // Get current max display_order
  const orderResult = await db.query(
    'SELECT COALESCE(MAX(display_order), -1) AS max_order FROM vehicle_images WHERE vehicle_id = $1',
    [vehicleId]
  );
  const displayOrder = orderResult.rows[0].max_order + 1;

  const result = await db.query(
    `INSERT INTO vehicle_images (vehicle_id, s3_key, url, is_primary, display_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [vehicleId, s3Key, url, isPrimary, displayOrder]
  );

  return result.rows[0];
}

async function deleteVehicleImage(imageId) {
  const result = await db.query(
    'SELECT id, s3_key, vehicle_id, is_primary FROM vehicle_images WHERE id = $1',
    [imageId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Image not found.', 404);
  }

  const image = result.rows[0];

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: image.s3_key,
    })
  );

  await db.query('DELETE FROM vehicle_images WHERE id = $1', [imageId]);

  // If we deleted the primary, auto-assign the next image as primary
  if (image.is_primary) {
    await db.query(
      `UPDATE vehicle_images
       SET is_primary = TRUE
       WHERE id = (
         SELECT id FROM vehicle_images
         WHERE vehicle_id = $1
         ORDER BY display_order ASC
         LIMIT 1
       )`,
      [image.vehicle_id]
    );
  }
}

module.exports = { uploadVehicleImage, deleteVehicleImage };
