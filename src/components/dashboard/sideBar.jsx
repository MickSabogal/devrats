"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoClose,
  IoSettingsOutline,
  IoAddCircleOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import Avatar from "./UserAvatar";
import CheeseMouseAnimation from "./CheeseMouseAnimation";
import CreateGroupModal from "@/components/dashboard/CreateGroupModal";
import JoinGroupModal from "@/components/dashboard/JoinGroupModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Sidebar({ isOpen, onClose, user }) {
  const router = useRouter();
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/group", { method: "GET" });
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          setGroups(data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
    setIsCreateGroupModalOpen(false);
    onClose();
    setTimeout(() => {
      router.push(`/dashboard/groups/${newGroup._id}/dashboard`);
    }, 100);
  };

  const handleGroupJoined = async () => {
    try {
      const response = await fetch("/api/group", { method: "GET" });
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setGroups(data);
      }
    } catch (error) {
      console.error("Error fetching groups after join:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300"
        />
      )}

      <div
        className={`absolute top-0 left-0 z-50 w-80 h-full bg-secondary shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {isOpen && <CheeseMouseAnimation />}

        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <IoClose className="w-5 h-5 text-primary" />
            </button>
          </div>

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <div className="relative p-0 rounded-full border-2 border-green-500">
              <div className="absolute inset-0 rounded-full bg-green-500/30 blur-xl -z-10" />
              <Avatar
                src={user?.avatar}
                name={user?.name}
                size={76}
                className="relative rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-primary truncate">
                {user?.name || "Loading..."}
              </p>
              <p className="text-sm text-third">View profile</p>
            </div>
          </Link>
        </div>

        <div className="flex flex-col h-[calc(100%-260px)] overflow-y-auto px-3">
          <div className="mb-4">
            <p className="text-xs text-third font-semibold text-muted uppercase tracking-wider mb-2 px-2">
              Groups
            </p>
            <ul className="space-y-0.5">
              {loadingGroups ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="sm" />
                </div>
              ) : groups.length > 0 ? (
                groups.map((group) => (
                  <li key={group._id}>
                    <Link
                      href={`/dashboard/groups/${group._id}/dashboard`}
                      className="flex items-center gap-3 px-3 py-2.5 text-primary rounded-lg hover:bg-white/10 transition-colors"
                      onClick={onClose}
                    >
                      <img
                        src={group.coverPicture || "/banner.png"}
                        alt={group.name}
                        className="w-8 h-8 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium truncate text-primary">
                          {group.name}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted px-3 py-2">No groups found.</p>
              )}
            </ul>
          </div>

          <div
            className="
    h-1 
    bg-green-500 
    rounded-full
    shadow-2xl shadow-green-500/50
    my-3
    hover:scale-110
    active:scale-95
    transition-all duration-200
  "
          ></div>

          <ul className="space-y-0.5 flex-1">
            <li>
              <button
                onClick={() => {
                  setIsCreateGroupModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-primary rounded-lg hover:bg-white/10 transition-colors"
              >
                <IoAddCircleOutline className="w-5 h-5" />
                <span className="text-base font-medium">Create a Group</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsJoinGroupModalOpen(true);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-primary rounded-lg hover:bg-white/10 transition-colors"
              >
                <HiUserGroup className="w-5 h-5" />
                <span className="text-base font-medium">Join a Group</span>
              </button>
            </li>
            <li>
              <Link
                href="/dashboard/about"
                className="flex items-center gap-3 px-3 py-2.5 text-primary rounded-lg hover:bg-white/10 transition-colors"
                onClick={onClose}
              >
                <IoInformationCircleOutline className="w-5 h-5" />
                <span className="text-base font-medium">About</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-3 border-t border-border">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-primary rounded-lg hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <IoSettingsOutline className="w-5 h-5" />
            <span className="text-base font-medium">Settings</span>
          </Link>
        </div>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      {/* Join Group Modal */}
      <JoinGroupModal
        isOpen={isJoinGroupModalOpen}
        onClose={() => setIsJoinGroupModalOpen(false)}
        onGroupJoined={handleGroupJoined}
      />
    </>
  );
}
