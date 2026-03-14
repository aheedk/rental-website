export type VehicleCategory = 'sports' | 'suv' | 'sedan' | 'convertible' | 'coupe';
export type TransmissionType = 'automatic' | 'manual';

export interface VehicleImage {
  id: string;
  vehicleId: string;
  s3Key: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: VehicleCategory;
  transmission: TransmissionType;
  seats: number;
  dailyRate: number;
  description?: string;
  isAvailable: boolean;
  images: VehicleImage[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  category?: VehicleCategory;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}
