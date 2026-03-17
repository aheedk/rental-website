'use client';

import { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { VehicleFilters as Filters } from '@/types/vehicle';
import VehicleGrid from '@/components/vehicles/VehicleGrid';
import VehicleFilters from '@/components/vehicles/VehicleFilters';

export default function VehiclesPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { vehicles, loading, error } = useVehicles(filters);

  return (
    <div className="min-h-screen bg-dark -mt-16 pt-16">
      {/* Page header */}
      <div className="border-b border-gold/10 py-16 px-4 text-center"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a1200 0%, #0D0D0D 70%)' }}>
        <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-12" />
        <p className="section-label mb-4">LuxeDrive Collection</p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold text-xs">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-white mt-4">Our Fleet</h1>
        <p className="text-neutral-500 font-sans text-sm mt-3">
          {loading ? 'Loading...' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} available`}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <VehicleFilters filters={filters} onChange={setFilters} />
          </aside>
          <div className="flex-1">
            <VehicleGrid vehicles={vehicles} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}
