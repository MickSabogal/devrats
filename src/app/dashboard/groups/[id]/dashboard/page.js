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

export default function GroupDashboard() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id;

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount
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

  // Fetch specific group and its posts
  useEffect(() => {
    const fetchGroupAndPosts = async () => {
      if (!groupId) return;

      try {
        setLoading(true);

        // Fetch specific group
        const resGroup = await fetch(`/api/group/${groupId}`);
        const groupData = await resGroup.json();

        if (resGroup.ok) {
          setGroup(groupData);

          // Fetch posts for this group
          const resPosts = await fetch(`/api/group/${groupId}/post`);
          const postsData = await resPosts.json();

          if (resPosts.ok && postsData.success) {
            setPosts(postsData.data || []);
          }
        } else {
          console.error("Group not found");
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

  // Add a new post to the top of the list
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  if (loading) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <p className="text-white">Loading group...</p>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <div className="max-w-md mx-auto relative min-h-screen px-6 pt-6 pb-28 overflow-hidden">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />

        <div>
          {/* Sidebar open button */}
          <div className="flex items-center -m-2">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
            >
              <BiMenuAltLeft className="w-8 h-8 text-white" />
            </button>
          </div>

          {/* Group name */}
          <h1 className="text-xl font-bold text-white my-2">
            {group?.name || "Group"}
          </h1>

          {/* Group banner (cover image and info) */}
          <GroupBanner
            user={user}
            group={group}
            coverPicture={group?.coverPicture}
            description={group?.description}
          />

          {/* Current date */}
          <div className="w-full text-center mt-2 text-gray-400 text-xs">
            <small>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </small>
          </div>

          {/* Event cards / posts */}
          {posts.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p>No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <EventCard
                key={post._id}
                user={post.user}
                eventTitle={post.title}
                eventImage={post.image}
                eventTime={new Date(post.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              />
            ))
          )}
        </div>

        {/* Floating "Add Event" button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-6 bg-white text-primary text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 z-10"
        >
          <TiPlus />
        </button>

        <BottomNavbar />

        {/* Add Event Modal */}
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