"use client";

import React, { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { BiMenuAltLeft } from "react-icons/bi";
import Sidebar from "@/components/dashboard/sideBar";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import GroupBanner from "@/components/dashboard/GroupBanner";
import EventCard from "@/components/dashboard/eventCard";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user data on component mount
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

  return (
    <div className="bg-primary">
      <div className="max-w-md mx-auto relative min-h-screen px-6 pt-6 pb-28 overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />

        {/* Main content */}
        <div>
          {/* Header */}
          <div className="flex items-center -m-2">
            {/* Menu button */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
            >
              <BiMenuAltLeft className="w-8 h-8 text-white" />
            </button>
          </div>

          <h1 className="text-xl font-bold text-white my-2">DEVRATS</h1>

          {/* Group Banner Component */}
          <GroupBanner user={user} />

          <div className="w-full text-center mt-2 text-gray-400 text-xs">
            <small>Friday, Oct 24</small>
          </div>

          {/* Event Card Component */}
          <EventCard
            user={user}
            eventTitle="DevRats Brainstorming"
            eventImage="/banner.png"
            eventTime="4:52 pm"
          />
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-24 right-6 bg-white text-primary text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 z-10">
          <TiPlus />
        </button>

        {/* Bottom Navbar Component */}
        <BottomNavbar />
      </div>
    </div>
  );
}
