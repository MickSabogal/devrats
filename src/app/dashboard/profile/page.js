"use client";
// src/app/dashboard/profile/page.js

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ActivityCalendar from "@/components/profile/ActivityCalendar";

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

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-600 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="text-white p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="text-white p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <Settings size={24} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          <ProfileHeader user={user} />
          <ProfileStats user={user} />
          <ActivityCalendar userId={user._id} lastPostDate={user.lastPostDate} />
        </div>
      </div>
    </div>
  );
}