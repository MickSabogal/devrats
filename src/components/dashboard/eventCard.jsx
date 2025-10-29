"use client";

import React from "react";
import Avatar from "./UserAvatar";

export default function EventCard({ user, eventTitle, eventImage, eventTime }) {
  return (
    <div className="bg-secondary rounded-xl mt-2 p-2 flex items-center">
      <img
        src={eventImage || "/banner.png"}
        alt="event picture"
        className="w-14 h-14 rounded-full"
      />
      <div className="ml-2 w-full">
        <p className="text-sm font-sans mb-2">{eventTitle || "Event Title"}</p>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Avatar src={user?.avatar} name={user?.name} size={24} />
            <p className="text-xs ml-1">{user?.name}</p>
          </div>
          <small className="text-xs text-gray-400">{eventTime || "Now"}</small>
        </div>
      </div>
    </div>
  );
}