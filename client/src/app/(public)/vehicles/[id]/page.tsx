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
      <div className="min-h-screen bg-dark pt-16 flex items-center justify-center">
        <p className="text-red-500 font-sans text-sm">{error ?? 'Vehicle not found.'}</p>
      </div>
    );
  }

  const primaryImage = vehicle.images?.find((img) => img.isPrimary) ?? vehicle.images?.[0];
  const otherImages  = vehicle.images?.filter((img) => img.id !== primaryImage?.id) ?? [];

  const specs = [
    { label: 'Year',         value: vehicle.year },
    { label: 'Category',     value: capitalize(vehicle.category) },
    { label: 'Seats',        value: vehicle.seats },
    { label: 'Transmission', value: capitalize(vehicle.transmission) },
  ];

  return (
    <div className="min-h-screen bg-dark -mt-16 pt-16">
      {/* Breadcrumb-style header */}
      <div className="border-b border-gold/10 py-8 px-4"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a1200 0%, #0D0D0D 80%)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-1">{capitalize(vehicle.category)}</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-white">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Images ────────────────────── */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] overflow-hidden bg-dark-300 border border-dark-400">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="h-20 w-20 text-gold/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.slice(0, 4).map((img) => (
                  <div key={img.id} className="relative aspect-square overflow-hidden bg-dark-300 border border-dark-400 hover:border-gold/30 transition-colors cursor-pointer">
                    <Image src={img.url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Info + Booking ────────────── */}
          <div className="space-y-8">
            {/* Price */}
            <div>
              <div className="flex items-end gap-3 mb-4">
                <p className="text-4xl font-serif text-gold-gradient font-bold">
                  {formatCurrency(vehicle.dailyRate)}
                </p>
                <span className="text-neutral-500 font-sans text-sm mb-1">/ day</span>
              </div>

              {!vehicle.isAvailable && (
                <span className="inline-block text-[10px] font-sans tracking-widest uppercase border border-neutral-700 text-neutral-500 px-3 py-1">
                  Currently Unavailable
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-gold/20 to-transparent" />

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {specs.map(({ label, value }) => (
                <div key={label} className="luxury-card px-4 py-3">
                  <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-neutral-600 mb-1">{label}</p>
                  <p className="text-sm font-sans text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {vehicle.description && (
              <p className="text-neutral-400 font-sans text-sm leading-relaxed border-l-2 border-gold/20 pl-4">
                {vehicle.description}
              </p>
            )}

            {/* Booking form */}
            <div className="luxury-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-gold text-xs">◆</span>
                <h2 className="text-sm font-sans tracking-[0.25em] uppercase text-white">Reserve This Vehicle</h2>
              </div>
              <BookingForm vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
