import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/10 bg-dark">

      {/* Gold top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gold text-lg">♛</span>
              <span className="font-serif text-xl font-bold text-white">
                LUXE<span className="text-gold">DRIVE</span>
              </span>
            </div>
            <p className="text-neutral-500 text-sm font-sans leading-relaxed max-w-xs">
              Miami&apos;s premier destination for exotic and luxury vehicle rentals.
              Experience the world&apos;s finest automobiles.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Facebook"
                 className="text-neutral-600 hover:text-gold transition-colors duration-200 text-sm font-sans tracking-wider">
                FB
              </a>
              <a href="#" aria-label="Instagram"
                 className="text-neutral-600 hover:text-gold transition-colors duration-200 text-sm font-sans tracking-wider">
                IG
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-sans tracking-[0.3em] uppercase text-gold mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home',       href: '/' },
                { label: 'Fleet',      href: '/vehicles' },
                { label: 'My Bookings', href: '/reservations' },
                { label: 'Sign In',    href: '/login' },
                { label: 'Register',   href: '/register' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-neutral-500 text-sm font-sans hover:text-gold transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-sans tracking-[0.3em] uppercase text-gold mb-6">Contact</h4>
            <ul className="space-y-3 text-neutral-500 text-sm font-sans">
              <li>📞 305-555-8899</li>
              <li>✉️ reservations@luxedrive.com</li>
              <li className="pt-2 text-xs leading-relaxed">
                1000 Brickell Ave, Suite 200<br />
                Miami, FL 33131
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-neutral-600 text-xs font-sans">
            &copy; {year} LuxeDrive. All rights reserved.
          </p>
          <p className="text-neutral-600 text-xs font-sans tracking-widest uppercase">
            Premium Luxury Car Rental
          </p>
        </div>
      </div>
    </footer>
  );
}
