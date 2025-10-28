"use client";

import React, { useState } from "react";
import { IoMenuSharp } from "react-icons/io5";

export default function Dashboard() {
  return (
    <div className="max-w-md mx-auto bg-primary min-h-screen pb-24">
      <div className="px-6 pt-6">
        {/* Header */}
        <div className="flex items-center -m-2">
          <a href="/" className="flex items-center justify-center w-10 h-10 ">
            <IoMenuSharp className="w-8 h-8 text-white " />
          </a>
        </div>
        <h1 className="text-xl font-bold text-white my-2">DEVRATS</h1>{" "}
        {/**Here we'll put the name of the group based on the information of mongo.db */}
        <div className="bg-secondary rounded-xl ">
          <img
            src="/banner.png"
            alt="banner of the group"
            className="rounded-t-xl"
          />
          <div className="flex justify-center gap-16 p-2 ">
            <div className="flex items-center">
              <img
                src="/mock.png"
                alt="leader profile pic"
                className="rounded-full w-6 h-6"
              />
              <div className="ml-2">
                <p className="text-xs">
                  2 {/**Insert the leader streak here */}{" "}
                </p>
                <p className="text-xs">Leader</p>
              </div>
            </div>

            <div className="flex items-center">
              <img
                src="/mock.png"
                alt="leader profile pic"
                className="rounded-full w-6 h-6"
              />
              <div className="ml-2">
                <p className="text-xs">
                  1 {/**Insert the leader streak here */}{" "}
                </p>
                <p className="text-xs">You</p>
              </div>
            </div>
          </div>
        </div>
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
                alt="eventeHero profile pic"
                className="w-6 h-6 rounded-full"
              />
              <p className="text-xs ml-1">Guilherme França</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
