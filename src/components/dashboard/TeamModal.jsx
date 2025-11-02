"use client";

import { Github, Linkedin, X, Code2 } from "lucide-react";

export default function TeamModal({ isOpen, onClose, teamMembers }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <div className="relative w-full max-w-2xl bg-primary rounded-3xl shadow-2xl overflow-hidden border border-green-500/30 max-h-[85vh] flex flex-col">
        {/* Header com gradiente */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-2xl font-bold mb-1">Meet Our Team</h3>
              <p className="text-green-100 text-sm">The minds behind DevRats</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:rotate-90 duration-300"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Team List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-4 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
            >
              <div className="flex items-center gap-4">
                {/* Left: Photo + Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-21 h-21 rounded-full object-cover border-3 border-green-500/50 group-hover:border-green-400 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <Code2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-base leading-tight">
                      {member.name}
                    </h4>
                    <p className="text-green-400 text-sm font-medium mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Right: Buttons stacked */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all duration-300 group/btn"
                  >
                    <Github className="w-4 h-4 text-gray-300 group-hover/btn:text-white transition-colors" />
                    <span className="text-gray-300 text-xs group-hover/btn:text-white transition-colors">
                      GitHub
                    </span>
                  </a>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-all duration-300 group/btn"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                    <span className="text-white text-xs">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}