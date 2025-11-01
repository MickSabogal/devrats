"use client";

import React from "react";
import Link from "next/link";
import { IoTrophy, IoDocumentTextOutline, IoChatbubbleOutline } from "react-icons/io5";

export default function BottomNavbar({ groupId }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e2939] shadow-lg border-t border-gray-200 dark:border-gray-700/50 z-20">
      <div className="max-w-md mx-auto px-6 py-3">
        <div className="flex justify-around items-center">
          {/* Details */}
          <Link
            href={`/dashboard/groups/${groupId}/details`}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors group"
          >
            <IoDocumentTextOutline className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-[#0B111c] dark:group-hover:text-white transition-colors" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-[#0B111c] dark:group-hover:text-white transition-colors">
              Details
            </span>
          </Link>

          {/* Ranking */}
          <Link
            href={`/dashboard/groups/${groupId}/ranking`}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors group"
          >
            <IoTrophy className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-[#0B111c] dark:group-hover:text-white transition-colors" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-[#0B111c] dark:group-hover:text-white transition-colors">
              Ranking
            </span>
          </Link>

          {/* Chat */}
          <Link
            href={`/dashboard/groups/${groupId}/chat`}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors group"
          >
            <IoChatbubbleOutline className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-[#0B111c] dark:group-hover:text-white transition-colors" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-[#0B111c] dark:group-hover:text-white transition-colors">
              Chat
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}