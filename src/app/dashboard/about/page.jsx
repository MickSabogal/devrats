"use client";

import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AboutPage() {
  const router = useRouter();
  const [showTeamModal, setShowTeamModal] = useState(false);

  const teamMembers = [
    { name: "Guilherme França", role: "" },
    { name: "Isadora Barradas", role: "" },
    { name: "Jhonathan Tinoco", role: "" },
    { name: "Miguel Sabogal", role: "" },
    { name: "Mishal Saheer", role: "" }
  ];

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
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                DevRats was created by a team of passionate developers dedicated to building tools that help others grow.
              </p>
              
              <button
                onClick={() => setShowTeamModal(true)}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Meet the Team
              </button>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-xs text-center">
                Version 1.0.0 • Made with ❤️ by DevRats Team
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowTeamModal(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 animate-fade-in">
            <button
              onClick={() => setShowTeamModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              <h3 className="text-white text-2xl font-bold mb-2 text-center">
                Development Team
              </h3>
              <p className="text-gray-400 text-sm text-center mb-6">
                Meet the minds behind DevRats
              </p>

              <div className="mb-6 flex justify-center">
                <img
                  src="/images/team.jpeg"
                  alt="Team"
                  className="w-full max-w-sm h-auto rounded-lg border-4 border-amber-400 shadow-xl"
                />
              </div>

              <div className="space-y-3">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index}
                    className="bg-black/30 rounded-lg p-4 hover:bg-black/40 transition-colors border border-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-base">
                          {member.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowTeamModal(false)}
                className="w-full mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}