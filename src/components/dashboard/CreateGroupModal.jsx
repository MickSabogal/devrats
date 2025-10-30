"use client";

import React, { useState, useRef } from "react";
import {
  IoClose,
  IoCamera,
  IoImage,
  IoPeople,
  IoInformationCircle,
} from "react-icons/io5";
import AlertModal from "@/components/ui/AlertModal";

export default function CreateGroupModal({ isOpen, onClose, onGroupCreated }) {
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const showAlert = (title, message, type = "info") =>
    setAlert({ isOpen: true, title, message, type });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert("File Too Large", "Image size must be less than 5MB", "error");
        return;
      }

      setCoverFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    setCoverFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim())
      return showAlert("Validation Error", "Group name is required", "error");

    if (!formData.description.trim())
      return showAlert("Validation Error", "Description is required", "error");

    setIsLoading(true);

    try {
      let coverBase64 = null;

      if (coverFile) {
        coverBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(coverFile);
        });
      }

      const groupData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        coverPicture: coverBase64 || "",
      };

      const response = await fetch("/api/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
      });

      const data = await response.json();

      if (response.ok) {
        onGroupCreated?.(data);
        showAlert("Success", "Group created successfully!", "success");
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      } else {
        showAlert("Error", data.message || "Error creating group", "error");
      }
    } catch (error) {
      showAlert("Error", "Error creating group. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div className="relative w-full max-w-md bg-white dark:bg-[#1e2939] rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-[#1e2939] border-b border-gray-200 dark:border-gray-700/50 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Group</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
            >
              <IoClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="px-6 py-4 space-y-4">
              {/* Cover */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cover Picture (Optional)
                </label>

                {coverPreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        if (coverPreview) URL.revokeObjectURL(coverPreview);
                        setCoverPreview(null);
                        setCoverFile(null);
                      }}
                      disabled={isLoading}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
                    >
                      <IoClose className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={isLoading}
                      className="flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-white transition-colors"
                    >
                      <IoCamera className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Camera</span>
                    </button>
                    
                  </div>
                )}

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="hidden"
                />
                
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <IoPeople className="w-4 h-4" /> Group Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Enter group name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0B111c] text-gray-900 dark:text-white"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <IoInformationCircle className="w-4 h-4" /> Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Describe your group's purpose"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0B111c] text-gray-900 dark:text-white"
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> You'll be added as the group admin and receive an invite link to share with others.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 bg-white dark:bg-[#1e2939] border-t border-gray-200 dark:border-gray-700/50 px-6 py-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 dark:bg-white text-white dark:text-blue-600 font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating Group..." : "Create Group"}
            </button>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </>
  );
}
