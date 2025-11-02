"use client";

import { useState } from "react";
import { User, Mail, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import AlertModal from "@/components/ui/AlertModal";

export default function SettingsForm({ user, onUpdate }) {
  const [editing, setEditing] = useState({ name: false, email: false });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
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
  const handleSave = async (field) => {
    setSaving(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: formData[field] }),
      });

      if (response.ok) {
        setEditing({ ...editing, [field]: false });
        onUpdate();
        showAlert(
          "Success",
          `${field === "name" ? "Name" : "Email"} updated successfully!`,
          "success",
          true,
          false
        );
      } else {
        const data = await response.json();
        showAlert("Update Failed", data.message || "Failed to update", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showAlert("Update Failed", "Failed to update", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      showAlert("Sign Out Failed", "Failed to sign out", "error");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3 py-3 border-b border-gray-800">
          <User className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-gray-400 text-sm">Name</p>
            {editing.name ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="flex-1 bg-transparent text-white outline-none border-b border-third"
                  autoFocus
                  disabled={saving}
                />
                <button
                  onClick={() => handleSave("name")}
                  disabled={saving || !formData.name.trim()}
                  className="text-third text-sm font-semibold hover:text-third disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setFormData({ ...formData, name: user?.name || "" });
                    setEditing({ ...editing, name: false });
                  }}
                  disabled={saving}
                  className="text-gray-400 text-sm hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
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

        <div className="flex items-center gap-3 py-3 border-b border-gray-800">
          <Mail className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-gray-400 text-sm">Email</p>
            {editing.email ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="flex-1 bg-transparent text-white outline-none border-b border-third"
                  autoFocus
                  disabled={saving}
                />
                <button
                  onClick={() => handleSave("email")}
                  disabled={saving || !formData.email.trim()}
                  className="text-third text-sm font-semibold hover:text-third disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setFormData({ ...formData, email: user?.email || "" });
                    setEditing({ ...editing, email: false });
                  }}
                  disabled={saving}
                  className="text-gray-400 text-sm hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p
                className="text-white cursor-pointer hover:text-gray-300"
                onClick={() => setEditing({ ...editing, email: true })}
              >
                {user?.email}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 text-white hover:text-gray-300 transition py-3 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign out</span>
        </button>
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
