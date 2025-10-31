"use client";

import React from "react";
import Avatar from "./UserAvatar";

export default function GroupBanner({ user, group }) {
  // Find the member with the highest streak (leader)
  const getLeader = () => {
    if (!group?.members || group.members.length === 0) {
      return null;
    }

    // Create array with all members including admin
    const allMembers = group.members.map(m => m.user).filter(Boolean);
    
    // Find member with highest streak
    const leader = allMembers.reduce((prev, current) => {
      return (current.streak || 0) > (prev.streak || 0) ? current : prev;
    }, allMembers[0]);

    return leader;
  };

  const leader = getLeader();
  const membersCount = group?.members?.length || 0;
  const coverPicture = group?.coverPicture || "/banner.png";
  const description = group?.description;

  return (
    <div className="bg-secondary rounded-xl overflow-hidden">
      {/* Cover image */}
      <img
        src={coverPicture}
        alt="Group banner"
        className="rounded-t-xl w-full h-auto object-cover max-h-40"
      />

      <div className="flex justify-center gap-16 p-2">
        {/* Group leader (highest streak) */}
        {leader && (
          <div className="flex items-center">
            <Avatar
              src={leader.avatar || "/mock.png"}
              name={leader.name || "Leader"}
              size={24}
            />
            <div className="ml-2">
              <p className="text-xs font-semibold">{leader.streak || 0}</p>
              <p className="text-xs text-gray-400">Leader</p>
            </div>
          </div>
        )}

        {/* Current user */}
        {user && (
          <div className="flex items-center">
            <Avatar 
              src={user.avatar || "/mock.png"} 
              name={user.name} 
              size={24} 
            />
            <div className="ml-2">
              <p className="text-xs font-semibold">{user.streak || 0}</p>
              <p className="text-xs text-gray-400">You</p>
            </div>
          </div>
        )}
      </div>

      {/* Group description (optional) */}
      {description && (
        <p className="text-center text-xs text-gray-300 px-4 pb-2">
          {description}
        </p>
      )}

      {/* Members count */}
      <p className="text-center text-xs text-gray-400 pb-2">
        {membersCount} {membersCount === 1 ? "member" : "members"}
      </p>
    </div>
  );
}