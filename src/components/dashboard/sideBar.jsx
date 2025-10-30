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
          className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300"
        />
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 z-50 w-80 h-full bg-white dark:bg-primary shadow-2xl transform transition-transform duration-300 ease-out ${
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
              <IoClose className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* User Profile Section */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50/10 dark:hover:bg-gray-700/30 transition-colors group"
            onClick={onClose}
          >
            <Avatar src={user?.avatar} name={user?.name} size={76} />
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-white truncate">
                {user?.name || "Loading..."}
              </p>
              <p className="text-sm text-gray-300 dark:text-gray-300">
                View profile
              </p>
            </div>
          </Link>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100%-260px)] overflow-y-auto px-3">
          {/* Groups Section */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 px-2">
              Groups
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 text-white rounded-lg hover:bg-gray-100/10 dark:hover:bg-gray-700/40 transition-colors group"
                  onClick={onClose}
                >
                  <img
                    src="/banner.png"
                    alt="DevRatinhos"
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium truncate text-white">
                      DevRatinhos
                    </p>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 text-white rounded-lg hover:bg-gray-100/10 dark:hover:bg-gray-700/40 transition-colors group"
                  onClick={onClose}
                >
                  <img
                    src="/banner.png"
                    alt="DevRatinhos 2"
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium truncate text-white">
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
                  className="flex items-center gap-3 px-3 py-2.5 text-white rounded-lg hover:bg-gray-100/10 dark:hover:bg-gray-700/40 transition-colors"
                  onClick={onClose}
                >
                  <IoAddCircleOutline className="w-5 h-5" />
                  <span className="text-base font-medium">Create a Group</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/join-group"
                  className="flex items-center gap-3 px-3 py-2.5 text-white rounded-lg hover:bg-gray-100/10 dark:hover:bg-gray-700/40 transition-colors"
                  onClick={onClose}
                >
                  <HiUserGroup className="w-5 h-5" />
                  <span className="text-base font-medium">Join a Group</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/challenges"
                  className="flex items-center gap-3 px-3 py-2.5 text-white rounded-lg hover:bg-gray-100/10 dark:hover:bg-gray-700/40 transition-colors"
                  onClick={onClose}
                >
                  <IoTrophy className="w-5 h-5" />
                  <span className="text-base font-medium">Challenges</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200  dark:border-gray-700/50">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-white rounded-lg hover:bg-gray-100/10 dark:hover:bg-gray-700/40 transition-colors"
            onClick={onClose}
          >
            <IoSettingsOutline className="w-5 h-5" />
            <span className="text-base font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
}
