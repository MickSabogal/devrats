"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProfileStats({ user }) {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalStudyTime = async () => {
      try {
        const response = await fetch("/api/users/study-time");

        if (response.ok) {
          const data = await response.json();
          setTotalMinutes(data.totalMinutes || 0);
        }
      } catch (error) {
        return;
      } finally {
        setLoading(false);
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
      <div className="bg-secondary rounded-2xl px-4 py-3 text-center shadow-lg border border-gray-800 flex-1">
        <p className="text-white text-xl font-bold">{user?.streak || 0}</p>
        <p className="text-gray-400 text-xs">Check-ins</p>
      </div>

      <div className="bg-secondary rounded-2xl px-4 py-3 text-center shadow-lg border border-gray-800 flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-7">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <p
            className={`text-white font-bold ${
              formatTime(totalMinutes).length > 5 ? "text-base" : "text-xl"
            }`}
          >
            {formatTime(totalMinutes)}
          </p>
        )}
        <p className="text-gray-400 text-xs">Time active</p>
      </div>
    </div>
  );
}
