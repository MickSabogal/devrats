// src/components/profile/SettingsForm.jsx
"use client";

import { useState } from "react";
import { User, Mail, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsForm({ user, onUpdate }) {
  const [editing, setEditing] = useState({ name: false, email: false });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (field) => {
    setSaving(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: formData[field] }),
      });

      if (response.ok) {
        setEditing({ ...editing, [field]: false });
        onUpdate();
      } else {
        alert("Failed to update");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="space-y-4">
      {/* Name Field */}
      <div className="flex items-center gap-3 py-3 border-b border-gray-800">
        <User className="w-5 h-5 text-gray-400" />
        <div className="flex-1">
          <p className="text-gray-400 text-sm">Name</p>
          {editing.name ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-transparent text-white outline-none"
              autoFocus
              onBlur={() => handleSave("name")}
              onKeyDown={(e) => e.key === "Enter" && handleSave("name")}
            />
          ) : (
            <p
              className="text-white cursor-pointer hover:text-gray-300"
              onClick={() => setEditing({ ...editing, name: true })}
            >
              {user?.name}
            </p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div className="flex items-center gap-3 py-3 border-b border-gray-800">
        <Mail className="w-5 h-5 text-gray-400" />
        <div className="flex-1">
          <p className="text-gray-400 text-sm">Email</p>
          <p className="text-white">{user?.email}</p>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 text-white hover:text-gray-300 transition py-3 w-full"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sign out</span>
      </button>
    </div>
  );
}