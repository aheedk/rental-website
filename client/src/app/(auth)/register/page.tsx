'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

const inputClass =
  'w-full bg-dark-300 border border-dark-500 text-white text-sm font-sans px-4 py-3 focus:outline-none focus:border-gold/40 placeholder:text-neutral-700 transition-colors';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/vehicles');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-16 flex items-center justify-center px-4 py-12"
         style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a1200 0%, #0D0D0D 70%)' }}>
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-gold text-3xl">♛</span>
          <h1 className="text-3xl font-serif text-white mt-3">Create Account</h1>
          <p className="text-neutral-500 font-sans text-sm mt-2 tracking-wide">
            Start renting luxury vehicles today
          </p>
        </div>

        <div className="luxury-card p-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent -mt-8 mb-8" />

          {error && (
            <div className="border border-red-900/50 bg-red-950/30 text-red-400 text-xs font-sans tracking-wide px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-sans tracking-[0.25em] uppercase text-neutral-500 mb-2">
                  First Name
                </label>
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  className={inputClass}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-[10px] font-sans tracking-[0.25em] uppercase text-neutral-500 mb-2">
                  Last Name
                </label>
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  className={inputClass}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-sans tracking-[0.25em] uppercase text-neutral-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans tracking-[0.25em] uppercase text-neutral-500 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className={inputClass}
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans tracking-[0.25em] uppercase text-neutral-500 mb-2">
                Phone <span className="text-neutral-700">(Optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass}
                placeholder="+1 (305) 000-0000"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="gold" loading={loading} className="w-full" size="lg">
                Create Account
              </Button>
            </div>
          </form>

          <div className="h-px bg-gold/10 mt-6 mb-5" />

          <p className="text-center text-xs font-sans text-neutral-600 tracking-wide">
            Already have an account?{' '}
            <Link href="/login" className="text-gold hover:text-gold-light transition-colors duration-200">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
