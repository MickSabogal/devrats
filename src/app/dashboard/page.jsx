"use client";

import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";

export default function Dashboard() {
  return (
    <div className="max-w-md mx-auto bg-[#0a101c] min-h-screen pb-24">
      <div className="px-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center justify-center w-10 h-10 ">
            <IoMenu className="w-8 h-8 text-white" />
          </a>
        </div>
        <h1 className="text-xl font-bold text-white">DevRats</h1> {/**Here we'll put the name of the group based on the information of mongo.db */}
        <div className="bg-[#1c1c1e] rounded-xl">
          <img src="/banner.png" alt="banner of the group" className="rounded-t-xl" />
          <div className="flex justify-center ">
            <div className="flex items-center">
              <img src="/mock.png" alt="leader profile pic" className="rounded-full w-6 h-6" />
              <div className="">
                <p className="text-xs">2 {/**Insert the leader streak here */} </p>
                <p className="text-xs">Leader</p>
              </div>
            </div>


            <div className="flex items-center">
              <img src="/mock.png" alt="leader profile pic" className="rounded-full w-6 h-6" />
              <div className="">
                <p className="text-xs">2 {/**Insert the leader streak here */} </p>
                <p className="text-xs">Leader</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
