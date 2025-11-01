// src/app/dashboard/groups/[id]/details/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BiMenuAltLeft } from "react-icons/bi";
import Sidebar from "@/components/dashboard/sideBar";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FiUsers, FiSettings } from "react-icons/fi";

export default function GroupDetailsPage() {
  const params = useParams();
  const { id } = params;

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user
        const resUser = await fetch("/api/users/me");
        const userData = await resUser.json();
        setUser(userData.user);

        // Fetch group
        const resGroup = await fetch(`/api/group/${id}`);
        const groupData = await resGroup.json();
        
        if (resGroup.ok) {
          setGroup(groupData);
          setMembers(groupData.members || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getRoleBadge = (userId) => {
    if (group?.owner === userId) return "Owner";
    if (group?.admins?.includes(userId)) return "Admin";
    if (group?.moderators?.includes(userId)) return "Moderator";
    return "Member";
  };

  const getRoleColor = (role) => {
    const colors = {
      Owner: "bg-purple-500",
      Admin: "bg-red-500",
      Moderator: "bg-blue-500",
      Member: "bg-gray-500",
    };
    return colors[role];
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
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg"
          >
            <BiMenuAltLeft className="w-8 h-8 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Group Details</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Group Banner */}
        <div className="relative h-32 rounded-lg overflow-hidden mb-4">
          <img
            src={group?.banner || "/images/background.png"}
            alt={group?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h2 className="absolute bottom-2 left-4 text-white font-bold text-lg">
            {group?.name}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "info"
                ? "bg-green-500 text-primary"
                : "bg-[#1e2939] text-gray-400"
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "members"
                ? "bg-green-500 text-primary"
                : "bg-[#1e2939] text-gray-400"
            }`}
          >
            Members ({members.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === "info" && (
          <div className="space-y-4">
            <div className="bg-[#1e2939] rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Description</h3>
              <p className="text-gray-400 text-sm">
                {group?.description || "No description available."}
              </p>
            </div>

            <div className="bg-[#1e2939] rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Created</h3>
              <p className="text-gray-400 text-sm">
                {group?.createdAt
                  ? new Date(group.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown"}
              </p>
            </div>

            <div className="bg-[#1e2939] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">Privacy</h3>
                  <p className="text-gray-400 text-sm">
                    {group?.isPrivate ? "Private Group" : "Public Group"}
                  </p>
                </div>
                <FiSettings className="text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="space-y-3">
            {members.map((member) => {
              const role = getRoleBadge(member._id);
              const roleColor = getRoleColor(role);

              return (
                <div
                  key={member._id}
                  className="bg-[#1e2939] rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{member.name}</h4>
                      <p className="text-gray-400 text-sm">@{member.username}</p>
                    </div>
                  </div>
                  <span
                    className={`${roleColor} text-white text-xs px-3 py-1 rounded-full`}
                  >
                    {role}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <BottomNavbar groupId={id} />
      </div>
    </div>
  );
}