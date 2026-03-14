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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Fleet</h1>
        <p className="text-neutral-500 mt-1">
          {loading ? 'Loading...' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} available`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <VehicleFilters filters={filters} onChange={setFilters} />
        </aside>

        <div className="flex-1">
          <VehicleGrid vehicles={vehicles} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
