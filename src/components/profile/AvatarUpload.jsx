
"use client";

import { useState } from "react";

export default function AvatarUpload({ user, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;


    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
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
        } else {
          alert("Failed to upload avatar");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-800">
      {/* Avatar */}
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

      {/* Upload Button */}
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
  );
}