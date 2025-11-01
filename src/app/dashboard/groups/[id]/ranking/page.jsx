// src/app/dashboard/groups/[id]/ranking/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoTrophy, IoTimeOutline } from "react-icons/io5";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";

export default function GroupRankingPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user
        const resUser = await fetch("/api/users/me");
        const userData = await resUser.json();
        setUser(userData.user);

        // Fetch group
        const resGroup = await fetch(`/api/group/${id}`);
        const groupData = await resGroup.json();
        setGroup(groupData);

        // Fetch ranking
        const resRanking = await fetch(`/api/group/${id}/ranking`);
        const rankingData = await resRanking.json();

        console.log("📊 Ranking data received:", rankingData);

        if (rankingData.success && rankingData.ranking) {
          setRanking(rankingData.ranking);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatTime = (minutes) => {
    if (minutes === 0) return "0m";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getMedalIcon = (index) => {
    switch(index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return null;
    }
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Ranking</h1>
          <div className="w-10" />
        </div>

        {/* Group Info */}
        <div className="bg-[#1e2939] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-lg">{group?.name}</h2>
              <p className="text-gray-400 text-sm">{ranking.length} members</p>
            </div>
            <IoTrophy className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Ranking List */}
        <div className="space-y-3">
          {ranking.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No activity yet. Be the first to post!</p>
            </div>
          ) : (
            ranking.map((member, index) => {
              const isCurrentUser = user?._id === member._id?.toString();
              const medal = getMedalIcon(index);

              return (
                <div
                  key={member._id}
                  className={`bg-[#1e2939] rounded-lg p-4 flex items-center gap-4 transition-all ${
                    isCurrentUser ? "ring-2 ring-red-600" : ""
                  }`}
                >
                  {/* Rank Number / Medal */}
                  <div className="text-2xl font-bold text-gray-400 w-12 text-center">
                    {medal || `#${index + 1}`}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                      {member.name}
                      {isCurrentUser && (
                        <span className="text-gray-400 text-xs ml-2">(You)</span>
                      )}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <IoTimeOutline className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">
                          {formatTime(member.studyMinutes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-sm">
                          {member.postCount} {member.postCount === 1 ? "post" : "posts"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <img src="/images/star.png" alt="Streak" className="w-5 h-5" />
                      <span className="text-green-500 font-bold">
                        {member.streak}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">streak</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <BottomNavbar groupId={id} currentPage="ranking" />
      </div>
    </div>
  );
}