import { Vehicle } from '@/types/vehicle';
import VehicleCard from './VehicleCard';
import Spinner from '@/components/ui/Spinner';

interface VehicleGridProps {
  vehicles: Vehicle[];
  loading: boolean;
  error?: string | null;
}

export default function VehicleGrid({ vehicles, loading, error }: VehicleGridProps) {
  if (loading) return <Spinner className="py-20" />;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">No vehicles match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
