'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Vehicle } from '@/types/vehicle';
import { useCreateReservation } from '@/hooks/useReservations';
import { useAuth } from '@/hooks/useAuth';
import { calculateRentalCost } from '@/lib/utils';
import DateRangePicker from './DateRangePicker';
import PriceSummary from './PriceSummary';
import Button from '@/components/ui/Button';

interface BookingFormProps {
  vehicle: Vehicle;
}

export default function BookingForm({ vehicle }: BookingFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [notes, setNotes]         = useState('');

  const { create, loading, error } = useCreateReservation();
  const { user } = useAuth();
  const router   = useRouter();

  const pricing = startDate && endDate
    ? calculateRentalCost(startDate, endDate, vehicle.dailyRate)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    if (!startDate || !endDate || !pricing) return;

    try {
      const reservation = await create({ vehicleId: vehicle.id, startDate, endDate, notes });
      router.push(`/reservations?success=${reservation.id}`);
    } catch {
      // error state is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
      />

      {pricing && (
        <PriceSummary
          dailyRate={vehicle.dailyRate}
          totalDays={pricing.totalDays}
          totalCost={pricing.totalCost}
        />
      )}

      <div>
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any special requests?"
          className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        loading={loading}
        disabled={!startDate || !endDate || !pricing || !vehicle.isAvailable}
        className="w-full"
      >
        {!vehicle.isAvailable
          ? 'Vehicle Unavailable'
          : user
          ? 'Request Booking'
          : 'Sign In to Book'}
      </Button>
    </form>
  );
}
