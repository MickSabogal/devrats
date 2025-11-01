"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import Button from "@/components/ui/Button";
import TypingText from "@/components/ui/TypingText";
import CreateGroupModal from "@/components/dashboard/CreateGroupModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function OnboardingPage() {
  const router = useRouter();
  const [displayedLines, setDisplayedLines] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasStarted = useRef(false);

  const terminalLines = [
    "> Spawning the colony ...",
    "> Welcome to the journey, young dev!",
    "> Received input: <Hello, World!>",
    "> Status: system ready",
    "> DevRats terminal initialized",
  ];

  const typeNextLine = (index = 0) => {
    if (index >= terminalLines.length) {
      setShowButtons(true);
      return;
    }

    setDisplayedLines((prev) => [
      ...prev,
      { text: terminalLines[index], complete: false },
    ]);
  };

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      typeNextLine(0);
    }
  }, []);

  const handleLineComplete = (index) => {
    setDisplayedLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, complete: true } : line))
    );
    typeNextLine(index + 1);
  };

  const handleGroupCreated = (newGroup) => {
    setIsRedirecting(true);
    router.push(`/dashboard/groups/${newGroup._id}/dashboard`);
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-primary flex flex-col items-center p-6 pt-20">
        <div className="max-w-2xl w-full space-y-6">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 h-[200px] flex flex-col justify-start">
            {displayedLines.map((line, index) => (
              <div key={index} className="flex items-start gap-2 mb-2">
                <span className="text-green-500 font-mono text-sm flex-shrink-0">
                  $
                </span>
                {line.complete ? (
                  <span className="text-green-400 font-mono text-sm leading-tight">
                    {line.text}
                  </span>
                ) : (
                  <TypingText
                    text={line.text}
                    speed={50}
                    showCursor
                    keepCursorAfterComplete
                    onComplete={() => handleLineComplete(index)}
                    className="text-green-400 font-mono text-sm leading-tight"
                    cursorClassName="inline-block w-2 h-4 bg-green-400 ml-1"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center overflow-hidden h-110 w-full">
            <img
              src="/images/onboarding.png"
              alt="DevRats"
              className="min-h-full min-w-full object-cover object-center"
            />
          </div>

          {showButtons && (
            <div className="space-y-4 animate-fade-in">
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
          )}
        </div>
      </div>

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}