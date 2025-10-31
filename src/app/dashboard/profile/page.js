"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import ActivityCalendar from "@/components/profile/ActivityCalendar";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileHeader from "@/components/profile/ProfileHeader";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user) {
      fetchUserData();
    }
  }, [session, status]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/users/me");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Divide o nome em palavras
  const getNameLines = (name) => {
    const words = name?.split(" ") || [];
    if (words.length === 1) return [words[0], ""];
    const midPoint = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, midPoint).join(" ");
    const secondLine = words.slice(midPoint).join(" ");
    return [firstLine, secondLine];
  };

  const [firstName, lastName] = getNameLines(user?.name);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-600 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <style jsx>{`
        @keyframes pendulum {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        .pendulum-swing {
          transform-origin: top center;
          animation: pendulum 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-md mx-auto">
        <div className="relative bg-secondary rounded-b-3xl overflow-hidden pb-20">
          <img
            src="/images/cheese.png"
            alt="Background pattern"
            className="absolute top-0 right-0 w-60 h-60 object-contain pointer-events-none select-none pendulum-swing translate-x-2"
          />

          <div className="relative z-10 flex items-center justify-between p-4">
            <button
              onClick={() => router.back()}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-white text-xl font-bold">My Profile</h2>
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Settings size={24} />
            </button>
          </div>

          <div className="relative z-10 px-6 mt-2 text-left">
            <p className="text-white/80 text-sm mb-6">Welcome back!</p>
            <div className="w-24">
              <h1 className="text-white text-xl font-bold leading-tight">
                {firstName}
              </h1>
              {lastName && (
                <h1 className="text-white text-xl font-bold leading-tight">
                  {lastName}
                </h1>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 -mt-12 relative z-20">
          <div className="flex gap-4 mb-8">
            <ProfileHeader user={user} />

            <div className="flex-1 flex items-end pb-3">
              <ProfileStats user={user} />
            </div>
          </div>

          <div className="-mt-4">
            <ActivityCalendar
              userId={user._id}
              lastPostDate={user.lastPostDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
