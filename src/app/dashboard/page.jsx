"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoMenuSharp } from "react-icons/io5";
import { TiPlus } from "react-icons/ti";
import { BiMenuAltLeft } from "react-icons/bi";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-primary">
      <div className="max-w-md mx-auto relative min-h-screen px-6 pt-6 pb-20 overflow-hidden">
        {/* Overlay — closes when clicking outside */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 z-20"
          />
        )}

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 z-30 w-56 h-full p-4 overflow-y-auto bg-white dark:bg-primary rounded-r-2xl shadow-lg transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4"></div>

          {/* Items */}
          <ul className="font-medium">
            <li>
              <Link
                href="/dashboard/profile"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-1">
                  <img
                    src={user?.avatar || "/mock.png"}
                    alt="User profile pic"
                    className="w-8 h-8 rounded-full object-cover object-center"
                    onError={(e) => { e.currentTarget.src = "/mock.png"; }}
                  />
                  <p className="text-sm">{user?.name || "Guilherme França"}</p>
                </div>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  src="/banner.png"
                  alt="to be replaced"
                  className="w-8 h-8 rounded-full"
                  onError={(e) => { e.currentTarget.src = "/mock.png"; }}
                />
                <p className="ml-3">DevRatinhos</p>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  src="/banner.png"
                  alt="to be replaced"
                  className="w-8 h-8 rounded-full"
                  onError={(e) => { e.currentTarget.src = "/mock.png"; }}
                />
                <p className="ml-3">DevRatinhos 2</p>
              </Link>
            </li>
          </ul>
        </div>

        {/* Main content */}
        <div>
          {/* Header */}
          <div className="flex items-center -m-2">
            {/* Menu button */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10"
            >
              <BiMenuAltLeft className="w-8 h-8 text-white" />
            </button>
          </div>

          <h1 className="text-xl font-bold text-white my-2">DEVRATS</h1>

          {/* Group Card */}
          <div className="bg-secondary rounded-xl">
            <img
              src="/banner.png"
              alt="banner of the group"
              className="rounded-t-xl w-full h-auto"
              onError={(e) => { e.currentTarget.src = "/mock.png"; }}
            />
            <div className="flex justify-center gap-16 p-2">
              <div className="flex items-center">
                <img
                  src="/mock.png"
                  alt="leader profile pic"
                  className="rounded-full w-6 h-6"
                  onError={(e) => { e.currentTarget.src = "/mock.png"; }}
                />
                <div className="ml-2">
                  <p className="text-xs">2</p>
                  <p className="text-xs">Leader</p>
                </div>
              </div>

              <div className="flex items-center">
                <img
                  src={user?.avatar || "/mock.png"}
                  alt="your profile pic"
                  className="rounded-full w-6 h-6"
                  onError={(e) => { e.currentTarget.src = "/mock.png"; }}
                />
                <div className="ml-2">
                  <p className="text-xs">{user?.streak || 0}</p>
                  <p className="text-xs">You</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full text-center mt-2 text-gray-400 text-xs">
            <small>Friday, Oct 24</small>
          </div>

          {/* Event Card */}
          <div className="bg-secondary rounded-xl mt-2 p-2 flex items-center">
            <img
              src="/banner.png"
              alt="event picture"
              className="w-14 h-14 rounded-full"
              onError={(e) => { e.currentTarget.src = "/avatar.png"; }}
            />
            <div className="ml-2 w-full">
              <p className="text-sm font-sans mb-2">DevRats Brainstorming</p>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <img
                    src={user?.avatar || "/mock.png"}
                    alt="event hero"
                    className="w-6 h-6 rounded-full"
                    onError={(e) => { e.currentTarget.src = "/avatar.png"; }}
                  />
                  <p className="text-xs ml-1">
                    {user?.name || "Guilherme França"}
                  </p>
                </div>
                <small className="text-xs text-gray-400">4:52 pm</small>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          className="absolute bottom-6 right-6 bg-white text-primary text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          <TiPlus />
        </button>
      </div>
    </div>
  );
}
