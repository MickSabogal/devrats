"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError(err.message);
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

        {error && (
          <div className="mb-4 p-3 text-center text-red-400 bg-red-800/30 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-400 uppercase mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-red-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold uppercase tracking-wide hover:shadow-lg hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-red-600 font-semibold hover:text-pink-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
