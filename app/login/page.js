"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   setError("");

   const result = await signIn("credentials", {
     redirect: false, // We still keep this false so we can show custom errors
     email: formData.email,
     password: formData.password,
   });

   if (result?.error) {
     setError("Invalid email or password. Please try again.");
     setLoading(false);
   } else {
     // FIX: Use a hard browser redirect instead of Next.js soft routing.
     // This forces mobile browsers to acknowledge the new auth cookie.
     router.push("/dashboard");
   }
 };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4 font-sans">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-200/50">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-3 text-center text-base text-slate-600 font-medium">
            Log in to see what your neighborhood needs
          </p>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-2xl">
            <p className="text-red-600 text-sm text-center font-bold">
              {error}
            </p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 pl-2">Email address</label>
              <input
                type="email"
                required
                className="relative block w-full rounded-2xl bg-slate-100 border-none px-5 py-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm font-medium transition-all"
                placeholder="hello@neighbor.com"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 pl-2">Password</label>
              <input
                type="password"
                required
                className="relative block w-full rounded-2xl bg-slate-100 border-none px-5 py-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm font-medium transition-all"
                placeholder="Password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-full bg-indigo-600 px-6 py-4 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all hover:shadow-md active:scale-95 mt-8"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Join your neighborhood
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
