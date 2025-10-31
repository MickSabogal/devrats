// src/components/profile/ProfileStats.jsx
"use client";

import { useState, useEffect } from "react";

export default function ProfileStats({ user }) {
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    const fetchTotalStudyTime = async () => {
      if (!user?._id) return;
      
      try {
        const response = await fetch(`/api/users/${user._id}/study-time`);
        const data = await response.json();
        
        if (response.ok) {
          setTotalMinutes(data.totalMinutes || 0);
        }
      } catch (error) {
        console.error("Error fetching study time:", error);
      }
    };

    fetchTotalStudyTime();
  }, [user]);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex gap-3 flex-1">
      <div className="bg-gray-700 rounded-2xl px-4 py-3 text-center shadow-lg border border-gray-800 flex-1">
        <p className="text-white text-xl font-bold">{user?.streak || 0}</p>
        <p className="text-gray-400 text-xs">Check-ins</p>
      </div>

      <div className="bg-gray-700 rounded-2xl px-4 py-3 text-center shadow-lg border border-gray-800 flex-1">
        <p className="text-white text-xl font-bold">{formatTime(totalMinutes)}</p>
        <p className="text-gray-400 text-xs">Time active</p>
      </div>
    </div>
  );
}