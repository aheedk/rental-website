/**
 * Calculate rental cost based on daily rate and date range.
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @param {number} dailyRate  - USD per day
 * @returns {{ totalDays: number, totalCost: number }}
 */
function calculateRentalCost(startDate, endDate, dailyRate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    throw new Error('End date must be after start date');
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((end - start) / msPerDay);
  const totalCost = parseFloat((totalDays * dailyRate).toFixed(2));

  return { totalDays, totalCost };
}

module.exports = { calculateRentalCost };
