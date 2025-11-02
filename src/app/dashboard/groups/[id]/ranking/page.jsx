// src/app/dashboard/groups/[id]/ranking/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoTrophy, IoTimeOutline, IoArrowBack, IoFlameOutline } from "react-icons/io5";
import { FiAward } from "react-icons/fi";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GroupRankingPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("weekly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resUser = await fetch("/api/users/me");
        const userData = await resUser.json();
        setUser(userData.user);

        const resGroup = await fetch(`/api/group/${id}`);
        const groupData = await resGroup.json();
        setGroup(groupData);

        const resRanking = await fetch(`/api/group/${id}/ranking`);
        const rankingData = await resRanking.json();

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

  const getMedalGradient = (index) => {
    switch(index) {
      case 0:
        return "from-yellow-400 to-yellow-600";
      case 1:
        return "from-gray-300 to-gray-500";
      case 2:
        return "from-orange-400 to-orange-600";
      default:
        return "";
    }
  };

  const getPodiumHeight = (index) => {
    switch(index) {
      case 0: return "h-32";
      case 1: return "h-24";
      case 2: return "h-20";
      default: return "h-0";
    }
  };

  const topThree = ranking.slice(0, 3);
  const restOfRanking = ranking.slice(3);

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
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push(`/dashboard/groups/${id}/dashboard`)}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <IoArrowBack className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-bold text-primary">Leaderboard</h1>
          <div className="w-10" />
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTimePeriod("daily")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              timePeriod === "daily"
                ? "bg-third text-white"
                : "bg-card text-secondary hover:bg-card-hover"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimePeriod("weekly")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              timePeriod === "weekly"
                ? "bg-third text-white"
                : "bg-card text-secondary hover:bg-card-hover"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimePeriod("alltime")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              timePeriod === "alltime"
                ? "bg-third text-white"
                : "bg-card text-secondary hover:bg-card-hover"
            }`}
          >
            All time
          </button>
        </div>

        {ranking.length === 0 ? (
          <div className="text-center text-muted py-8">
            <FiAward className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No activity yet. Be the first to post!</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <div className="mb-8">
                <div className="flex items-end justify-center gap-2 mb-4">
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <div className="flex flex-col items-center flex-1">
                      <div className="relative mb-3">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-400 bg-gray-700">
                          {topThree[1].avatar ? (
                            <img
                              src={topThree[1].avatar}
                              alt={topThree[1].name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-2xl">
                              {topThree[1].name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-gray-300 to-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                          2
                        </div>
                      </div>
                      <p className="text-primary font-semibold text-sm truncate w-full text-center mb-1">
                        {topThree[1].name}
                      </p>
                      <p className="text-third font-bold text-lg">
                        {formatTime(topThree[1].studyMinutes)}
                      </p>
                      <div className={`w-full ${getPodiumHeight(1)} bg-gradient-to-br from-gray-300/20 to-gray-500/20 rounded-t-lg mt-2 flex items-center justify-center`}>
                        <FiAward className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {topThree[0] && (
                    <div className="flex flex-col items-center flex-1">
                      <div className="relative mb-3">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 bg-gray-700">
                          {topThree[0].avatar ? (
                            <img
                              src={topThree[0].avatar}
                              alt={topThree[0].name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-2xl">
                              {topThree[0].name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <IoTrophy className="w-8 h-8 text-yellow-400" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                          1
                        </div>
                      </div>
                      <p className="text-primary font-semibold text-sm truncate w-full text-center mb-1">
                        {topThree[0].name}
                      </p>
                      <p className="text-third font-bold text-xl">
                        {formatTime(topThree[0].studyMinutes)}
                      </p>
                      <div className={`w-full ${getPodiumHeight(0)} bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-t-lg mt-2 flex items-center justify-center`}>
                        <FiAward className="w-10 h-10 text-yellow-400" />
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <div className="flex flex-col items-center flex-1">
                      <div className="relative mb-3">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-400 bg-gray-700">
                          {topThree[2].avatar ? (
                            <img
                              src={topThree[2].avatar}
                              alt={topThree[2].name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-2xl">
                              {topThree[2].name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-orange-400 to-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                          3
                        </div>
                      </div>
                      <p className="text-primary font-semibold text-sm truncate w-full text-center mb-1">
                        {topThree[2].name}
                      </p>
                      <p className="text-third font-bold text-lg">
                        {formatTime(topThree[2].studyMinutes)}
                      </p>
                      <div className={`w-full ${getPodiumHeight(2)} bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-t-lg mt-2 flex items-center justify-center`}>
                        <FiAward className="w-8 h-8 text-orange-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rest of Rankings */}
            {restOfRanking.length > 0 && (
              <div className="space-y-2">
                {restOfRanking.map((member, idx) => {
                  const actualIndex = idx + 3;
                  const isCurrentUser = user?._id === member._id?.toString();

                  return (
                    <div
                      key={member._id}
                      className={`bg-card rounded-xl p-4 flex items-center gap-3 transition-all hover:bg-card-hover ${
                        isCurrentUser ? "ring-2 ring-third" : ""
                      }`}
                    >
                      <div className="text-lg font-bold w-8 text-center text-muted">
                        {actualIndex + 1}
                      </div>

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

                      <div className="flex-1 min-w-0">
                        <h4 className="text-primary font-medium truncate">
                          {member.name}
                          {isCurrentUser && (
                            <span className="text-muted text-xs ml-2">(You)</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-1">
                          <IoFlameOutline className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-500 text-sm font-semibold">
                            {member.streak} day streak
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-third font-bold text-lg">
                          {formatTime(member.studyMinutes)}
                        </p>
                        <p className="text-muted text-xs">
                          {member.postCount} {member.postCount === 1 ? "post" : "posts"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <BottomNavbar groupId={id} currentPage="ranking" />
      </div>
    </div>
  );
}