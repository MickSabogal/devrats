"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import AvatarUpload from "@/components/profile/AvatarUpload";
import SettingsForm from "@/components/profile/SettingsForm";
import DeleteAccountModal from "@/components/profile/DeleteAccountModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col min-h-screen">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-white text-xl font-bold">Settings</h2>
          <div className="w-10"></div>
        </div>

        <div className="px-6 pb-6 space-y-6 flex-1 flex flex-col">
          <div>
            <h2 className="text-white text-sm font-semibold mb-4">General Settings</h2>
            <AvatarUpload user={user} onUpdate={fetchUserData} />
          </div>

          <SettingsForm user={user} onUpdate={fetchUserData} />

          <div className="border border-red-600 rounded-lg p-4 mt-auto">
            <h3 className="text-white text-base font-semibold mb-3">Danger Zone</h3>
            
            <h4 className="text-white text-sm font-medium mb-1">Delete this account</h4>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Once you delete an account, there is no going back. Please be certain.
            </p>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full px-4 py-2 bg-transparent border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition font-medium"
            >
              Delete account
            </button>
          </div>
        </div>

        {showDeleteModal && (
          <DeleteAccountModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
            }}
          />
        )}
      </div>
    </div>
  );
}