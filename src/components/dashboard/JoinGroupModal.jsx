"use client";

import { useState } from "react";
import { IoClose, IoLink, IoKeypad } from "react-icons/io5";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AlertModal from "@/components/ui/AlertModal";
import { useRouter } from "next/navigation";

export default function JoinGroupModal({ isOpen, onClose, onGroupJoined }) {
  const router = useRouter();
  const [inviteInput, setInviteInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [error, setError] = useState("");

  const showAlert = (title, message, type = "info") =>
    setAlert({ isOpen: true, title, message, type });

  const extractToken = (input) => {
    const trimmed = input.trim();
    
    // Se for apenas o token (hash)
    if (!trimmed.includes('/') && !trimmed.includes('http')) {
      return trimmed;
    }
    
    // Se for um link completo, extrair o token
    try {
      const url = new URL(trimmed);
      const pathParts = url.pathname.split('/');
      const token = pathParts[pathParts.length - 1];
      return token;
    } catch {
      // Se falhar ao fazer parse como URL, tentar extrair manualmente
      const parts = trimmed.split('/');
      return parts[parts.length - 1];
    }
  };

  const handleInputChange = (e) => {
    setInviteInput(e.target.value);
    if (error) setError("");
  };

  const resetForm = () => {
    setInviteInput("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!inviteInput.trim()) {
      setError("Please enter an invite link or code");
      return;
    }

    setIsLoading(true);

    try {
      const token = extractToken(inviteInput);

      if (!token) {
        setError("Invalid invite link or code");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/group/join/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        showAlert("Success", "You've joined the group successfully!", "success");
        
        setTimeout(() => {
          resetForm();
          onClose();
          if (onGroupJoined) {
            onGroupJoined(data);
          }
          // Redirecionar para o grupo
          if (data.groupId) {
            router.push(`/dashboard/groups/${data.groupId}/dashboard`);
          }
        }, 1500);
      } else {
        if (response.status === 404) {
          showAlert("Invalid Link", "This invite link doesn't exist or has expired", "error");
        } else if (response.status === 400) {
          showAlert("Already a Member", data.message || "You're already in this group", "warning");
        } else {
          showAlert("Error", data.message || "Error joining group", "error");
        }
      }
    } catch (error) {
      console.error("Join group error:", error);
      showAlert("Error", "Error joining group. Please try again.", "error");
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
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Join Group</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
            >
              <IoClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                    Enter Invite Details
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <Input
                  label="Invite Link or Code *"
                  name="inviteInput"
                  icon={IoLink}
                  value={inviteInput}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="Paste link or enter code"
                  error={error}
                />
              </div>

              <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                  <IoKeypad className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      How to join:
                    </p>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Paste the full invite link</li>
                      <li>• Or enter just the invite code</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Example:</strong>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                  https://yoursite.com/group/join/abc123xyz
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">or simply:</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                  abc123xyz
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-[#1e2939] border-t border-gray-200 dark:border-gray-700/50 px-6 py-4">
              <Button
                type="button"
                fullWidth
                variant="primary"
                loading={isLoading}
                onClick={handleSubmit}
              >
                Join Group
              </Button>
            </div>
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