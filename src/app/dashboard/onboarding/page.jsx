"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { BiMenuAltLeft } from "react-icons/bi";
import Button from "@/components/ui/Button";
import TypingText from "@/components/ui/TypingText";
import CreateGroupModal from "@/components/dashboard/CreateGroupModal";
import JoinGroupModal from "@/components/dashboard/JoinGroupModal";
import Sidebar from "@/components/dashboard/sideBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hasStarted = useRef(false);

  const terminalLines = [
    "> Spawning the colony ...",
    "> Welcome to the journey, young dev!",
    "> Received input: <Hello, World!>",
    "> Status: system ready",
    "> DevRats terminal initialized",
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

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

  const handleGroupJoined = (data) => {
    setIsRedirecting(true);
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
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />

      <div className="h-screen bg-primary flex flex-col overflow-hidden">
        <div className="max-w-md mx-auto w-full h-full flex flex-col p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
            >
              <BiMenuAltLeft className="w-8 h-8 text-white" />
            </button>
          </div>

          {/* Terminal, imagem e botões */}
          <div className="flex flex-col flex-1">
            {/* Terminal */}
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 h-[180px] flex flex-col justify-start mb-6">
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

            {/* Image */}
            <div className="flex justify-center items-center my-6">
              <img
                src="/images/onboarding.png"
                alt="DevRats"
                className="max-w-full max-h-100 object-contain"
              />
            </div>

            {/* Buttons */}
            {showButtons && (
              <div className="space-y-4 animate-fade-in pb-6">
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
                  onClick={() => setIsJoinGroupModalOpen(true)}
                >
                  Join a Group
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      <JoinGroupModal
        isOpen={isJoinGroupModalOpen}
        onClose={() => setIsJoinGroupModalOpen(false)}
        onGroupJoined={handleGroupJoined}
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
