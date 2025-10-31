"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import Link from "next/link";
import Sidebar from "@/components/dashboard/sideBar";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import CreateGroupModal from "@/components/dashboard/CreateGroupModal";

export default function DashboardHome() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndGroups = async () => {
      try {
        // Fetch user
        const resUser = await fetch("/api/users/me");
        const dataUser = await resUser.json();
        setUser(dataUser.user);

        // Fetch groups
        const resGroups = await fetch("/api/group");
        const groupsData = await resGroups.json();

        if (Array.isArray(groupsData)) {
          setGroups(groupsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndGroups();
  }, []);

  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
    // Redirect to the new group
    router.push(`/dashboard/groups/${newGroup._id}/dashboard`);
  };

  if (loading) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <div className="max-w-md mx-auto relative min-h-screen px-6 pt-6 pb-28">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
          >
            <BiMenuAltLeft className="w-8 h-8 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <div className="w-10"></div>
        </div>

        {/* Welcome message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Welcome back, {user?.name || "User"}!
          </h2>
          <p className="text-gray-300 text-sm">
            {groups.length > 0
              ? `You have ${groups.length} group${groups.length > 1 ? "s" : ""}`
              : "Get started by creating or joining a group"}
          </p>
        </div>

        {/* Groups list */}
        {groups.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Groups</h3>
            <div className="space-y-3">
              {groups.map((group) => (
                <Link
                  key={group._id}
                  href={`/dashboard/groups/${group._id}/dashboard`}
                  className="block bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={group.coverPicture || "/banner.png"}
                      alt={group.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-lg truncate">
                        {group.name}
                      </h4>
                      {group.description && (
                        <p className="text-gray-300 text-sm truncate">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <HiUserGroup className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No groups yet
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                Create your first group or join an existing one to get started
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="w-full bg-white text-primary font-medium py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
          >
            <IoAddCircleOutline className="w-6 h-6" />
            <span>Create a Group</span>
          </button>

          <Link
            href="/dashboard/join-group"
            className="w-full bg-white/10 backdrop-blur-sm text-white font-medium py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white/20 transition-colors"
          >
            <HiUserGroup className="w-6 h-6" />
            <span>Join a Group</span>
          </Link>
        </div>

        <BottomNavbar />

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={isCreateGroupModalOpen}
          onClose={() => setIsCreateGroupModalOpen(false)}
          onGroupCreated={handleGroupCreated}
        />
      </div>
    </div>
  );
}  
