"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import Button from "@/components/ui/Button";
import TypingText from "@/components/ui/TypingText";

export default function OnboardingPage() {
  const router = useRouter();
  const [displayedLines, setDisplayedLines] = useState([]);
  const [showButtons, setShowButtons] = useState(false);

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
    if (displayedLines.length === 0) {
      typeNextLine(0);
    }
  }, []);

  const handleLineComplete = (index) => {
    setDisplayedLines((prev) =>
      prev.map((line, i) =>
        i === index ? { ...line, complete: true } : line
      )
    );
    typeNextLine(index + 1);
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="max-w-2xl w-full space-y-8">

        {/* Terminal Box */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 min-h-[180px] flex flex-col justify-start overflow-hidden">
          {displayedLines.map((line, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-green-500 font-mono">$</span>
              {line.complete ? (
                <span className="text-green-400 font-mono">{line.text}</span>
              ) : (
                <TypingText
                  text={line.text}
                  speed={50}
                  showCursor
                  keepCursorAfterComplete
                  onComplete={() => handleLineComplete(index)}
                  className="text-green-400 font-mono"
                  cursorClassName="inline-block w-2 h-4 bg-green-400 ml-1"
                />
              )}
            </div>
          ))}
        </div>

        {/* Floating Image */}
        <div className="flex justify-center">
          <img
            src="/images/onboarding.png"
            alt="DevRats"
            className="w-120 h-120 object-contain"
          />
        </div>

        {/* Buttons */}
        {showButtons && (
          <div className="space-y-4 transition-all duration-700 opacity-100 translate-x-0">
            <Button
              fullWidth
              size="lg"
              variant="primary"
              icon={IoAddCircleOutline}
              onClick={() => router.push("/dashboard/groups/create")}
            >
              Create a Group
            </Button>

            <Button
              fullWidth
              size="lg"
              variant="outline"
              icon={HiUserGroup}
              onClick={() => router.push("/dashboard/groups/join")}
            >
              Join a Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}