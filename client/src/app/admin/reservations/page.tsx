'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Reservation, ReservationStatus } from '@/types/reservation';
import { formatDate, formatCurrency } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const STATUS_ACTIONS: Record<ReservationStatus, { label: string; next: ReservationStatus }[]> = {
  pending:   [{ label: 'Confirm', next: 'confirmed' }, { label: 'Cancel', next: 'cancelled' }],
  confirmed: [{ label: 'Complete', next: 'completed' }, { label: 'Cancel', next: 'cancelled' }],
  cancelled: [],
  completed: [],
};

export default function AdminReservationsPage() {
  const [reservations, setReservations]   = useState<Reservation[]>([]);
  const [loading, setLoading]             = useState(true);
  const [filterStatus, setFilterStatus]   = useState<string>('');
  const [updating, setUpdating]           = useState<string | null>(null);

  const fetchReservations = useCallback(() => {
    const params = filterStatus ? `?status=${filterStatus}` : '';
    setLoading(true);
    api.get(`/reservations${params}`)
      .then((res) => setReservations(res.data.data.reservations))
      .finally(() => setLoading(false));
  }, [filterStatus]);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    setUpdating(id);
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">All statuses</option>
          {['pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50 text-left">
              <tr>
                {['Customer', 'Vehicle', 'Dates', 'Total', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-neutral-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                reservations.map((r) => {
                  const actions = STATUS_ACTIONS[r.status] ?? [];
                  return (
                    <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        {r.customer ? (
                          <div>
                            <p className="font-medium text-gray-900">{r.customer.firstName} {r.customer.lastName}</p>
                            <p className="text-xs text-neutral-400">{r.customer.email}</p>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {r.vehicle ? `${r.vehicle.year} ${r.vehicle.make} ${r.vehicle.model}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        <p>{formatDate(r.startDate)} — {formatDate(r.endDate)}</p>
                        <p className="text-xs text-neutral-400">{r.totalDays} day{r.totalDays !== 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(r.totalCost)}</td>
                      <td className="px-4 py-3"><Badge status={r.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {actions.map(({ label, next }) => (
                            <Button
                              key={next}
                              size="sm"
                              variant={next === 'cancelled' ? 'danger' : 'secondary'}
                              loading={updating === r.id}
                              onClick={() => updateStatus(r.id, next)}
                            >
                              {label}
                            </Button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
