"use client";

import React, { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { BiMenuAltLeft } from "react-icons/bi";
import Sidebar from "@/components/dashboard/sideBar";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import GroupBanner from "@/components/dashboard/GroupBanner";
import EventCard from "@/components/dashboard/eventCard";
import AddEventModal from "@/components/dashboard/addEventModal"


export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

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

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post");
        const data = await res.json();
        if (data.success) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUser();
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="bg-primary">
      <div className="max-w-md mx-auto relative min-h-screen px-6 pt-6 pb-28 overflow-hidden">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />

        <div>
          <div className="flex items-center -m-2">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
            >
              <BiMenuAltLeft className="w-8 h-8 text-white" />
            </button>
          </div>

          <h1 className="text-xl font-bold text-white my-2">DEVRATS</h1>

          <GroupBanner user={user} />

          <div className="w-full text-center mt-2 text-gray-400 text-xs">
            <small>Friday, Oct 24</small>
          </div>

          {posts.map((post) => (
            <EventCard
              key={post._id}
              user={post.user}
              eventTitle={post.title}
              eventImage={post.image}
              eventTime={new Date(post.createdAt).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            />
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-6 bg-white text-primary text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 z-10"
        >
          <TiPlus />
        </button>

        <BottomNavbar />

        <AddEventModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      </div>
    </div>
  );
}
