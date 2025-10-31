// src/app/dashboard/onboarding/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import Button from "@/components/ui/Button";
import CreateGroupModal from "@/components/dashboard/CreateGroupModal";

export default function OnboardingPage() {
  const router = useRouter();
  const [displayedLines, setDisplayedLines] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  const terminalLines = [
    "> Spawning the colony ...",
    "> Welcome to the journey, young dev!",
    "> Received input: <Hello, World!>",
    "> Status: system ready",
    "> DevRats terminal initialized",
  ];

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = "";

    const typeInterval = setInterval(() => {
      if (lineIndex < terminalLines.length) {
        if (charIndex < terminalLines[lineIndex].length) {
          currentLine += terminalLines[lineIndex][charIndex];
          charIndex++;

          setDisplayedLines((prev) => {
            const newLines = [...prev];
            newLines[lineIndex] = currentLine;
            return newLines;
          });
        } else {
          lineIndex++;
          charIndex = 0;
          currentLine = "";

          if (lineIndex === terminalLines.length) {
            setTimeout(() => setShowButtons(true), 500);
          }
        }
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []);

  const handleGroupCreated = (newGroup) => {
    // Quando criar um grupo com sucesso, redireciona direto pro dashboard do grupo
    router.push(`/dashboard/groups/${newGroup._id}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 overflow-hidden">
      <div className="max-w-2xl w-full">
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 mb-8 min-h-[200px]">
          <div className="font-mono text-green-400 space-y-2">
            {displayedLines.map((line, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 animate-fadeIn"
              >
                <span className="text-green-500">$</span>
                <span>{line}</span>
                {index === displayedLines.length - 1 && (
                  <span className="inline-block w-2 h-4 bg-green-400 animate-blink ml-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="/images/onboarding.png"
            alt="DevRats"
            className="w-100 h-100 object-contain animate-float"
          />
        </div>

        <div
          className={`
            space-y-4 transition-all duration-700
            ${showButtons ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}
          `}
        >
          <Button
            fullWidth
            size="lg"
            variant="primary"
            icon={IoAddCircleOutline}
            onClick={() => setIsCreateGroupModalOpen(true)}
          >
            Create a Group
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="outline"
            icon={HiUserGroup}
            onClick={() => router.push("/dashboard/join-group")}
          >
            Join a Group
          </Button>
        </div>
      </div>

      {/* Modal de criação de grupo */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
}