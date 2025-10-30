"use client";

import React from "react";
import Avatar from "./UserAvatar";

export default function GroupBanner({ user }) {
  return (
    <div className="bg-secondary rounded-xl">
      <img
        src="/banner.png"
        alt="banner of the group"
        className="rounded-t-xl w-full h-auto"
      />
      <div className="flex justify-center gap-16 p-2">
        <div className="flex items-center">
          <Avatar src="/mock.png" name="Leader" size={24} />
          <div className="ml-2">
            <p className="text-xs">2</p>
            <p className="text-xs">Leader</p>
          </div>
        </div>

        <div className="flex items-center">
          <Avatar src={user?.avatar} name={user?.name} size={24} />
          <div className="ml-2">
            <p className="text-xs">{user?.streak || 0}</p>
            <p className="text-xs">You</p>
          </div>
        </div>
      </div>
    </div>
  );
}