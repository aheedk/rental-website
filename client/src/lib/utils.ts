/**
 * Format a date string to a readable format (e.g., "Jun 15, 2025")
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a number as USD currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Calculate rental cost on the client side (mirrors server pricing.js)
 */
export function calculateRentalCost(
  startDate: string,
  endDate: string,
  dailyRate: number
): { totalDays: number; totalCost: number } | null {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay);
  const totalCost = parseFloat((totalDays * dailyRate).toFixed(2));

  return { totalDays, totalCost };
}

/**
 * Get a human-readable label for a reservation status
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };
  return map[status] ?? 'bg-gray-100 text-gray-800';
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
