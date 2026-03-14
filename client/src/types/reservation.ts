export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalCost: number;
  status: ReservationStatus;
  notes?: string;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    category: string;
    dailyRate: number;
  };
  vehicleImage?: string;
  customer?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationPayload {
  vehicleId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}
