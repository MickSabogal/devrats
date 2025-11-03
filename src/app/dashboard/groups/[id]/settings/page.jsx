// src/app/dashboard/groups/[id]/settings/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBack, IoTrashOutline, IoImageOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AlertModal from "@/components/ui/AlertModal";

export default function GroupSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverPicture: "",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resUser = await fetch("/api/users/me");
        const userData = await resUser.json();
        setUser(userData.user);

        const resGroup = await fetch(`/api/group/${id}`);
        const groupData = await resGroup.json();

        if (resGroup.ok) {
          if (groupData.admin._id !== userData.user._id) {
            showAlert(
              "Unauthorized",
              "Only admins can access settings",
              "error",
              false,
              true
            );
            setTimeout(() => {
              router.push(`/dashboard/groups/${id}/details`);
            }, 2000);
            return;
          }

          setGroup(groupData);
          setFormData({
            name: groupData.name || "",
            description: groupData.description || "",
            coverPicture: groupData.coverPicture || "",
          });
          setCoverPreview(groupData.coverPicture || null);
        } else {
          router.push("/dashboard/home");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/dashboard/home");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert(
          "File Too Large",
          "Image must be less than 5MB",
          "error"
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setFormData({ ...formData, coverPicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showAlert("Error", "Group name is required", "error");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/group/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          coverPicture: formData.coverPicture,
        }),
      });

      if (res.ok) {
        showAlert(
          "Success",
          "Group updated successfully!",
          "success",
          true,
          false
        );
        setTimeout(() => {
          router.push(`/dashboard/groups/${id}/details`);
        }, 1500);
      } else {
        const data = await res.json();
        showAlert("Error", data.message || "Failed to update group", "error");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      showAlert("Error", "Error updating group", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (deleteConfirmText !== group?.name) {
      showAlert(
        "Invalid Confirmation",
        "Group name doesn't match. Please try again.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/group/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showAlert(
          "Success",
          "Group deleted successfully",
          "success",
          false,
          true
        );
        setTimeout(() => {
          router.push("/dashboard/home");
        }, 2000);
      } else {
        const data = await res.json();
        showAlert("Error", data.message || "Failed to delete group", "error");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      showAlert("Error", "Error deleting group", "error");
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    }
  };

  if (loading) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-primary min-h-screen">
        <div className="max-w-md mx-auto relative min-h-screen px-6 pt-6 pb-28">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push(`/dashboard/groups/${id}/details`)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <IoArrowBack className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Group Settings</h1>
            <div className="w-10" />
          </div>

          {/* Group Name */}
          <div className="bg-[#1e2939] rounded-lg p-4 mb-4">
            <label className="block text-white font-semibold mb-3">
              Change Group Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-primary text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Description */}
          <div className="bg-[#1e2939] rounded-lg p-4 mb-4">
            <label className="block text-white font-semibold mb-3">
              Change Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full bg-primary text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors resize-none"
              placeholder="Describe your group..."
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-green-500 text-primary py-4 rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-6"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>

          {/* Danger Zone */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-8">
            <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
              <IoTrashOutline className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Once you delete a group, there is no going back. All posts and data
              will be permanently deleted.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={saving}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Delete Group
            </button>
          </div>
          <BottomNavbar groupId={id} />
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <IoTrashOutline className="w-6 h-6 text-white" />
              </div>
            </div>

            <h2 className="text-white text-xl font-bold text-center mb-2">
              Delete Group
            </h2>

            <p className="text-gray-400 text-sm text-center mb-4">
              This action cannot be undone. This will permanently delete the group{" "}
              <span className="text-white font-semibold">"{group?.name}"</span> and
              all of its data.
            </p>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                Type <span className="text-white font-semibold">"{group?.name}"</span> to
                confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={group?.name}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                disabled={saving}
                className="flex-1 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                disabled={saving || deleteConfirmText !== group?.name}
                className="flex-1 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
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