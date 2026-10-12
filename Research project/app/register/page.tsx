import Link from "next/link";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import RegisterForm from "../components/RegisterForm";

export default async function RegisterPage() {
  if (await auth()) redirect("/dashboard");
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="font-bold">task<span className="text-lime-300">flow</span></Link>
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[.04] p-8">
          <p className="text-sm text-lime-300">Start with a clear slate</p><h1 className="mt-2 text-3xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-white/55">Your tasks stay private to your account.</p>
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-white/55">Already have an account? <Link className="text-lime-300 hover:underline" href="/login">Sign in</Link></p>
        </div>
      </div>
    </main>
  );
}
