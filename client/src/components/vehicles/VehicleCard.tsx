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
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-neutral-100">
        <div className="relative aspect-[16/9] bg-neutral-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-300">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {!vehicle.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/80 px-3 py-1 rounded-full">
                Unavailable
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">{capitalize(vehicle.category)}</p>
              <h3 className="font-semibold text-gray-900 mt-0.5">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-gray-900">{formatCurrency(vehicle.dailyRate)}</p>
              <p className="text-xs text-neutral-500">per day</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
            <span>{vehicle.seats} seats</span>
            <span>&bull;</span>
            <span>{capitalize(vehicle.transmission)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
