// src/components/auth/LoginForm.jsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function LoginForm() {
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
          <Alert type="success">Account created! Please log in.</Alert>
        )}

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="h-[72px]"></div>

          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <Button type="submit" loading={loading} fullWidth>
            Sign In
          </Button>
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
