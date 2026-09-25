import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg-light text-primary-light flex flex-col items-center justify-center p-8 text-center font-sans">
      <div className="max-w-md space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-secondary-light">
          Protocol 404 // Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Page Not Located</h1>
        <p className="text-sm text-secondary-light leading-relaxed">
          The requested route does not exist or has been relocated within the studio index.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-light text-white text-xs font-mono tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
