import Link from "next/link";
import { auth } from "../auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-5xl">
        <div className="mb-20 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">task<span className="text-lime-300">flow</span></Link>
          <Link href={session ? "/dashboard" : "/login"} className="rounded-full border border-white/15 px-5 py-2 text-sm hover:bg-white/10">
            {session ? "Open dashboard" : "Sign in"}
          </Link>
        </div>
        <p className="mb-5 text-sm font-semibold uppercase tracking-[.25em] text-lime-300">Make room for good work</p>
        <h1 className="max-w-4xl text-6xl font-semibold leading-[1.02] tracking-[-.06em] sm:text-8xl">Your work,<br />moving forward.</h1>
        <div className="mt-8 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <p className="max-w-lg text-lg leading-8 text-white/60">A calm, focused space to capture tasks, choose what matters, and see progress at a glance.</p>
          <Link href={session ? "/dashboard" : "/register"} className="w-fit rounded-full bg-lime-300 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-lime-200">
            {session ? "Go to your tasks" : "Get started →"}
          </Link>
        </div>
        <div className="mt-20 grid gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:grid-cols-3">
          <p>01 / Private by default</p><p>02 / Move tasks across stages</p><p>03 / Built for daily focus</p>
        </div>
      </section>
    </main>
  );
}
