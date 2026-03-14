const express = require('express');
const multer = require('multer');
const { uploadImage, deleteImage } = require('./uploads.controller');
const { protect } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/requireAdmin');

const router = express.Router();

// Store files in memory so we can stream directly to S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB guard at multer level too
});

router.use(protect, requireAdmin);

router.post('/vehicles/:vehicleId', upload.single('image'), uploadImage);
router.delete('/images/:imageId',   deleteImage);

module.exports = router;
