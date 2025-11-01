"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Github } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const errorParam = searchParams.get("error");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);

  useEffect(() => {
    if (errorParam) {
      const errorMessages = {
        OAuthSignin: "Error connecting to OAuth provider. Please try again.",
        OAuthCallback: "Error during authentication. Please try again.",
        Configuration: "Server configuration error. Please contact support.",
        AccessDenied: "Access denied. Please check your permissions.",
        Verification: "Email verification failed. Please try again.",
      };

      setError(
        errorMessages[errorParam] || "Authentication error. Please try again."
      );

      setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }, 100);
    }
  }, [errorParam]);

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
        router.push("/dashboard/home");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setError("");
    setOauthLoading(provider);
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard/home",
        redirect: true,
      });
    } catch (error) {
      setError("OAuth login failed. Please try again.");
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-6">
      <div className="w-full max-w-md bg-primary rounded-2xl p-12">
        <div className="flex justify-center mb-8">
          <img
            src="/images/logo_devrats.png"
            alt="DevRats Icon"
            className="w-55 h-55 rounded-full object-cover animate-float"
          />
        </div>
        {registered && (
          <Alert type="success">Account created! Please log in.</Alert>
        )}
        {error && <Alert type="error">{error}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-5">
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
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-400 text-sm">OR LOGIN WITH</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuthSignIn("github")}
            disabled={oauthLoading === "github"}
            className="py-3 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition disabled:opacity-50"
          >
            {oauthLoading === "github" ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Github size={20} />
                GitHub
              </>
            )}
          </button>

          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={oauthLoading === "google"}
            className="py-3 px-4 rounded-lg bg-white text-gray-900 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition disabled:opacity-50"
          >
            {oauthLoading === "google" ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    fill="#4285F4"
                    d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
                  />
                  <path
                    fill="#34A853"
                    d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
                  />
                  <path
                    fill="#EA4335"
                    d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
                  />
                </svg>
                Google
              </>
            )}
          </button>
        </div>
        <div className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-red-600 font-semibold hover:text-pink-500"
          >
            Sign up
          </Link>
        </div>
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
