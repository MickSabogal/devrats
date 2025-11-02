"use client";

import { Github, Linkedin, X } from "lucide-react";

export default function TeamModal({ isOpen, onClose, teamMembers }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 max-h-[80vh] flex flex-col">
        {/* Header fixo */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm p-4 border-b border-gray-700 z-10 flex items-center justify-between">
          <h3 className="text-red text-xl font-bold">Development Team</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-black/30 rounded-lg p-3 border border-green-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-600"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm">
                    {member.name}
                  </h4>
                  <p className="text-gray-400 text-xs">{member.role}</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-2 mt-2">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-xs"
                >
                  <Github className="w-4 h-4 text-white" />
                  <span className="text-white">GitHub</span>
                </a>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-xs"
                >
                  <Linkedin className="w-4 h-4 text-white" />
                  <span className="text-white">LinkedIn</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
