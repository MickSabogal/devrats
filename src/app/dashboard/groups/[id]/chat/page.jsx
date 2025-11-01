// src/app/dashboard/groups/[id]/chat/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BiMenuAltLeft } from "react-icons/bi";
import Sidebar from "@/components/dashboard/sideBar";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GroupChatPage() {
  const params = useParams();
  const { id } = params;

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg"
          >
            <BiMenuAltLeft className="w-8 h-8 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Group Chat</h1>
          <div className="w-10" />
        </div>

        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400">Chat coming soon...</p>
        </div>

        <BottomNavbar groupId={id} />
      </div>
    </div>
  );
}