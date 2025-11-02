// src/app/dashboard/groups/[id]/details/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  IoArrowBack, 
  IoSettingsOutline,
  IoLinkOutline,
  IoPersonOutline
} from "react-icons/io5";
import { FiUsers, FiCalendar } from "react-icons/fi";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

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
          setGroup(groupData);
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

  const getRoleBadge = (memberId) => {
    if (group?.admin._id === memberId) return "Admin";
    const member = group?.members.find((m) => m.user._id === memberId);
    return member?.role === "admin" ? "Admin" : "Member";
  };

  const getRoleColor = (role) => {
    return role === "Admin" ? "bg-red-500" : "bg-gray-500";
  };

  const isAdmin = user && group && group.admin._id === user._id;

  const handleRemoveMember = async (memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const res = await fetch(`/api/group/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove-member",
          memberId: memberId,
        }),
      });

      if (res.ok) {
        const updatedGroup = await res.json();
        setGroup(updatedGroup);
      } else {
        alert("Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Error removing member");
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
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push(`/dashboard/groups/${id}/dashboard`)}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <IoArrowBack className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Group Details</h1>
          {isAdmin && (
            <button
              onClick={() => router.push(`/dashboard/groups/${id}/settings`)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <IoSettingsOutline className="w-6 h-6 text-white" />
            </button>
          )}
          {!isAdmin && <div className="w-10" />}
        </div>

        <div className="relative h-40 rounded-lg overflow-hidden mb-6">
          <img
            src={group?.coverPicture || "/images/background.png"}
            alt={group?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-white font-bold text-2xl mb-1">
              {group?.name}
            </h2>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <FiUsers className="w-4 h-4" />
              <span>{group?.members?.length || 0} members</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              activeTab === "info"
                ? "bg-third text-white shadow-third"
                : "bg-card text-secondary hover:bg-card-hover"
            }`}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              activeTab === "members"
                ? "bg-third text-white shadow-third"
                : "bg-card text-secondary hover:bg-card-hover"
            }`}
          >
            Members ({group?.members?.length || 0})
          </button>
        </div>

        {activeTab === "info" && (
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-4">
              <h3 className="text-primary font-semibold mb-3 flex items-center gap-2">
                Description
              </h3>
              <p className="text-secondary text-sm leading-relaxed">
                {group?.description || "No description available."}
              </p>
            </div>

            <div className="bg-card rounded-lg p-4">
              <h3 className="text-primary font-semibold mb-3 flex items-center gap-2">
                <IoPersonOutline className="w-5 h-5 text-third" />
                Admin
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                  {group?.admin?.avatar ? (
                    <img
                      src={group.admin.avatar}
                      alt={group.admin.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
                      {group?.admin?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-primary font-medium">{group?.admin?.name}</p>
                  <p className="text-muted text-sm">Group creator</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4">
              <h3 className="text-primary font-semibold mb-3 flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-third" />
                Created
              </h3>
              <p className="text-secondary text-sm">
                {group?.createdAt
                  ? new Date(group.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown"}
              </p>
            </div>

            {isAdmin && (
              <div className="bg-card rounded-lg p-4">
                <h3 className="text-primary font-semibold mb-3 flex items-center gap-2">
                  <IoLinkOutline className="w-5 h-5 text-third" />
                  Invite Code
                </h3>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-primary px-3 py-2 rounded text-third font-mono text-sm">
                    {group?.inviteToken}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/api/group/join/${group?.inviteToken}`
                      );
                      alert("Invite link copied!");
                    }}
                    className="bg-third text-white px-4 py-2 rounded hover-bg-third hover:opacity-90 transition-all text-sm font-medium"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className="space-y-3">
            {group?.members?.map((member) => {
              const role = getRoleBadge(member.user._id);
              const roleColor = getRoleColor(role);
              const isCurrentUser = user?._id === member.user._id;

              return (
                <div
                  key={member.user._id}
                  className="bg-card rounded-lg p-4 flex items-center justify-between hover:bg-card-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                      {member.user.avatar ? (
                        <img
                          src={member.user.avatar}
                          alt={member.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
                          {member.user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-primary font-medium">
                        {member.user.name}
                        {isCurrentUser && (
                          <span className="text-muted text-xs ml-2">
                            (You)
                          </span>
                        )}
                      </h4>
                      <p className="text-muted text-xs">
                        Joined{" "}
                        {new Date(member.joinedAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`${roleColor} text-white text-xs px-3 py-1 rounded-full font-medium`}
                    >
                      {role}
                    </span>
                    {isAdmin && member.user._id !== group.admin._id && (
                      <button
                        onClick={() => handleRemoveMember(member.user._id)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 hover:bg-red-500/10 rounded transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <BottomNavbar groupId={id} currentPage="details" />
      </div>
    </div>
  );
}