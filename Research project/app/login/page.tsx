import Link from "next/link";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import LoginForm from "../components/LoginForm";

export default async function LoginPage() {
  if (await auth()) redirect("/dashboard");
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="font-bold">task<span className="text-lime-300">flow</span></Link>
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.04] p-8">
          <p className="text-sm text-lime-300">Welcome back</p><h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-white/55">Pick up where you left off.</p>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-white/55">New to TaskFlow? <Link className="text-lime-300 hover:underline" href="/register">Create an account</Link></p>
        </div>
      </div>
    </main>
  );
}
