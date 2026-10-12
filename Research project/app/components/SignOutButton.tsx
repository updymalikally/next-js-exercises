"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return <button onClick={() => signOut({ redirectTo: "/" })} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/10">Sign out</button>;
}
