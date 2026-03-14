'use client';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: DateRangePickerProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
          Pick-up Date
        </label>
        <input
          type="date"
          value={startDate}
          min={today}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
          Return Date
        </label>
        <input
          type="date"
          value={endDate}
          min={startDate || today}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
    </div>
  );
}
