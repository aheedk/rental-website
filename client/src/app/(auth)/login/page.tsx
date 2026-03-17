'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(user.role === 'admin' ? '/admin' : '/vehicles');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-16 flex items-center justify-center px-4"
         style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a1200 0%, #0D0D0D 70%)' }}>
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-gold text-3xl">♛</span>
          <h1 className="text-3xl font-serif text-white mt-3">Welcome Back</h1>
          <p className="text-neutral-500 font-sans text-sm mt-2 tracking-wide">
            Sign in to your account
          </p>
        </div>

        <div className="luxury-card p-8">
          {/* Gold top accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent -mt-8 mb-8" />

          {error && (
            <div className="border border-red-900/50 bg-red-950/30 text-red-400 text-xs font-sans tracking-wide px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-sans tracking-[0.25em] uppercase text-neutral-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-300 border border-dark-500 text-white text-sm font-sans px-4 py-3
                           focus:outline-none focus:border-gold/40 placeholder:text-neutral-700 transition-colors"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-300 border border-dark-500 text-white text-sm font-sans px-4 py-3
                           focus:outline-none focus:border-gold/40 placeholder:text-neutral-700 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="gold" loading={loading} className="w-full" size="lg">
                Sign In
              </Button>
            </div>
          </form>

          <div className="h-px bg-gold/10 mt-6 mb-5" />

          <p className="text-center text-xs font-sans text-neutral-600 tracking-wide">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-gold hover:text-gold-light transition-colors duration-200">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
