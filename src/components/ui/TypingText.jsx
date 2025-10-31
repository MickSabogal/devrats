// src/components/ui/TypingText.jsx
"use client";

import { useState, useEffect } from "react";

export default function TypingText({ 
  text = "", 
  speed = 50, 
  showCursor = true,
  keepCursorAfterComplete = false,
  onComplete,
  className = "text-green-400 font-mono",
  cursorClassName = "inline-block w-2 h-4 bg-green-400 ml-1"
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsComplete(true);
        clearInterval(typeInterval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [text, speed, onComplete]);

  const shouldShowCursor = showCursor && (!isComplete || keepCursorAfterComplete);

  return (
    <span className={className}>
      {displayedText}
      {shouldShowCursor && (
        <span className={`${cursorClassName} animate-blink`} />
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </span>
  );
}