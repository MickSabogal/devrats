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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e2939] shadow-lg border-t border-gray-200 dark:border-gray-700/50 z-20">
      <div className="max-w-md mx-auto px-6 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.name.toLowerCase();

            return isActive ? (
              <div
                key={item.name}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg cursor-not-allowed"
              >
                <Icon className="w-6 h-6 text-red-600" />
                <span className="text-xs font-medium text-red-600">{item.name}</span>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors group"
              >
                <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-[#0B111c] dark:group-hover:text-white transition-colors" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-[#0B111c] dark:group-hover:text-white transition-colors">
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