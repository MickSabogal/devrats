// src/components/dashboard/addEventModal.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  IoClose,
  IoCamera,
  IoCalendar,
  IoGitBranch,
  IoTime,
} from "react-icons/io5";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import AlertModal from "@/components/ui/AlertModal";

export default function AddEventModal({
  isOpen,
  onClose,
  onPostCreated,
  groupId,
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    eventDate: new Date().toISOString().split("T")[0],
    duration: 0,
    commitLines: "",
    activityDescription: "",
    repoLink: "",
  });

  const cameraInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setAlert({ isOpen: false, title: "", message: "", type: "info" });
    }
  }, [isOpen]);

  const showAlert = (title, message, type = "info") => {
    setAlert({ isOpen: true, title, message, type });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert(
          "File Too Large",
          "Image size must be less than 5MB",
          "error"
        );
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDurationChange = (hours, minutes) => {
    const totalMinutes = hours * 60 + minutes;
    setFormData((prev) => ({ ...prev, duration: totalMinutes }));
    if (errors.duration) {
      setErrors((prev) => ({ ...prev, duration: "" }));
    }
  };

  const formatDuration = (minutes) => {
    if (minutes === 0) return "Select duration";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      eventDate: new Date().toISOString().split("T")[0],
      duration: 0,
      commitLines: "",
      activityDescription: "",
      repoLink: "",
    });
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
    setShowMetrics(false);
    setShowDurationPicker(false);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!imageFile || !imagePreview) {
      newErrors.image = "Photo is required";
      showAlert(
        "Error",
        "Photo is required. Please take or select a photo.",
        "error"
      );
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Description is required";
    }

    if (formData.duration === 0) {
      newErrors.duration = "Study duration is required";
      showAlert("Error", "Please select a study duration", "error");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupId) {
      showAlert("Error", "No group selected", "error");
      return;
    }

    if (!validate()) return;

    setIsLoading(true);

    try {
      let imageBase64 = null;

      if (imageFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const postData = {
        title: formData.title,
        content: formData.content,
        image: imageBase64,
        eventDate: new Date(formData.eventDate).toISOString(),
        duration: formData.duration,
      };

      if (
        showMetrics &&
        (formData.commitLines ||
          formData.activityDescription ||
          formData.repoLink)
      ) {
        postData.metrics = {
          commitLines: formData.commitLines
            ? parseInt(formData.commitLines)
            : null,
          activityDescription: formData.activityDescription || null,
          repoLink: formData.repoLink || null,
        };
      }

      console.log("📤 Sending post data:", {
        title: postData.title,
        duration: postData.duration,
        hasImage: !!postData.image,
      });

      // ✅ CORRIGIDO - rota correta
      const response = await fetch(`/api/group/${groupId}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (data.success) {
        showAlert("Success", "Activity posted successfully!", "success");

        setTimeout(() => {
          if (onPostCreated) onPostCreated(data.post);
          resetForm();
          onClose();
        }, 1500);
      } else {
        showAlert("Error", data.message || "Error creating post", "error");
      }
    } catch (error) {
      console.error("❌ Error creating post:", error);
      showAlert("Error", "Error creating post. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <div className="relative w-full max-w-md bg-white dark:bg-[#1e2939] rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 bg-white dark:bg-[#1e2939] border-b border-gray-200 dark:border-gray-700/50 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Add Activity
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
            >
              <IoClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[calc(90vh-140px)]"
          >
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <IoCamera className="w-4 h-4" />
                  Photo *
                  <span className="text-red-600 text-xs">(Required)</span>
                </label>

                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (imagePreview) URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      disabled={isLoading}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
                    >
                      <IoClose className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isLoading}
                    className={`w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg transition-colors disabled:opacity-50
    ${
      errors.image
        ? "border-green-500 bg-green-500/10"
        : "border-green-400 dark:border-green-500 bg-green-500/10 hover:border-green-600 dark:hover:border-green-400"
    }`}
                  >
                    <IoCamera className="w-8 h-8 text-white-500 dark:text-white-400" />
                    <span className="text-sm text-white-600 dark:text-white-400 font-medium">
                      Take Photo
                    </span>
                  </button>
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

              <Input
                label="Activity Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Enter activity title"
                error={errors.title}
              />

              <Textarea
                label="Description *"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Describe your activity"
                rows={4}
                error={errors.content}
              />

              <Input
                label="Date (Today Only)"
                icon={IoCalendar}
                type="date"
                value={formData.eventDate}
                disabled
                className="cursor-not-allowed opacity-60"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <IoTime className="w-4 h-4" />
                  Study Duration *
                </label>
                <button
                  type="button"
                  onClick={() => setShowDurationPicker(!showDurationPicker)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-lg border text-left transition-all disabled:opacity-50
                    ${
                      errors.duration
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-red-600"
                    } bg-white dark:bg-[#0B111c] text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none`}
                >
                  {formatDuration(formData.duration)}
                </button>

                {showDurationPicker && (
                  <div className="p-4 bg-gray-50 dark:bg-[#0B111c] rounded-lg border border-gray-300 dark:border-gray-600">
                    <div className="flex gap-4 items-center justify-center">
                      <div className="flex flex-col items-center">
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Hours
                        </label>
                        <select
                          value={Math.floor(formData.duration / 60)}
                          onChange={(e) =>
                            handleDurationChange(
                              parseInt(e.target.value),
                              formData.duration % 60
                            )
                          }
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e2939] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-600 outline-none"
                        >
                          {[...Array(13)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col items-center">
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Minutes
                        </label>
                        <select
                          value={formData.duration % 60}
                          onChange={(e) =>
                            handleDurationChange(
                              Math.floor(formData.duration / 60),
                              parseInt(e.target.value)
                            )
                          }
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e2939] text-gray-900 dark:text-white focus:ring-2 focus:ring-red-600 outline-none"
                        >
                          {[0, 15, 30, 45].map((min) => (
                            <option key={min} value={min}>
                              {min}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {errors.duration && (
                  <p className="text-sm text-red-500">{errors.duration}</p>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMetrics(!showMetrics)}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-white hover:underline disabled:opacity-50"
                >
                  <IoGitBranch className="w-4 h-4" />
                  {showMetrics ? "Hide Metrics" : "Add Metrics (Optional)"}
                </button>
              </div>

              {showMetrics && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-[#0B111c] rounded-lg">
                  <Input
                    label="Commit Lines"
                    name="commitLines"
                    type="number"
                    value={formData.commitLines}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="e.g. 150"
                  />

                  <Textarea
                    label="Activity Description"
                    name="activityDescription"
                    value={formData.activityDescription}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Describe what you worked on"
                    rows={3}
                  />

                  <Input
                    label="Repository Link"
                    name="repoLink"
                    type="url"
                    value={formData.repoLink}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="https://github.com/..."
                  />
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-[#1e2939] border-t border-gray-200 dark:border-gray-700/50 px-6 py-4">
              <Button
                type="submit"
                fullWidth
                variant="primary"
                loading={isLoading}
                disabled={!imageFile}
              >
                Post Activity
              </Button>
            </div>
          </form>
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
