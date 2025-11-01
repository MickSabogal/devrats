// src/app/dashboard/groups/[id]/ranking/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoTrophy } from "react-icons/io5";
import BottomNavbar from "@/components/dashboard/bottomNavBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

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

        const resUser = await fetch("/api/users/me");
        const userData = await resUser.json();
        setUser(userData.user);

        const resGroup = await fetch(`/api/group/${id}`);
        const groupData = await resGroup.json();
        setGroup(groupData);

        // Simular ranking por enquanto - você pode criar um endpoint específico
        const sortedMembers = [...(groupData.members || [])].sort(
          (a, b) => (b.studyTime || 0) - (a.studyTime || 0)
        );
        setRanking(sortedMembers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
        <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Ranking</h1>
          <div className="w-10" />
        </div>

        <div className="space-y-3">
          {ranking.map((member, index) => (
            <div
              key={member._id}
              className="bg-[#1e2939] rounded-lg p-4 flex items-center gap-4"
            >
              <div className="text-2xl font-bold text-gray-400 w-8">
                #{index + 1}
              </div>

              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h4 className="text-white font-medium">{member.name}</h4>
                <p className="text-gray-400 text-sm">
                  {member.studyTime || 0} hours studied
                </p>
              </div>

              {index === 0 && <IoTrophy className="text-yellow-400 w-6 h-6" />}
            </div>
          ))}
        </div>

        <BottomNavbar groupId={id} currentPage="ranking" />
      </div>
    </div>
  );
}
