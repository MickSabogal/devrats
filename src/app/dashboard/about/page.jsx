"use client";

import { ArrowLeft, Code2, Trophy, Calendar, Users } from "lucide-react";
import { useState } from "react";
import TeamModal from "@/components/dashboard/TeamModal";

export default function AboutPage() {
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
      avatar: "/images/isadora.jpeg",
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
      avatar: "/images/miguel.jpeg",
    },
    {
      name: "Mishal Saheer",
      role: "Developer",
      github: "https://github.com/msaheers",
      linkedin: "https://www.linkedin.com/in/mishal-saheer-a90146323/",
      avatar: "/images/mishal.jpeg",
    },
  ];

  const features = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Daily Check-ins",
      description: "Share your study sessions with photo proof",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Streak Tracking",
      description: "Maintain consistency and build lasting habits",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Group Leaderboards",
      description: "Compete with friends and stay motivated",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Activity Calendar",
      description: "Visualize your progress over time",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary border-b border-green-500/30">
          <div className="flex items-center justify-between p-5">
            <button
              onClick={() => window.history.back()}
              className="text-white p-2 hover:bg-white/20 rounded-xl transition-all hover:-translate-x-1 duration-300"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-white text-2xl font-bold">About DevRats</h2>
            <img
              src="/images/logo_devrats.png"
              alt="DevRats"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="px-6 py-6 space-y-8 max-h-[calc(100vh-88px)] overflow-y-auto">
          
          {/* Hero Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-800/50 border border-green-500/30 rounded-3xl p-8 text-center backdrop-blur-sm">
              <div className="flex flex-col items-center gap-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/30 rounded-full blur-lg animate-pulse" />
                </div>

                <div className="space-y-2">
                  <p className="text-gray-300 text-base leading-relaxed max-w-lg mx-auto">
                    DevRats is a community platform designed to help developers
                    stay consistent with their learning journey. Track your
                    study sessions, compete with friends, and build lasting
                    habits through daily check-ins.
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-green-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-green-500/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-5 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group hover:transform hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-green-500/20 rounded-xl text-green-400 group-hover:bg-green-500/30 transition-colors">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-3xl p-1">
            <button
              onClick={() => setShowTeamModal(true)}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
            >
              <Users className="w-5 h-5" />
              Meet the Team
              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Modal */}
        <TeamModal
          isOpen={showTeamModal}
          onClose={() => setShowTeamModal(false)}
          teamMembers={teamMembers}
        />
      </div>
    </div>
  );
}
