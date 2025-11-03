"use client";

import React from "react";
import Link from "next/link";
import { IoTrophy, IoDocumentTextOutline, IoChatbubbleOutline } from "react-icons/io5";

export default function BottomNavbar({ groupId, currentPage }) {
  const navItems = [
    { name: "Details", href: `/dashboard/groups/${groupId}/details`, icon: IoDocumentTextOutline },
    { name: "Ranking", href: `/dashboard/groups/${groupId}/ranking`, icon: IoTrophy },
    { name: "Chat", href: `/dashboard/groups/${groupId}/chat`, icon: IoChatbubbleOutline },
  ];

  return (
    <nav className="max-w-[430px] fixed bottom-0 left-1/2 -translate-x-1/2 bg-card shadow-lg border-t border-custom z-20 w-full">
      <div className="max-w-[430px] mx-auto px-6 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.name.toLowerCase();

            return isActive ? (
              <div
                key={item.name}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg cursor-not-allowed"
              >
                <Icon className="w-6 h-6 text-third" />
                <span className="text-xs font-medium text-third">{item.name}</span>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-card-hover transition-colors-smooth group"
              >
                <Icon className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-secondary group-hover:text-primary transition-colors">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}