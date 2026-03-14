'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useVehicle } from '@/hooks/useVehicles';
import BookingForm from '@/components/reservations/BookingForm';
import Spinner from '@/components/ui/Spinner';
import { formatCurrency, capitalize } from '@/lib/utils';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { vehicle, loading, error } = useVehicle(id);

  if (loading) return <Spinner className="py-40" />;

  if (error || !vehicle) {
    return (
      <div className="text-center py-40">
        <p className="text-red-600">{error ?? 'Vehicle not found.'}</p>
      </div>
    );
  }

  const primaryImage = vehicle.images?.find((img) => img.isPrimary) ?? vehicle.images?.[0];
  const otherImages  = vehicle.images?.filter((img) => img.id !== primaryImage?.id) ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-300 text-sm">
                No image available
              </div>
            )}
          </div>
          {otherImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {otherImages.slice(0, 4).map((img) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
                  <Image src={img.url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info + Booking */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-neutral-500 uppercase tracking-wider">{capitalize(vehicle.category)}</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {formatCurrency(vehicle.dailyRate)}{' '}
              <span className="text-base font-normal text-neutral-500">/ day</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Seats', value: vehicle.seats },
              { label: 'Transmission', value: capitalize(vehicle.transmission) },
              { label: 'Year', value: vehicle.year },
              { label: 'Category', value: capitalize(vehicle.category) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-neutral-50 rounded-lg px-4 py-3">
                <p className="text-neutral-400 text-xs uppercase tracking-wider">{label}</p>
                <p className="font-medium text-gray-900 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {vehicle.description && (
            <p className="text-neutral-600 text-sm leading-relaxed">{vehicle.description}</p>
          )}

          <div className="border border-neutral-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Reserve This Vehicle</h2>
            <BookingForm vehicle={vehicle} />
          </div>
        </div>
      </div>
    </div>
  );
}
