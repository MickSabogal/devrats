"use client";

import React from "react";
import Link from "next/link";
import { IoClose, IoSettingsOutline, IoAddCircleOutline, IoTrophy } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import Avatar from "./UserAvatar";

export default function Sidebar({ isOpen, onClose, user }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm transition-all duration-300"
        />
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 z-30 w-64 h-full bg-white dark:bg-[#1e2939] shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <IoClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* User Profile Section */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
            onClick={onClose}
          >
            <Avatar src={user?.avatar} name={user?.name} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || "Loading..."}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                View profile
              </p>
            </div>
          </Link>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100%-260px)] overflow-y-auto px-3">
          {/* Groups Section */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              Groups
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors group"
                  onClick={onClose}
                >
                  <img
                    src="/banner.png"
                    alt="DevRatinhos"
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      DevRatinhos
                    </p>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors group"
                  onClick={onClose}
                >
                  <img
                    src="/banner.png"
                    alt="DevRatinhos 2"
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      DevRatinhos 2
                    </p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-700/50 my-3"></div>

          {/* Action Buttons Section */}
          <div className="flex-1">
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/dashboard/create-group"
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors"
                  onClick={onClose}
                >
                  <IoAddCircleOutline className="w-5 h-5" />
                  <span className="text-sm font-medium">Create a Group</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/join-group"
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors"
                  onClick={onClose}
                >
                  <HiUserGroup className="w-5 h-5" />
                  <span className="text-sm font-medium">Join a Group</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/challenges"
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors"
                  onClick={onClose}
                >
                  <IoTrophy className="w-5 h-5" />
                  <span className="text-sm font-medium">Challenges</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700/50">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors"
            onClick={onClose}
          >
            <IoSettingsOutline className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
}