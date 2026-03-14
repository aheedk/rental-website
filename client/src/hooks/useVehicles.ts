'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Vehicle, VehicleFilters } from '@/types/vehicle';

export function useVehicles(filters: VehicleFilters = {}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category)             params.set('category', filters.category);
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters.available !== undefined) params.set('available', String(filters.available));

    setLoading(true);
    api
      .get(`/vehicles?${params.toString()}`)
      .then((res) => setVehicles(res.data.data.vehicles))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load vehicles'))
      .finally(() => setLoading(false));
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.available]);

  return { vehicles, loading, error };
}

export function useVehicle(id: string) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/vehicles/${id}`)
      .then((res) => setVehicle(res.data.data.vehicle))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load vehicle'))
      .finally(() => setLoading(false));
  }, [id]);

  return { vehicle, loading, error };
}
