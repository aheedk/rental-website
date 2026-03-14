const db = require('../../config/db');
const AppError = require('../../utils/AppError');
const { calculateRentalCost } = require('../../utils/pricing');

/**
 * Check if a vehicle has any confirmed/pending reservations overlapping [startDate, endDate].
 * Uses the standard interval overlap condition: existingStart < reqEnd AND existingEnd > reqStart
 */
async function checkAvailability(vehicleId, startDate, endDate, excludeReservationId = null) {
  let queryText = `
    SELECT id FROM reservations
    WHERE vehicle_id = $1
      AND status NOT IN ('cancelled')
      AND start_date < $3
      AND end_date   > $2
  `;
  const values = [vehicleId, startDate, endDate];

  if (excludeReservationId) {
    queryText += ` AND id != $4`;
    values.push(excludeReservationId);
  }

  queryText += ' LIMIT 1';

  const result = await db.query(queryText, values);
  return result.rows.length === 0; // true = available
}

async function createReservation({ userId, vehicleId, startDate, endDate, notes }) {
  // 1. Verify vehicle exists and is available for booking
  const vehicleResult = await db.query(
    'SELECT id, daily_rate, is_available FROM vehicles WHERE id = $1',
    [vehicleId]
  );

  if (vehicleResult.rows.length === 0) {
    throw new AppError('Vehicle not found.', 404);
  }

  const vehicle = vehicleResult.rows[0];

  if (!vehicle.is_available) {
    throw new AppError('This vehicle is currently unavailable for booking.', 409);
  }

  // 2. Check for date conflicts
  const isAvailable = await checkAvailability(vehicleId, startDate, endDate);
  if (!isAvailable) {
    throw new AppError('This vehicle is already booked for the selected dates.', 409);
  }

  // 3. Calculate cost
  const { totalDays, totalCost } = calculateRentalCost(startDate, endDate, vehicle.daily_rate);

  // 4. Insert reservation
  const result = await db.query(
    `INSERT INTO reservations (user_id, vehicle_id, start_date, end_date, total_days, total_cost, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, vehicleId, startDate, endDate, totalDays, totalCost, notes || null]
  );

  return result.rows[0];
}

async function getUserReservations(userId) {
  const result = await db.query(
    `SELECT
       r.*,
       json_build_object(
         'id', v.id, 'make', v.make, 'model', v.model, 'year', v.year,
         'category', v.category, 'daily_rate', v.daily_rate
       ) AS vehicle,
       (
         SELECT url FROM vehicle_images
         WHERE vehicle_id = v.id AND is_primary = TRUE
         LIMIT 1
       ) AS vehicle_image
     FROM reservations r
     JOIN vehicles v ON v.id = r.vehicle_id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );

  return result.rows;
}

async function getReservationById(id, userId, userRole) {
  const result = await db.query(
    `SELECT r.*, json_build_object(
       'id', v.id, 'make', v.make, 'model', v.model, 'year', v.year
     ) AS vehicle
     FROM reservations r
     JOIN vehicles v ON v.id = r.vehicle_id
     WHERE r.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Reservation not found.', 404);
  }

  const reservation = result.rows[0];

  // Customers can only view their own reservations
  if (userRole !== 'admin' && reservation.user_id !== userId) {
    throw new AppError('You do not have permission to view this reservation.', 403);
  }

  return reservation;
}

async function getAllReservations({ status, vehicleId }) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (status) {
    conditions.push(`r.status = $${idx++}`);
    values.push(status);
  }
  if (vehicleId) {
    conditions.push(`r.vehicle_id = $${idx++}`);
    values.push(vehicleId);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await db.query(
    `SELECT
       r.*,
       json_build_object('id', u.id, 'email', u.email, 'first_name', u.first_name, 'last_name', u.last_name) AS customer,
       json_build_object('id', v.id, 'make', v.make, 'model', v.model, 'year', v.year) AS vehicle
     FROM reservations r
     JOIN users u ON u.id = r.user_id
     JOIN vehicles v ON v.id = r.vehicle_id
     ${where}
     ORDER BY r.created_at DESC`,
    values
  );

  return result.rows;
}

async function updateReservationStatus(id, status) {
  const validTransitions = {
    pending:   ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    cancelled: [],
    completed: [],
  };

  const current = await db.query('SELECT status FROM reservations WHERE id = $1', [id]);

  if (current.rows.length === 0) {
    throw new AppError('Reservation not found.', 404);
  }

  const currentStatus = current.rows[0].status;

  if (!validTransitions[currentStatus].includes(status)) {
    throw new AppError(
      `Cannot transition reservation from '${currentStatus}' to '${status}'.`,
      409
    );
  }

  const result = await db.query(
    `UPDATE reservations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );

  return result.rows[0];
}

async function cancelReservation(id, userId, userRole) {
  const current = await db.query(
    'SELECT id, user_id, status FROM reservations WHERE id = $1',
    [id]
  );

  if (current.rows.length === 0) {
    throw new AppError('Reservation not found.', 404);
  }

  const reservation = current.rows[0];

  if (userRole !== 'admin' && reservation.user_id !== userId) {
    throw new AppError('You do not have permission to cancel this reservation.', 403);
  }

  if (!['pending', 'confirmed'].includes(reservation.status)) {
    throw new AppError(`Cannot cancel a reservation with status '${reservation.status}'.`, 409);
  }

  const result = await db.query(
    `UPDATE reservations SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );

  return result.rows[0];
}

module.exports = {
  createReservation,
  getUserReservations,
  getReservationById,
  getAllReservations,
  updateReservationStatus,
  cancelReservation,
  checkAvailability,
};
