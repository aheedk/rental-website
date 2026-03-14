import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-neutral-400 uppercase tracking-widest text-sm mb-4">
            Premium Luxury Car Rental
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Drive Something <br />
            <span className="text-neutral-400">Extraordinary</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-10">
            Access an exclusive fleet of the world&apos;s finest luxury vehicles. Reserved just for you.
          </p>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-3 rounded-md hover:bg-neutral-100 transition-colors"
          >
            Browse Fleet
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { title: 'Curated Fleet', desc: 'Hand-selected supercars, SUVs, and luxury sedans.' },
            { title: 'Instant Booking', desc: 'Reserve online in minutes. Confirmation same day.' },
            { title: 'White Glove Service', desc: 'Dedicated support for your entire rental period.' },
          ].map(({ title, desc }) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-neutral-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
