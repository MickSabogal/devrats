"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button
            onClick={() => router.back()}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-white text-xl font-bold">About DevRats</h2>
          <div className="w-10"></div>
        </div>

        <div className="px-6 py-8 space-y-6">
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo_devrats.png"
              alt="DevRats"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white text-lg font-bold mb-2">What is DevRats?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                DevRats is a community platform designed to help developers stay consistent with their learning journey. 
                Track your study sessions, compete with friends, and build lasting habits through daily check-ins and group challenges.
              </p>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-2">Key Features</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Daily check-ins with photo proof of your study sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Streak tracking to maintain consistency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Group leaderboards to compete with friends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Activity calendar to visualize your progress</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-2">Development Team</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                DevRats was created by a team of passionate developers dedicated to building tools that help others grow.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-400 text-sm">• Team Member 1</p>
                <p className="text-gray-400 text-sm">• Team Member 2</p>
                <p className="text-gray-400 text-sm">• Team Member 3</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-xs text-center">
                Version 1.0.0 • Made with ❤️ by DevRats Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}