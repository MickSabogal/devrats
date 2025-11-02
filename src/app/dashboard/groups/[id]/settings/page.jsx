// src/app/dashboard/groups/[id]/settings/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoArrowBack, IoTrashOutline, IoImageOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GroupSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverPicture: "",
  });

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
            alert("Only admins can access settings");
            router.push(`/dashboard/groups/${id}/details`);
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
        alert("Image must be less than 5MB");
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
      alert("Group name is required");
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
        alert("Group updated successfully!");
        router.push(`/dashboard/groups/${id}/details`);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update group");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      alert("Error updating group");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${group?.name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    const doubleConfirm = prompt(`Type "${group?.name}" to confirm deletion:`);

    if (doubleConfirm !== group?.name) {
      alert("Group name doesn't match. Deletion cancelled.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/group/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Group deleted successfully");
        router.push("/dashboard/home");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Error deleting group");
    } finally {
      setSaving(false);
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

        {/* Cover Picture Upload */}
        <div className="bg-[#1e2939] rounded-lg p-4 mb-4">
          <label className="block text-white font-semibold mb-3">
            Cover Picture
          </label>

          <div className="relative h-40 rounded-lg overflow-hidden bg-gray-800 mb-3">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                <IoImageOutline className="w-12 h-12 mb-2" />
                <span className="text-sm">No cover image</span>
              </div>
            )}
          </div>

          <label className="flex items-center justify-center gap-2 bg-green-500 text-primary py-3 rounded-lg font-medium cursor-pointer hover:bg-green-600 transition-colors">
            <FiUpload className="w-5 h-5" />
            <span>Upload New Cover</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <p className="text-gray-400 text-xs mt-2">
            Recommended: 800x400px, max 5MB
          </p>
        </div>

        {/* Group Name */}
        <div className="bg-[#1e2939] rounded-lg p-4 mb-4">
          <label className="block text-white font-semibold mb-3">
            Group Name *
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
            Description
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
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
            <IoTrashOutline className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Once you delete a group, there is no going back. All posts and data
            will be permanently deleted.
          </p>
          <button
            onClick={handleDeleteGroup}
            disabled={saving}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Delete Group
          </button>
        </div>
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
            onClick={handleDeleteGroup}
            disabled={saving}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Delete Group
          </button>
        </div>
        <BottomNavbar groupId={id} />
      </div>
    </div>
  );
}
