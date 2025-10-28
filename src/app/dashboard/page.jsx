"use client";

import React from "react";
import { IoMenu } from "react-icons/io5";
import { TiPlus } from "react-icons/ti";

export default function Dashboard() {
  return (
    <div className="bg-primary min-h-screen pb-24">
      <div className="max-w-md mx-auto relative px-6 pt-6">
        {/* Header */}
        <div className="flex items-center -m-2">
          <a href="/" className="flex items-center justify-center w-10 h-10 ">
            <IoMenu className="w-8 h-8 text-white" />
          </a>
        </div>

        <h1 className="text-xl font-bold text-white my-2">DEVRATS</h1>

        {/* Group Card */}
        <div className="bg-secondary rounded-xl">
          <img
            src="/banner.png"
            alt="banner of the group"
            className="rounded-t-xl"
          />
          <div className="flex justify-center gap-16 p-2">
            <div className="flex items-center">
              <img
                src="/mock.png"
                alt="leader profile pic"
                className="rounded-full w-6 h-6"
              />
              <div className="ml-2">
                <p className="text-xs">2</p>
                <p className="text-xs">Leader</p>
              </div>
            </div>

            <div className="flex items-center">
              <img
                src="/mock.png"
                alt="your profile pic"
                className="rounded-full w-6 h-6"
              />
              <div className="ml-2">
                <p className="text-xs">1</p>
                <p className="text-xs">You</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Card */}
        <div className="bg-secondary rounded-xl mt-4 p-2 flex">
          <img
            src="/banner.png"
            alt="event picture"
            className="w-14 h-14 rounded-full"
          />
          <div className="ml-2">
            <p className="text-sm font-sans">DevRats Brainstorming</p>
            <div className="flex items-center">
              <img
                src="/mock.png"
                alt="event hero"
                className="w-6 h-6 rounded-full"
              />
              <p className="text-xs ml-1">Guilherme França</p>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          className="fixed bottom-6 right-6 bg-white text-primary text-3xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          <TiPlus />
        </button>
      </div>
    </div>
  );
}
