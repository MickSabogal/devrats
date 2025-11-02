"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoTrashOutline, IoPencil } from "react-icons/io5";
import Avatar from "./UserAvatar";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AlertModal from "@/components/ui/AlertModal";

export default function GroupBanner({ user, group, onUpdate }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleDeleteGroup = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/group/${group._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const groupsRes = await fetch("/api/group");
        const groupsData = await groupsRes.json();

        if (groupsData.length === 0) {
          showAlert(
            "No Active Groups",
            "Oops! Seems like you don't have any active groups. You will be redirected to our onboarding page.",
            "warning",
            false,
            true
          );
          setTimeout(() => {
            router.push("/dashboard/onboarding");
          }, 3000);
        } else {
          showAlert(
            "Success",
            "Group deleted successfully",
            "success",
            true,
            false
          );
          setTimeout(() => {
            router.push("/dashboard/home");
          }, 1500);
        }
      } else {
        showAlert("Error", "Failed to delete group", "error");
      }
    } catch (error) {
      showAlert("Error", "Failed to delete group", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

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
          if (onUpdate) onUpdate();
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

  const getLeader = () => {
    if (!group?.members || group.members.length === 0) {
      return null;
    }

    const allMembers = group.members.map((m) => m.user).filter(Boolean);
    const leader = allMembers.reduce((prev, current) => {
      return (current.streak || 0) > (prev.streak || 0) ? current : prev;
    }, allMembers[0]);

    return leader;
  };

  const leader = getLeader();
  const membersCount = group?.members?.length || 0;
  const coverPicture = group?.coverPicture || "/banner.png";
  const description = group?.description;

  return (
    <>
      <div className="bg-secondary rounded-xl overflow-hidden relative">
        <div className="relative">
          <img
            src={coverPicture}
            alt="Group banner"
            className="rounded-t-xl w-full h-auto object-cover max-h-40"
          />

          <button
            onClick={() => setShowCoverUpload(true)}
            disabled={isUploading}
            className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
          >
            <IoPencil className="w-4 h-4 text-white" />
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <IoTrashOutline className="w-4 h-4 text-red-600" />
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
                <p className="text-xs font-semibold">{leader.streak || 0}</p>
                <p className="text-xs text-gray-400">Leader</p>
              </div>
            </div>
          )}

          {user && (
            <div className="flex items-center">
              <Avatar
                src={user.avatar || "/mock.png"}
                name={user.name}
                size={24}
              />
              <div className="ml-2">
                <p className="text-xs font-semibold">{user.streak || 0}</p>
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
              className="block w-full py-3 rounded-lg bg-red-600 text-white font-semibold text-center hover:bg-red-700 transition cursor-pointer"
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

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteGroup}
        title="Delete Group"
        message={`Are you sure you want to delete "${group?.name}"? This action cannot be undone and will remove all posts and data.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        autoClose={alert.autoClose}
        showButton={alert.showButton}
      />
    </>
  );
}
