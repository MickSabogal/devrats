"use client";

import React, { useState } from "react";
import Avatar from "./UserAvatar";
import { IoTrashOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import AlertModal from "@/components/ui/AlertModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function EventCard({
  user,
  eventTitle,
  eventImage,
  eventTime,
  postId,
  onDelete,
}) {
  const { data: session } = useSession();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/group/${postId}/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        showAlert(
          "Success",
          "Post deleted successfully",
          "success",
          true,
          false
        );
        setTimeout(() => {
          if (onDelete) onDelete(postId);
        }, 1500);
      } else {
        showAlert("Error", "Failed to delete post", "error");
      }
    } catch (error) {
      showAlert("Error", "Failed to delete post", "error");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const isOwner = session?.user?.id === user?._id;

  return (
    <>
      <div className="bg-secondary rounded-xl mt-2 p-2 flex items-center">
        <img
          src={eventImage || "/banner.png"}
          alt="event picture"
          className="w-14 h-14 rounded-full"
        />
        <div className="ml-2 w-full">
          <p className="text-sm font-sans mb-2">
            {eventTitle || "Event Title"}
          </p>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Avatar src={user?.avatar} name={user?.name} size={24} />
              <p className="text-xs ml-1">{user?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <small className="text-xs text-gray-400">
                {eventTime || "Now"}
              </small>
              {isOwner && (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isDeleting}
                  className="p-1 rounded hover:bg-red-600/20 transition-colors disabled:opacity-50"
                >
                  <IoTrashOutline className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />

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
