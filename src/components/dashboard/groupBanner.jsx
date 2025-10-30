"use client";

import React from "react";
import Avatar from "./UserAvatar";

export default function GroupBanner({ user, coverPicture, description, group }) {
  // O admin do grupo é o "leader"
  const leader = group?.admin;
  const membersCount = group?.members?.length || 0;

  return (
    <div className="bg-secondary rounded-xl overflow-hidden">
      {/* imagem de capa */}
      <img
        src={coverPicture || "/banner.png"}
        alt="banner of the group"
        className="rounded-t-xl w-full h-auto object-cover max-h-40"
      />

      <div className="flex justify-center gap-16 p-2">
        {/* Líder do grupo */}
        <div className="flex items-center">
          <Avatar
            src={leader?.avatar || "/mock.png"}
            name={leader?.name || "Leader"}
            size={24}
          />
          <div className="ml-2">
            <p className="text-xs">{membersCount}</p>
            <p className="text-xs">Leader</p>
          </div>
        </div>

        {/* Usuário atual */}
        <div className="flex items-center">
          <Avatar src={user?.avatar} name={user?.name} size={24} />
          <div className="ml-2">
            <p className="text-xs">{user?.streak || 0}</p>
            <p className="text-xs">You</p>
          </div>
        </div>
      </div>

      {/* Descrição do grupo, opcional */}
      {description && (
        <p className="text-center text-xs text-gray-300 px-4 pb-2">
          {description}
        </p>
      )}
    </div>
  );
}
