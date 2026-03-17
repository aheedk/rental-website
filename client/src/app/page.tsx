import Link from 'next/link';

const BRANDS = [
  { name: 'Lamborghini', tagline: 'Raging Bull' },
  { name: 'Rolls-Royce', tagline: 'Spirit of Ecstasy' },
  { name: 'Ferrari',     tagline: 'Prancing Horse' },
];

const FEATURES = [
  {
    icon: '◆',
    title: 'Curated Fleet',
    desc: 'Hand-selected supercars, SUVs, and luxury sedans from the world\'s most prestigious marques.',
  },
  {
    icon: '◆',
    title: 'Instant Booking',
    desc: 'Reserve your vehicle online in minutes. Same-day confirmation guaranteed.',
  },
  {
    icon: '◆',
    title: 'White Glove Service',
    desc: 'Dedicated concierge support before, during, and after your rental experience.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-dark -mt-16">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, #1a1400 0%, #0D0D0D 70%)',
        }}
      >
        {/* Background texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #C9A84C 0px, #C9A84C 1px,
              transparent 1px, transparent 40px
            )`,
          }}
        />

        {/* Top decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Crown ornament */}
          <div className="text-gold text-4xl mb-6 opacity-80">♛</div>

          {/* Label */}
          <p className="section-label mb-6 tracking-[0.4em]">
            Exotic &amp; Luxury Car Rental
          </p>

          {/* Divider */}
          <div className="gold-divider max-w-xs mx-auto">
            <span className="text-gold text-xs">✦</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-7xl font-serif font-bold mt-6 mb-4 leading-tight">
            <span className="text-white">Drive</span>{' '}
            <span className="text-gold-gradient">Something</span>
            <br />
            <span className="text-white">Extraordinary</span>
          </h1>

          <p className="text-neutral-400 text-base sm:text-lg max-w-lg mx-auto mt-6 mb-10 leading-relaxed font-sans">
            Welcome to LuxeDrive. Your premier destination for exotic and luxury vehicle
            rentals — featuring the latest models from Lamborghini, Ferrari, Rolls-Royce,
            Bentley, McLaren, and more.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/vehicles" className="btn-gold-filled">
              View All Vehicles
            </Link>
            <Link href="/register" className="btn-gold">
              Get Started
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/40">
          <span className="text-xs font-sans tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent" />
        </div>
      </section>

      {/* ── Brand Showcase ───────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-gold/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Our Fleet</p>
            <div className="gold-divider max-w-xs mx-auto">
              <span className="text-gold text-xs">✦</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif text-white mt-6">
              Iconic Brands
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gold/10">
            {BRANDS.map(({ name, tagline }) => (
              <div
                key={name}
                className="bg-dark group relative flex flex-col items-center justify-center py-16 px-8 text-center
                           transition-all duration-500 hover:bg-gold/5 cursor-pointer overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ background: 'radial-gradient(ellipse at 50% 80%, #C9A84C08 0%, transparent 70%)' }} />

                {/* Car silhouette placeholder */}
                <div className="relative mb-6 w-full max-w-[220px] h-24 flex items-center justify-center">
                  <svg viewBox="0 0 200 80" className="w-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" fill="none">
                    <path
                      d="M20 55 L30 35 Q50 20 80 18 L120 18 Q150 20 170 35 L180 55 L185 58 L185 65 L15 65 L15 58 Z"
                      fill="#C9A84C"
                      opacity="0.15"
                      stroke="#C9A84C"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                    />
                    <ellipse cx="50" cy="65" rx="15" ry="8" fill="#0D0D0D" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.5"/>
                    <ellipse cx="150" cy="65" rx="15" ry="8" fill="#0D0D0D" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.5"/>
                    <ellipse cx="50" cy="65" rx="8" ry="4" fill="#C9A84C" opacity="0.2"/>
                    <ellipse cx="150" cy="65" rx="8" ry="4" fill="#C9A84C" opacity="0.2"/>
                  </svg>
                </div>

                <p className="text-gold/50 text-xs font-sans tracking-[0.3em] uppercase mb-2">
                  {tagline}
                </p>
                <h3 className="text-xl font-serif text-white group-hover:text-gold transition-colors duration-300">
                  {name}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/vehicles" className="btn-gold">
              Explore Full Fleet
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-gold/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Why Choose Us</p>
            <div className="gold-divider max-w-xs mx-auto">
              <span className="text-gold text-xs">✦</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif text-white mt-6">
              The LuxeDrive Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="luxury-card p-8 text-center group"
              >
                <div className="text-gold text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <h3 className="text-lg font-serif text-white mb-3">{title}</h3>
                <p className="text-neutral-500 text-sm font-sans leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-gold/10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '50+',   label: 'Luxury Vehicles' },
            { value: '1,200+', label: 'Happy Clients' },
            { value: '15+',   label: 'Premium Brands' },
            { value: '24/7',  label: 'Concierge Support' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl sm:text-4xl font-serif text-gold-gradient mb-2">{value}</p>
              <p className="text-neutral-500 text-xs font-sans tracking-widest uppercase">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-gold/10">
        <div
          className="max-w-4xl mx-auto text-center rounded-none sm:rounded-sm py-16 px-8 relative overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a1200 0%, #0D0D0D 100%)' }}
        >
          <div className="absolute inset-0 border border-gold/20" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          <div className="relative z-10">
            <p className="section-label mb-4">Ready to Experience Luxury?</p>
            <div className="gold-divider max-w-xs mx-auto">
              <span className="text-gold text-xs">✦</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif text-white mt-6 mb-4">
              Reserve Your Dream Car
            </h2>
            <p className="text-neutral-400 font-sans text-sm max-w-md mx-auto mb-10 leading-relaxed">
              Browse our curated fleet and secure your reservation in minutes.
              Delivery and pickup available throughout the city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vehicles" className="btn-gold-filled">
                Browse Fleet
              </Link>
              <Link href="/register" className="btn-gold">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
