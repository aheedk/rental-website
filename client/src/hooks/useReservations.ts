'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Reservation, CreateReservationPayload } from '@/types/reservation';

export function useMyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    api
      .get('/reservations/my')
      .then((res) => setReservations(res.data.data.reservations))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load reservations'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const cancel = useCallback(
    async (id: string) => {
      await api.patch(`/reservations/${id}/cancel`);
      fetch();
    },
    [fetch]
  );

  return { reservations, loading, error, refetch: fetch, cancel };
}

export function useCreateReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const create = useCallback(async (payload: CreateReservationPayload): Promise<Reservation> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/reservations', payload);
      return res.data.data.reservation;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Booking failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useCheckAvailability() {
  const check = useCallback(
    async (vehicleId: string, startDate: string, endDate: string): Promise<boolean> => {
      const params = new URLSearchParams({ vehicleId, startDate, endDate });
      const res = await api.get(`/reservations/availability?${params.toString()}`);
      return res.data.data.isAvailable;
    },
    []
  );

  return { check };
}
