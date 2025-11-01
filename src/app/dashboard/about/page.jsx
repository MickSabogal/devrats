"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TeamModal from "@/components/dashboard/TeamModal";
import Button from "@/components/ui/Button";

export default function AboutPage() {
  const router = useRouter();
  const [showTeamModal, setShowTeamModal] = useState(false);

  const teamMembers = [
    {
      name: "Guilherme França",
      role: "Developer",
      github: "https://github.com/guilhermesfranca",
      linkedin: "https://www.linkedin.com/in/guilhermesfranca/",
      avatar: "/images/guilherme.jpeg",
    },
    {
      name: "Isadora Barradas",
      role: "Developer",
      github: "https://github.com/iorsini",
      linkedin: "https://www.linkedin.com/in/isadora-barradas/",
      avatar: "/images/isadora.png",
    },
    {
      name: "Jhonathan Tinoco",
      role: "Developer",
      github: "https://github.com/Jhonathan-Tinoco",
      linkedin: "NAO SEI",
      avatar: "/images/jhonathan.jpeg",
    },
    {
      name: "Miguel Sabogal",
      role: "Developer",
      github: "https://github.com/MickSabogal",
      linkedin: "https://www.linkedin.com/in/miguel-alejandro-sabogal-guzman/",
      avatar: "/images/miguel.png",
    },
    {
      name: "Mishal Saheer",
      role: "Developer",
      github: "https://github.com/msaheers",
      linkedin: "https://www.linkedin.com/in/mishal-saheer-a90146323/",
      avatar: "/images/mishal.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button
            onClick={() => router.back()}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-white text-xl font-bold">About DevRats</h2>
          <img
            src="/images/logo_devrats.png"
            alt="DevRats"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* Conteúdo scrollável */}
        <div className="px-6 py-3 space-y-6 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-white text-lg font-bold mb-2">
                What is DevRats?
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                DevRats is a community platform designed to help developers stay
                consistent with their learning journey. Track your study
                sessions, compete with friends, and build lasting habits through
                daily check-ins and group challenges.
              </p>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-2">
                Key Features
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>
                    Daily check-ins with photo proof of your study sessions
                  </span>
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

            {/* Development Team */}
            <div>
              <h3 className="text-white text-lg font-bold mb-2">
                Development Team
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                DevRats was created by a team of passionate developers dedicated
                to building tools that help others grow.
              </p>

              {/* Button */}
              <Button
                onClick={() => setShowTeamModal(true)}
                variant="attention"
                size="sm"
                className="underline text-green-600 font-bold hover:text-green-800 transition-colors duration-200"
              >
                Meet the team →
              </Button>
            </div>

            {/* Picture */}
            <div className="mb-4 flex justify-center items-center">
              <img
                src="/images/team.jpeg"
                alt="Team"
                className="w-80 rounded-2xl"
              />
            </div>

            <div className="pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-xs text-center">
                © 2026 DevRats
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do Team */}
      <TeamModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        teamMembers={teamMembers}
      />
    </div>
  );
}
