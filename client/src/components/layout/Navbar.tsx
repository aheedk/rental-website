'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-black text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          LUXE<span className="text-neutral-400">DRIVE</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/vehicles" className="text-sm text-neutral-300 hover:text-white transition-colors">
            Fleet
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-sm text-neutral-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              )}
              <Link href="/reservations" className="text-sm text-neutral-300 hover:text-white transition-colors">
                My Bookings
              </Link>
              <button
                onClick={logout}
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                Sign Out
              </button>
              <span className="text-sm font-medium">
                {user.firstName}
              </span>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-neutral-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
