// src/app/dashboard/groups/[id]/chat/page.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoSend, IoPencil, IoTrashOutline, IoClose } from "react-icons/io5";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AlertModal from "@/components/ui/AlertModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";

export default function GroupChatPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const showAlert = (
    title,
    message,
    type = "info",
    autoClose = true,
    showButton = false
  ) => setAlert({ isOpen: true, title, message, type, autoClose, showButton });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/group/${id}/chat`);
      const data = await res.json();

      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSending(true);

    try {
      const res = await fetch(`/api/group/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageText }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, data.data]);
        setMessageText("");
      } else {
        showAlert("Error", data.message || "Failed to send message", "error");
      }
    } catch (error) {
      showAlert("Error", "Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async () => {
    if (!editingMessage || !messageText.trim()) return;

    setSending(true);

    try {
      const res = await fetch(`/api/group/${id}/chat/${editingMessage._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageText }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === editingMessage._id ? data.data : msg))
        );
        setMessageText("");
        setEditingMessage(null);
        showAlert(
          "Success",
          "Message updated successfully",
          "success",
          true,
          false
        );
      } else {
        showAlert("Error", data.message || "Failed to edit message", "error");
      }
    } catch (error) {
      showAlert("Error", "Failed to edit message", "error");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await fetch(`/api/group/${id}/chat/${messageId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        showAlert(
          "Success",
          "Message deleted successfully",
          "success",
          true,
          false
        );
      } else {
        const data = await res.json();
        showAlert("Error", data.message || "Failed to delete message", "error");
      }
    } catch (error) {
      showAlert("Error", "Failed to delete message", "error");
    } finally {
      setDeletingMessageId(null);
    }
  };

  const canEdit = (message) => {
    if (message.user._id !== user?._id) return false;

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    return new Date(message.createdAt) > twoHoursAgo;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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
      <div className="bg-primary min-h-screen flex flex-col">
        <div className="max-w-md mx-auto w-full flex flex-col h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
            <button
              onClick={() => router.push(`/dashboard/groups/${id}/dashboard`)}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Group Chat</h1>
            <div className="w-10" />
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = msg.user._id === user?._id;

                return (
                  <div
                    key={msg._id}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] ${
                        isOwnMessage
                          ? "bg-third text-white"
                          : "bg-[#1e2939] text-white"
                      } rounded-2xl px-4 py-2 shadow-lg`}
                    >
                      {!isOwnMessage && (
                        <p className="text-xs text-gray-300 mb-1 font-semibold">
                          {msg.user.name}
                        </p>
                      )}

                      <p className="text-sm leading-relaxed break-words">
                        {msg.content}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="text-xs opacity-70">
                          {formatTime(msg.createdAt)}
                        </span>

                        {isOwnMessage && (
                          <div className="flex items-center gap-1">
                            {canEdit(msg) && (
                              <button
                                onClick={() => {
                                  setEditingMessage(msg);
                                  setMessageText(msg.content);
                                }}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                              >
                                <IoPencil className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => setDeletingMessageId(msg._id)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              <IoTrashOutline className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 bg-primary p-4 pb-24 flex-shrink-0">
            {editingMessage && (
              <div className="flex items-center justify-between mb-2 p-2 bg-[#1e2939] rounded-lg">
                <span className="text-sm text-gray-300">Editing message</span>
                <button
                  onClick={() => {
                    setEditingMessage(null);
                    setMessageText("");
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    editingMessage ? handleEditMessage() : handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-[#1e2939] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-third resize-none max-h-32 overflow-y-auto"
                rows={1}
                disabled={sending}
              />

              <button
                onClick={editingMessage ? handleEditMessage : handleSendMessage}
                disabled={sending || !messageText.trim()}
                className="bg-third text-white p-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {sending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <IoSend className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <BottomNavbar groupId={id} currentPage="chat" />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingMessageId}
        onClose={() => setDeletingMessageId(null)}
        onConfirm={() => handleDeleteMessage(deletingMessageId)}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
      />

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
