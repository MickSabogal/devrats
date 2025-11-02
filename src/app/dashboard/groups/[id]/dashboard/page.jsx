"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TiPlus } from "react-icons/ti";
import { BiMenuAltLeft } from "react-icons/bi";
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

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/users/me");
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
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

        <div>
          <div className="flex items-center -m-2 mb-4">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <BiMenuAltLeft className="w-8 h-8 text-primary" />
            </button>
          </div>

          <h1 className="text-xl font-bold text-primary mb-4">
            {group?.name || "Group"}
          </h1>

          <GroupBanner
            user={user}
            group={group}
            onUpdate={fetchGroupAndPosts}
          />
          <div className="w-full text-center mt-4 mb-6">
            <p className="text-muted text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="bg-card rounded-lg p-8 text-center mt-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <TiPlus className="w-8 h-8 text-muted" />
                </div>
                <p className="text-secondary font-medium">No posts yet</p>
                <p className="text-muted text-sm">
                  Be the first to share something!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <EventCard
                  key={post._id}
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
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-6 bg-third text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 z-10 hover:rotate-90"
        >
          <TiPlus />
        </button>

        <BottomNavbar groupId={id} />

        <AddEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
          groupId={groupId}
        />
      </div>
    </div>
  );
}
