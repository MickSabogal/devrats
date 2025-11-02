"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import Link from "next/link";
import Sidebar from "@/components/dashboard/sideBar";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import CreateGroupModal from "@/components/dashboard/CreateGroupModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";

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
        const [resUser, resGroups] = await Promise.all([
          fetch("/api/users/me"),
          fetch("/api/group"),
        ]);

        if (resUser.ok) {
          const dataUser = await resUser.json();
          setUser(dataUser.user);
        }

        if (resGroups.ok) {
          const groupsData = await resGroups.json();
          if (Array.isArray(groupsData)) {
            setGroups(groupsData);
            
            if (groupsData.length === 0) {
              router.replace("/dashboard/onboarding");
              return;
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndGroups();
  }, [router]);

  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
    router.push(`/dashboard/groups/${newGroup._id}/dashboard`);
  };

  if (loading) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary">
      <div className="max-w-md mx-auto relative min-h-screen px-6 pt-6 pb-28">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />

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

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Welcome back, {user?.name || "User"}!
          </h2>
          <p className="text-gray-300 text-sm">
            You have {groups.length} group{groups.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Your Groups
          </h3>
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

        <div className="space-y-3">
          <Button
            fullWidth
            variant="primary"
            icon={IoAddCircleOutline}
            onClick={() => setIsCreateGroupModalOpen(true)}
          >
            Create a Group
          </Button>

          <Button
            fullWidth
            variant="outline"
            icon={HiUserGroup}
            onClick={() => router.push("/dashboard/join-group")}
          >
            Join a Group
          </Button>
        </div>
        <CreateGroupModal
          isOpen={isCreateGroupModalOpen}
          onClose={() => setIsCreateGroupModalOpen(false)}
          onGroupCreated={handleGroupCreated}
        />
      </div>
    </div>
  );
}