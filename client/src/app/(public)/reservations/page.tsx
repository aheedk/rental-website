'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useMyReservations } from '@/hooks/useReservations';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function ReservationsPage() {
  const { reservations, loading, error, cancel } = useMyReservations();
  const searchParams = useSearchParams();
  const successId    = searchParams.get('success');

  if (loading) return <Spinner className="py-40" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {successId && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md px-4 py-3 text-sm">
          Booking request submitted successfully. We&apos;ll confirm shortly.
        </div>
      )}

      {error && <p className="text-red-600 mb-6">{error}</p>}

      {reservations.length === 0 ? (
        <p className="text-neutral-500">You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <div key={res.id} className="bg-white border border-neutral-200 rounded-xl p-5 flex gap-5">
              {res.vehicleImage && (
                <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                  <Image src={res.vehicleImage} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {res.vehicle
                        ? `${res.vehicle.year} ${res.vehicle.make} ${res.vehicle.model}`
                        : 'Vehicle'}
                    </p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      {formatDate(res.startDate)} — {formatDate(res.endDate)} &bull; {res.totalDays} day{res.totalDays !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge status={res.status} />
                </div>
                <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                  <p className="font-semibold text-gray-900">{formatCurrency(res.totalCost)}</p>
                  {['pending', 'confirmed'].includes(res.status) && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (confirm('Cancel this reservation?')) cancel(res.id);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
