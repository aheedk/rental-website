'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { Vehicle } from '@/types/vehicle';
import { formatCurrency, capitalize } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';

const EMPTY_FORM = {
  make: '', model: '', year: new Date().getFullYear(), category: 'sports',
  transmission: 'automatic', seats: 2, dailyRate: '', description: '', isAvailable: true,
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles]   = useState<Vehicle[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Vehicle | null>(null);
  const [form, setForm]           = useState<any>(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchVehicles = useCallback(() => {
    setLoading(true);
    api.get('/vehicles')
      .then((res) => setVehicles(res.data.data.vehicles))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit   = (v: Vehicle) => {
    setEditing(v);
    setForm({ make: v.make, model: v.model, year: v.year, category: v.category,
      transmission: v.transmission, seats: v.seats, dailyRate: v.dailyRate,
      description: v.description ?? '', isAvailable: v.isAvailable });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, dailyRate: Number(form.dailyRate), year: Number(form.year), seats: Number(form.seats) };

      let vehicleId: string;
      if (editing) {
        await api.patch(`/vehicles/${editing.id}`, payload);
        vehicleId = editing.id;
      } else {
        const res = await api.post('/vehicles', payload);
        vehicleId = res.data.data.vehicle.id;
      }

      // Upload image if selected
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        fd.append('isPrimary', 'true');
        await api.post(`/uploads/vehicles/${vehicleId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setImageFile(null);
      }

      setModalOpen(false);
      fetchVehicles();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vehicle? This cannot be undone.')) return;
    await api.delete(`/vehicles/${id}`);
    fetchVehicles();
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
        <Button onClick={openCreate}>Add Vehicle</Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50 text-left">
            <tr>
              {['Vehicle', 'Category', 'Daily Rate', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium text-neutral-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {vehicles.map((v) => {
              const img = v.images?.find((i) => i.isPrimary) ?? v.images?.[0];
              return (
                <tr key={v.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-8 rounded overflow-hidden bg-neutral-100 shrink-0">
                        {img && <Image src={img.url} alt="" fill className="object-cover" />}
                      </div>
                      <span className="font-medium text-gray-900">{v.year} {v.make} {v.model}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 capitalize">{v.category}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(v.dailyRate)}/day</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${v.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {v.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(v)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(v.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Vehicle' : 'Add Vehicle'}>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {[
            { label: 'Make', field: 'make', type: 'text' },
            { label: 'Model', field: 'model', type: 'text' },
            { label: 'Year', field: 'year', type: 'number' },
            { label: 'Daily Rate ($)', field: 'dailyRate', type: 'number' },
            { label: 'Seats', field: 'seats', type: 'number' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-neutral-500 mb-1">{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={(e) => setForm((p: any) => ({ ...p, [field]: e.target.value }))}
                className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p: any) => ({ ...p, category: e.target.value }))}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {['sports', 'suv', 'sedan', 'convertible', 'coupe'].map((c) => (
                <option key={c} value={c}>{capitalize(c)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Transmission</label>
            <select
              value={form.transmission}
              onChange={(e) => setForm((p: any) => ({ ...p, transmission: e.target.value }))}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p: any) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={form.isAvailable}
              onChange={(e) => setForm((p: any) => ({ ...p, isAvailable: e.target.checked }))}
              className="h-4 w-4 rounded"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-700">Available for booking</label>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              {editing ? 'Replace Primary Image' : 'Primary Image'}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-neutral-600"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-neutral-100">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button loading={saving} onClick={handleSave}>
            {editing ? 'Save Changes' : 'Create Vehicle'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
