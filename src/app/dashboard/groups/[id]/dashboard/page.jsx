"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TiPlus } from "react-icons/ti";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoFlashOutline } from "react-icons/io5";
import Sidebar from "@/components/dashboard/sideBar";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import GroupBanner from "@/components/dashboard/groupBanner";
import EventCard from "@/components/dashboard/eventCard";
import AddEventModal from "@/components/dashboard/addEventModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GroupDashboard() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id;
  const { id } = params;

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotateButton, setRotateButton] = useState(false);

  const groupStreak = user?.groupStreaks?.[groupId]?.streak || 0;

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/users/me");
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchGroupAndPosts = async () => {
    if (!groupId) return;

    try {
      setLoading(true);

      const resGroup = await fetch(`/api/group/${groupId}`);
      const groupData = await resGroup.json();

      if (resGroup.ok) {
        setGroup(groupData);

        const resPosts = await fetch(`/api/group/${groupId}/post`);
        const postsData = await resPosts.json();

        if (resPosts.ok && postsData.success) {
          setPosts(postsData.posts || []);
        } else {
          setPosts([]);
        }
      } else {
        router.push("/dashboard/home");
      }
    } catch (error) {
      console.error("Error fetching group:", error);
      router.push("/dashboard/home");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchGroupAndPosts();
  }, [groupId, router]);

  const handlePostCreated = async (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    await fetchUser();
  };

  const handlePostDeleted = async (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    await fetchUser();
  };

  const handleAddClick = () => {
    setRotateButton(true);
    setTimeout(() => {
      setRotateButton(false);
      setIsModalOpen(true);
    }, 300);
  };

  if (loading) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-primary to-gray-900 min-h-screen">
      <div className="max-w-md mx-auto relative min-h-screen px-6 pt-6 pb-28">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105"
          >
            <BiMenuAltLeft className="w-8 h-8 text-white" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-third/20 to-emerald-500/20 border border-third/30">
            <IoFlashOutline className="w-5 h-5 text-third" />
            <span className="text-white font-bold">{groupStreak}</span>
            <span className="text-gray-400 text-sm">streak</span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent mb-2">
            {group?.name || "Group"}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-third to-emerald-500 rounded-full" />
        </div>

        <GroupBanner user={user} group={group} onUpdate={fetchGroupAndPosts} />

        <div className="w-full text-center mt-6 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-third animate-pulse" />
            <p className="text-gray-300 text-sm font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-third/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-800/50 border border-third/30 rounded-2xl p-8 text-center backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-third/30 rounded-full blur-lg animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold text-xl">No posts yet</p>
                  <p className="text-gray-300 text-sm max-w-xs">
                    Be the first to share your coding journey!
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-third/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-third" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-third/50" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post._id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-third/0 via-third/5 to-third/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                <div className="relative">
                  <EventCard
                    user={post.user || { name: "Unknown User", avatar: null }}
                    eventTitle={post.title}
                    eventImage={post.image}
                    eventTime={
                      post.createdAt
                        ? new Date(post.createdAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "Unknown time"
                    }
                    postId={post._id}
                    onDelete={handlePostDeleted}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-20 flex justify-end px-6">
        <div className="absolute bottom-0 right-6 bg-third/50 rounded-full blur-xl animate-pulse w-16 h-16" />
        <button
          onClick={handleAddClick}
          className={`relative bg-gradient-to-br from-third to-emerald-600 text-white text-3xl w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-third/50 hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/20 ${
            rotateButton ? "animate-spin-once" : ""
          }`}
        >
          <TiPlus />
        </button>
      </div>

      <BottomNavbar groupId={id} />

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
        groupId={groupId}
      />

      <style jsx>{`
        @keyframes spin-once {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(90deg);
          }
        }
        .animate-spin-once {
          animation: spin-once 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
