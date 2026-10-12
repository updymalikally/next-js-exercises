"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const credentials = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not create the account.");
        return;
      }
      const login = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
        redirectTo: "/dashboard",
      });
      if (login?.error) setError("Account created. Please sign in.");
      else window.location.assign("/dashboard");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <label className="block text-sm">Name<input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-lime-300" type="text" name="name" autoComplete="name" maxLength={80} required /></label>
      <label className="block text-sm">Email<input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-lime-300" type="email" name="email" autoComplete="email" required /></label>
      <label className="block text-sm">Password<input className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-lime-300" type="password" name="password" autoComplete="new-password" minLength={8} required /></label>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      <button disabled={pending} className="w-full rounded-xl bg-lime-300 px-4 py-3 font-semibold text-zinc-950 disabled:opacity-60">{pending ? "Creating account…" : "Create account"}</button>
    </form>
  );
}
