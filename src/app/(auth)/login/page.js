"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b111c] p-6">
      <div className="w-full max-w-md bg-[#0b111c] rounded-2xl p-12">
        <div className="flex justify-center mb-6">
          <img
            src="/images/logo_devrats.png"
            alt="DevRats Icon"
            className="w-55 h-55 rounded-full object-cover"
          />
        </div>

        {registered && (
          <div className="mb-4 p-3 text-center text-green-200 bg-green-800/30 rounded">
            Account created! Please log in.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 text-center text-red-400 bg-red-800/30 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="h-[72px]"></div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold uppercase tracking-wide hover:shadow-lg hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-red-600 font-semibold hover:text-pink-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}