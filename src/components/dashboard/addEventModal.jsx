"use client";

import React, { useState, useRef } from "react";
import { IoClose, IoCamera, IoImage, IoCalendar, IoLocation, IoGitBranch } from "react-icons/io5";
import AlertModal from "@/components/ui/AlertModal";

export default function AddEventModal({ isOpen, onClose, onPostCreated }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 16),
    location: "",
    commitLines: "",
    activityDescription: "",
    repoLink: ""
  });

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const showAlert = (title, message, type = "info") => {
    setAlert({ isOpen: true, title, message, type });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert("File Too Large", "Image size must be less than 5MB", "error");
        return;
      }
      
      setImageFile(file);
      
      // Criar preview com URL.createObjectURL (mais rápido)
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().slice(0, 16),
      location: "",
      commitLines: "",
      activityDescription: "",
      repoLink: ""
    });
    
    // Limpar URL do preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImagePreview(null);
    setImageFile(null);
    setShowMetrics(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageBase64 = null;
      
      // Converter imagem para base64 apenas no envio
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
        content: formData.description,
        image: imageBase64,
        eventDate: formData.date,
        location: formData.location,
        metrics: showMetrics && (formData.commitLines || formData.activityDescription || formData.repoLink) ? {
          commitLines: formData.commitLines ? parseInt(formData.commitLines) : null,
          activityDescription: formData.activityDescription || null,
          repoLink: formData.repoLink || null
        } : null
      };

      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Post criado com sucesso:", data.data);
        
        if (onPostCreated) {
          onPostCreated(data.data);
        }

        onClose();
        resetForm();
        showAlert("Success", "Activity posted successfully!", "success");
      } else {
        console.error("Erro ao criar post:", data.message);
        showAlert("Error", data.message || "Error creating post", "error");
      }
    } catch (error) {
      console.error("Erro ao enviar post:", error);
      showAlert("Error", "Error creating post. Please try again.", "error");
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
          <div className="sticky top-0 bg-white dark:bg-[#1e2939] border-b border-gray-200 dark:border-gray-700/50 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Activity</h2>
            <button 
              onClick={onClose} 
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
            >
              <IoClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Photo</label>
                
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        if (imagePreview) {
                          URL.revokeObjectURL(imagePreview);
                        }
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
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={isLoading}
                      className="flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary dark:hover:border-white transition-colors disabled:opacity-50"
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

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Activity Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Enter activity title"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0B111c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Describe your activity"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0B111c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all resize-none disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <IoCalendar className="w-4 h-4" />
                  Date & Time *
                </label>
                <input
                  id="date"
                  name="date"
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0B111c] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <IoLocation className="w-4 h-4" />
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Enter location"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0B111c] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all disabled:opacity-50"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMetrics(!showMetrics)}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-sm font-medium text-primary dark:text-white hover:underline disabled:opacity-50"
                >
                  <IoGitBranch className="w-4 h-4" />
                  {showMetrics ? "Hide Metrics" : "Add Metrics (Optional)"}
                </button>
              </div>

              {showMetrics && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-[#0B111c] rounded-lg">
                  <div className="space-y-2">
                    <label htmlFor="commitLines" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Commit Lines
                    </label>
                    <input
                      id="commitLines"
                      name="commitLines"
                      type="number"
                      value={formData.commitLines}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="e.g. 150"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e2939] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="activityDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Activity Description
                    </label>
                    <textarea
                      id="activityDescription"
                      name="activityDescription"
                      value={formData.activityDescription}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Describe what you worked on"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e2939] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all resize-none disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="repoLink" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Repository Link
                    </label>
                    <input
                      id="repoLink"
                      name="repoLink"
                      type="url"
                      value={formData.repoLink}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e2939] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-[#1e2939] border-t border-gray-200 dark:border-gray-700/50 px-6 py-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary dark:bg-white text-white dark:text-primary font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Posting..." : "Post Activity"}
              </button>
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