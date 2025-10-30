"use client";
import React from "react";

const CheeseMouseAnimation = () => {
  return (
    <>
      <div className="absolute right-0 top-0 h-full w-[2px] overflow-visible pointer-events-none z-50">
        {/* Fixed decorative side line */}
        <div className="absolute right-0 top-0 w-[2px] h-full bg-gradient-to-b from-gray-300/30 via-gray-400/40 to-gray-300/30" />

        <div className="relative h-full">
          {/* 🧀 Hanging cheese with attached string */}
          <div
            className="absolute -right-[45px] w-[90px] h-[90px] animate-cheeseSlide"
            style={{ transformOrigin: "top center" }}
          >
            {/* String attached to cheese, extends up */}
            <svg
              viewBox="0 0 100 120"
              className="w-full h-full absolute top-0 left-0"
              style={{ overflow: "visible" }}
            >
              <line
                x1="50"
                y1="105" // começa na base do queijo
                x2="50"
                y2="5000" // segue para baixo, dando o efeito de “puxar”
                stroke="#8B7355"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <svg
              viewBox="0 0 100 120"
              className="w-full h-full drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)]"
            >
              {/* Cheese body */}
              <path
                d="M 50 105 L 20 35 C 22 32, 26 28, 30 26 L 70 26 C 74 28, 78 32, 80 35 L 50 105 Z"
                fill="#FFD54F"
                stroke="#FFA726"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <ellipse
                cx="45"
                cy="55"
                rx="4.5"
                ry="5.5"
                fill="#F57C00"
                opacity="0.75"
              />
              <ellipse
                cx="60"
                cy="50"
                rx="5.5"
                ry="6.5"
                fill="#F57C00"
                opacity="0.75"
              />
              <ellipse
                cx="40"
                cy="70"
                rx="3.5"
                ry="4.5"
                fill="#F57C00"
                opacity="0.75"
              />
              <ellipse
                cx="55"
                cy="80"
                rx="4.5"
                ry="5.5"
                fill="#F57C00"
                opacity="0.75"
              />
              <ellipse
                cx="50"
                cy="40"
                rx="15"
                ry="7"
                fill="#FFF9C4"
                opacity="0.7"
              />
              <ellipse
                cx="48"
                cy="38"
                rx="10"
                ry="4.5"
                fill="#FFFDE7"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* 🐭 Mouse chasing but never catching */}
          <div
            className="absolute -right-[54px] w-[110px] h-[110px] animate-mouseSlide"
            style={{
              transformOrigin: "center center",
              transform: "rotate(180deg)",
            }}
          >
            <svg
              viewBox="0 0 140 160"
              className="w-full h-full drop-shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
            >
              {/* Tail */}
              <path
                d="M 70 130 Q 68 150, 60 158 Q 52 162, 46 160"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-tailWag"
              />
              {/* Body */}
              <ellipse cx="70" cy="90" rx="35" ry="45" fill="#CBD5E1" />
              <ellipse
                cx="70"
                cy="90"
                rx="30"
                ry="40"
                fill="#E2E8F0"
                opacity="0.85"
              />
              {/* Head */}
              <ellipse cx="70" cy="40" rx="25" ry="30" fill="#E2E8F0" />
              <ellipse
                cx="70"
                cy="40"
                rx="22"
                ry="27"
                fill="#F1F5F9"
                opacity="0.8"
              />
              {/* Ears */}
              <ellipse cx="48" cy="22" rx="14" ry="16" fill="#E2E8F0" />
              <ellipse
                cx="48"
                cy="22"
                rx="10"
                ry="12"
                fill="#FCA5A5"
                opacity="0.5"
              />
              <ellipse cx="92" cy="22" rx="14" ry="16" fill="#E2E8F0" />
              <ellipse
                cx="92"
                cy="22"
                rx="10"
                ry="12"
                fill="#FCA5A5"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* 🧀 Cheese sliding down first */
        @keyframes cheeseSlide {
          0% {
            transform: translateY(-120px);
          }
          100% {
            transform: translateY(calc(100vh + 80px));
          }
        }

        /* 🐭 Mouse waits longer, then chases but never catches up */
        @keyframes mouseSlide {
          0% {
            transform: translateY(-160px) rotate(180deg);
          }
          50% {
            transform: translateY(-160px) rotate(180deg);
          }
          100% {
            transform: translateY(calc(100vh + 60px)) rotate(180deg);
          }
        }

        /* 🐀 Tail wagging */
        @keyframes tailWag {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }

        .animate-cheeseSlide {
          animation: cheeseSlide 5s linear infinite;
        }

        .animate-mouseSlide {
          animation: mouseSlide 5s linear infinite;
        }

        .animate-tailWag {
          animation: tailWag 0.6s ease-in-out infinite;
          transform-origin: 70px 130px;
        }
      `}</style>
    </>
  );
};

export default CheeseMouseAnimation;