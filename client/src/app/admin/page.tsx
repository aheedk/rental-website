'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Stats {
  vehicles: number;
  reservations: number;
  pending: number;
  confirmed: number;
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/vehicles'),
      api.get('/reservations'),
    ])
      .then(([vehiclesRes, reservationsRes]) => {
        const reservations = reservationsRes.data.data.reservations;
        setStats({
          vehicles:     vehiclesRes.data.results,
          reservations: reservationsRes.data.results,
          pending:      reservations.filter((r: any) => r.status === 'pending').length,
          confirmed:    reservations.filter((r: any) => r.status === 'confirmed').length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Vehicles',     value: stats.vehicles },
        { label: 'Total Reservations', value: stats.reservations },
        { label: 'Pending',            value: stats.pending },
        { label: 'Confirmed',          value: stats.confirmed },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {loading ? (
        <p className="text-neutral-500">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(({ label, value }) => (
            <div key={label} className="bg-white border border-neutral-200 rounded-xl p-5">
              <p className="text-xs text-neutral-400 uppercase tracking-wider">{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
