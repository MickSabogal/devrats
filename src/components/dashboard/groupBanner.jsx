// src/components/dashboard/groupBanner.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoPencil } from "react-icons/io5";
import Avatar from "./UserAvatar";
import AlertModal from "@/components/ui/AlertModal";

export default function GroupBanner({ user, group, onUpdate }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [leader, setLeader] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (
    title,
    message,
    type = "info",
    autoClose = true,
    showButton = false
  ) => {
    setAlert({ isOpen: true, title, message, type, autoClose, showButton });
  };

  const isAdmin = session?.user?.id === group?.admin?._id?.toString();

  useEffect(() => {
    const fetchRanking = async () => {
      if (!group?._id || !user?._id) return;

      try {
        const response = await fetch(`/api/group/${group._id}/ranking`);
        const data = await response.json();

        if (data.success && data.ranking && data.ranking.length > 0) {
          setLeader(data.ranking[0]);

          const userRank = data.ranking.find(
            (r) => r._id.toString() === user._id.toString()
          );
          setCurrentUserRank(userRank);
        }
      } catch (error) {
        console.error("Error fetching ranking:", error);
      }
    };

    fetchRanking();
  }, [group?._id, user?._id]);

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const response = await fetch(`/api/group/${group._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coverPicture: base64Image }),
        });

        if (response.ok) {
          showAlert(
            "Success",
            "Cover photo updated successfully!",
            "success",
            true,
            false
          );

          if (onUpdate) {
            onUpdate();
          }
        } else {
          showAlert("Error", "Failed to update cover photo", "error");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showAlert("Error", "Failed to update cover photo", "error");
    } finally {
      setIsUploading(false);
      setShowCoverUpload(false);
    }
  };

  const membersCount = group?.members?.length || 0;
  const coverPicture = group?.coverPicture || "/banner.png";
  const description = group?.description;

  const userStreak = currentUserRank?.streak || 0;
  const leaderStreak = leader?.streak || 0;

  return (
    <>
      <div className="bg-secondary rounded-xl overflow-hidden relative">
        <div className="relative">
          <img
            src={coverPicture}
            alt="Group banner"
            className="rounded-t-xl w-full h-auto object-cover max-h-40"
          />

          {isAdmin && (
            <button
              onClick={() => setShowCoverUpload(true)}
              disabled={isUploading}
              className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
            >
              <IoPencil className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        <div className="flex justify-center gap-16 p-2">
          {leader && (
            <div className="flex items-center">
              <Avatar
                src={leader.avatar || "/mock.png"}
                name={leader.name || "Leader"}
                size={24}
              />
              <div className="ml-2">
                <p className="text-xs font-semibold">{leaderStreak}</p>
                <p className="text-xs text-gray-400">Leader</p>
              </div>
            </div>
          )}

          {currentUserRank && (
            <div className="flex items-center">
              <Avatar
                src={currentUserRank.avatar || "/mock.png"}
                name={currentUserRank.name}
                size={24}
              />
              <div className="ml-2">
                <p className="text-xs font-semibold">{userStreak}</p>
                <p className="text-xs text-gray-400">You</p>
              </div>
            </div>
          )}
        </div>

        {description && (
          <p className="text-center text-xs text-gray-300 px-4 pb-2">
            {description}
          </p>
        )}

        <p className="text-center text-xs text-gray-400 pb-2">
          {membersCount} {membersCount === 1 ? "member" : "members"}
        </p>
      </div>

      {showCoverUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white text-lg font-bold mb-4">
              Change Cover Photo
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={isUploading}
              className="hidden"
              id="cover-upload"
            />
            <label
              htmlFor="cover-upload"
              className="block w-full py-3 rounded-lg bg-third text-white font-semibold text-center transition cursor-pointer"
            >
              {isUploading ? "Uploading..." : "Choose Photo"}
            </label>
            <button
              onClick={() => setShowCoverUpload(false)}
              disabled={isUploading}
              className="w-full mt-3 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => {
          setAlert({ ...alert, isOpen: false });
        }}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        autoClose={alert.autoClose}
        showButton={alert.showButton}
      />
    </>
  );
}