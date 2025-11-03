// src/components/profile/DeleteAccountModal.jsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccountModal({ onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (title, message, type = "info") =>
    setAlert({ isOpen: true, title, message, type });
  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      showAlert("Invalid Input", 'Please type "DELETE" to confirm', "error");
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
      });

      if (response.ok) {
        await signOut({ callbackUrl: "/login" });
      } else {
        showAlert("Error", "Failed to delete account", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showAlert("Error", "Failed to delete account", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-15 h-15 rounded-full bg-red-600 flex items-center justify-center">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-xl font-bold text-center mb-2">
          Delete Account
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-sm text-center mb-6">
          This action is permanent and cannot be undone. All your data will be
          lost forever.
        </p>

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">
            Type <span className="text-white font-semibold">DELETE</span> to
            confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting || confirmText !== "DELETE"}
            className="flex-1 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
