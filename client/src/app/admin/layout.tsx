'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/login');
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) return <Spinner className="py-40" />;

  const navItems = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/vehicles', label: 'Vehicles' },
    { href: '/admin/reservations', label: 'Reservations' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-white border-r border-neutral-200 py-8 px-4">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4 px-2">
          Admin
        </p>
        <nav className="space-y-1">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === href
                  ? 'bg-black text-white font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
