import { formatCurrency } from '@/lib/utils';

interface PriceSummaryProps {
  dailyRate: number;
  totalDays: number;
  totalCost: number;
}

export default function PriceSummary({ dailyRate, totalDays, totalCost }: PriceSummaryProps) {
  return (
    <div className="bg-neutral-50 rounded-lg p-4 space-y-2 text-sm">
      <div className="flex justify-between text-neutral-600">
        <span>{formatCurrency(dailyRate)} &times; {totalDays} day{totalDays !== 1 ? 's' : ''}</span>
        <span>{formatCurrency(totalCost)}</span>
      </div>
      <div className="border-t border-neutral-200 pt-2 flex justify-between font-semibold text-gray-900">
        <span>Total</span>
        <span>{formatCurrency(totalCost)}</span>
      </div>
    </div>
  );
}
