"use client";
// src/app/dashboard/settings/page.js

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import AvatarUpload from "@/components/profile/AvatarUpload";
import SettingsForm from "@/components/profile/SettingsForm";
import DeleteAccountModal from "@/components/profile/DeleteAccountModal";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        <div className="flex items-center p-4">
          <button
            onClick={() => router.back()}
            className="text-white p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Title */}
        <div className="px-6 mb-6">
          <h1 className="text-white text-2xl font-bold">Settings</h1>
        </div>

        {/* Settings Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* General Section */}
          <div>
            <h2 className="text-white text-sm font-semibold mb-4">General</h2>
            <AvatarUpload user={user} onUpdate={fetchUserData} />
          </div>

          {/* User Info */}
          <SettingsForm user={user} onUpdate={fetchUserData} />

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-3 text-red-500 hover:text-red-400 transition py-3"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="font-medium">Delete account</span>
          </button>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <DeleteAccountModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
              console.log("Delete account");
            }}
          />
        )}
      </div>
    </div>
  );
}