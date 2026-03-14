const db = require('../../config/db');
const AppError = require('../../utils/AppError');

async function getAllVehicles({ category, minPrice, maxPrice, available }) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (category) {
    conditions.push(`v.category = $${idx++}`);
    values.push(category);
  }
  if (minPrice !== undefined) {
    conditions.push(`v.daily_rate >= $${idx++}`);
    values.push(minPrice);
  }
  if (maxPrice !== undefined) {
    conditions.push(`v.daily_rate <= $${idx++}`);
    values.push(maxPrice);
  }
  if (available !== undefined) {
    conditions.push(`v.is_available = $${idx++}`);
    values.push(available === 'true' || available === true);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await db.query(
    `SELECT
       v.*,
       COALESCE(
         json_agg(vi ORDER BY vi.display_order) FILTER (WHERE vi.id IS NOT NULL),
         '[]'
       ) AS images
     FROM vehicles v
     LEFT JOIN vehicle_images vi ON vi.vehicle_id = v.id
     ${where}
     GROUP BY v.id
     ORDER BY v.created_at DESC`,
    values
  );

  return result.rows;
}

async function getVehicleById(id) {
  const result = await db.query(
    `SELECT
       v.*,
       COALESCE(
         json_agg(vi ORDER BY vi.display_order) FILTER (WHERE vi.id IS NOT NULL),
         '[]'
       ) AS images
     FROM vehicles v
     LEFT JOIN vehicle_images vi ON vi.vehicle_id = v.id
     WHERE v.id = $1
     GROUP BY v.id`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Vehicle not found.', 404);
  }

  return result.rows[0];
}

async function createVehicle({ make, model, year, category, transmission, seats, dailyRate, description }) {
  const result = await db.query(
    `INSERT INTO vehicles (make, model, year, category, transmission, seats, daily_rate, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [make, model, year, category, transmission || 'automatic', seats || 2, dailyRate, description || null]
  );

  return result.rows[0];
}

async function updateVehicle(id, fields) {
  const allowed = ['make', 'model', 'year', 'category', 'transmission', 'seats', 'daily_rate', 'description', 'is_available'];
  const updates = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(fields)) {
    const col = key.replace(/([A-Z])/g, '_$1').toLowerCase(); // camelCase → snake_case
    if (allowed.includes(col)) {
      updates.push(`${col} = $${idx++}`);
      values.push(value);
    }
  }

  if (updates.length === 0) {
    throw new AppError('No valid fields provided for update.', 400);
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  const result = await db.query(
    `UPDATE vehicles SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new AppError('Vehicle not found.', 404);
  }

  return result.rows[0];
}

async function deleteVehicle(id) {
  const result = await db.query('DELETE FROM vehicles WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    throw new AppError('Vehicle not found.', 404);
  }
}

module.exports = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
