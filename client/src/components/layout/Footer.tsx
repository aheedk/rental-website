export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} LuxeDrive. All rights reserved.
        </p>
        <p className="text-sm">
          Premium luxury car rental.
        </p>
      </div>
    </footer>
  );
}
