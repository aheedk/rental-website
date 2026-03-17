import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/types/vehicle';
import { formatCurrency, capitalize } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const primaryImage = vehicle.images?.find((img) => img.isPrimary) ?? vehicle.images?.[0];

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="group block">
      <div className="luxury-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(201,168,76,0.12)]">

        {/* Image */}
        <div className="relative aspect-[16/9] bg-dark-300 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg className="h-16 w-16 text-gold/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-200/80 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-gold border border-gold/40 bg-dark/80 px-2.5 py-1">
              {capitalize(vehicle.category)}
            </span>
          </div>

          {/* Unavailable overlay */}
          {!vehicle.isAvailable && (
            <div className="absolute inset-0 bg-dark/70 flex items-center justify-center backdrop-blur-sm">
              <span className="text-xs font-sans tracking-[0.25em] uppercase text-neutral-400 border border-neutral-600 px-4 py-2">
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-base text-white truncate group-hover:text-gold transition-colors duration-200">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] font-sans tracking-wider text-neutral-600 uppercase">
                <span>{vehicle.seats} seats</span>
                <span className="text-gold/30">|</span>
                <span>{capitalize(vehicle.transmission)}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-serif text-gold-gradient font-bold">
                {formatCurrency(vehicle.dailyRate)}
              </p>
              <p className="text-[10px] font-sans tracking-widest uppercase text-neutral-600">per day</p>
            </div>
          </div>

          {/* View detail hint */}
          <div className="mt-4 pt-4 border-t border-dark-400 flex items-center justify-between">
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-neutral-600 group-hover:text-gold/60 transition-colors duration-200">
              View Details
            </span>
            <svg className="h-3.5 w-3.5 text-neutral-700 group-hover:text-gold/60 group-hover:translate-x-1 transition-all duration-200"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
