// src/components/profile/AvatarUpload.jsx

"use client";

import { useState } from "react";
import AlertModal from "@/components/ui/AlertModal";

export default function AvatarUpload({ user, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  const showAlert = (
    title,
    message,
    type = "info",
    autoClose = true,
    showButton = false
  ) => {
    setAlert({ isOpen: true, title, message, type, autoClose, showButton });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showAlert("Invalid File", "Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert("File Too Large", "File size must be less than 5MB", "error");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const response = await fetch("/api/users/me/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: base64Image }),
        });

        if (response.ok) {
          onUpdate();
          showAlert(
            "Success",
            "Avatar updated successfully!",
            "success",
            true,
            false
          );
        } else {
          showAlert("Upload Failed", "Failed to upload avatar", "error");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      showAlert("Upload Failed", "Failed to upload avatar", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 py-3 border-b border-gray-800">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
            {user?.avatar && user.avatar !== "/images/default-avatar.png" ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-lg font-bold">{initials}</span>
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <label className="flex-1 cursor-pointer">
          <span className="text-white font-medium">Change profile picture</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

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
