"use client";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-6">
      <p className="text-sm uppercase tracking-widest text-lime-300">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-semibold">We couldn’t load your board.</h1>
      <p className="mt-3 text-white/55">Check that MongoDB is running and your connection string is set.</p>
      <button onClick={reset} className="mt-6 rounded-full bg-lime-300 px-5 py-2.5 font-semibold text-zinc-950">Try again</button>
    </main>
  );
}
