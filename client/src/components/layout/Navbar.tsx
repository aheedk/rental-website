'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gold/10"
            style={{ backgroundColor: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(12px)' }}>

      {/* Gold top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-gold text-lg">♛</span>
          <span className="font-serif text-xl font-bold tracking-wide text-white group-hover:text-gold transition-colors duration-300">
            LUXE<span className="text-gold">DRIVE</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/vehicles" className="nav-link">
            Fleet
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="nav-link">
                  Dashboard
                </Link>
              )}
              <Link href="/reservations" className="nav-link">
                My Bookings
              </Link>
              <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gold/20">
                <span className="text-gold text-sm font-sans">{user.firstName}</span>
                <button
                  onClick={logout}
                  className="text-xs font-sans tracking-widest uppercase text-neutral-500 hover:text-gold transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">
                Sign In
              </Link>
              <Link href="/register" className="btn-gold text-xs px-5 py-2">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gold p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gold/10 bg-dark-100 px-4 py-4 flex flex-col gap-4">
          <Link href="/"           onClick={() => setMobileOpen(false)} className="mobile-nav-link">Home</Link>
          <Link href="/vehicles"   onClick={() => setMobileOpen(false)} className="mobile-nav-link">Fleet</Link>
          {user ? (
            <>
              {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Dashboard</Link>}
              <Link href="/reservations" onClick={() => setMobileOpen(false)} className="mobile-nav-link">My Bookings</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }}
                      className="text-left text-sm text-neutral-500 hover:text-gold transition-colors font-sans">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login"    onClick={() => setMobileOpen(false)} className="mobile-nav-link">Sign In</Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-gold text-center">Get Started</Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .nav-link {
          font-family: var(--font-inter), sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a3a3a3;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #C9A84C; }
        .mobile-nav-link {
          font-family: var(--font-inter), sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a3a3a3;
        }
        .mobile-nav-link:hover { color: #C9A84C; }
      `}</style>
    </header>
  );
}
