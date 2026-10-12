"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        redirectTo: "/dashboard",
      });
      if (result?.error) setError("Email or password is incorrect.");
      else window.location.assign("/dashboard");
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <label className="block text-sm">Email<input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-lime-300" type="email" name="email" autoComplete="email" required /></label>
      <label className="block text-sm">Password<input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-lime-300" type="password" name="password" autoComplete="current-password" required /></label>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      <button disabled={pending} className="w-full rounded-xl bg-lime-300 px-4 py-3 font-semibold text-zinc-950 disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
