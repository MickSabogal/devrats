"use client";
import React from "react";

const CheeseMouseAnimation = () => {
  return (
    <>
      <div className="absolute right-0 top-0 h-full w-[3px] overflow-visible pointer-events-none z-50">
        {/* Fixed decorative line on the side */}
        <div className="absolute right-0 top-0 w-[3px] h-full bg-gradient-to-b from-gray-300/30 via-gray-400/40 to-gray-300/30" />

        <div className="relative h-full">
          {/* 🧀 Cheese being DRAGGED seen from above */}
          <div
            className="absolute -right-[50px] w-[100px] h-[100px] animate-cheeseSlide"
            style={{ transformOrigin: "center center" }}
          >
            {/* Triangular cheese with rounded tips */}
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full"
            >
              {/* Main cheese body - triangular with rounded corners */}
              <path
                d="M 60 30 L 85 80 Q 85 85, 80 87 L 40 87 Q 35 85, 35 80 Z"
                fill="#FFD84D"
                stroke="#CC9933"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              
              {/* Left side gradient for depth */}
              <path
                d="M 60 30 L 35 80 Q 35 83, 37 85 L 38 82 Z"
                fill="#E6B800"
                opacity="0.4"
              />
              
              {/* Right side gradient (lighter) */}
              <path
                d="M 60 30 L 85 80 Q 85 83, 83 85 L 82 82 Z"
                fill="#FFF9CC"
                opacity="0.5"
              />
              
              {/* Cheese holes */}
              <ellipse cx="55" cy="50" rx="5" ry="6" fill="#FFCC00" opacity="0.7" />
              <ellipse cx="55" cy="50" rx="3" ry="4" fill="#E6AC00" opacity="0.6" />
              
              <ellipse cx="70" cy="55" rx="4" ry="5" fill="#FFCC00" opacity="0.7" />
              <ellipse cx="70" cy="55" rx="2.5" ry="3" fill="#E6AC00" opacity="0.6" />
              
              <ellipse cx="48" cy="65" rx="6" ry="7" fill="#FFCC00" opacity="0.7" />
              <ellipse cx="48" cy="65" rx="4" ry="5" fill="#E6AC00" opacity="0.6" />
              
              <ellipse cx="65" cy="70" rx="5" ry="6" fill="#FFCC00" opacity="0.7" />
              <ellipse cx="65" cy="70" rx="3" ry="4" fill="#E6AC00" opacity="0.6" />
              
              <ellipse cx="60" cy="60" rx="4" ry="5" fill="#FFCC00" opacity="0.7" />
              <ellipse cx="60" cy="60" rx="2.5" ry="3.5" fill="#E6AC00" opacity="0.6" />
              
              {/* Rope tied at the BOTTOM tip (being pulled) */}
              <ellipse cx="60" cy="87" rx="5" ry="3" fill="#8B6B47" />
              <circle cx="60" cy="87" r="6" fill="none" stroke="#6B5235" strokeWidth="2" />
              <path
                d="M 55 87 L 60 90 L 65 87"
                fill="none"
                stroke="#6B5235"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Rope pulling the cheese - starts from bottom */}
            <svg
              viewBox="0 0 100 120"
              className="w-full h-full absolute top-0 left-0"
              style={{ overflow: "visible" }}
            >
              <line
                x1="50"
                y1="90"
                x2="50"
                y2="5000"
                stroke="#8B6B47"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 🐭 Little mouse running seen from above */}
          <div
            className="absolute -right-[50px] w-[100px] h-[100px] animate-mouseSlide"
            style={{
              transformOrigin: "center center",
              transform: "rotate(180deg)",
            }}
          >
            <svg
              viewBox="0 0 100 120"
              className="w-full h-full"
              style={{ overflow: "visible" }}
            >
              {/* Tail swinging (seen from above) */}
              <path
                d="M 50 85 Q 52 92, 55 98 Q 58 103, 62 106"
                fill="none"
                stroke="#E8A080"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-tailSwing"
              />
              <path
                d="M 50 85 Q 52 92, 55 98 Q 58 103, 62 106"
                fill="none"
                stroke="#D89070"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-tailSwing"
              />
              
              {/* Back left paw */}
              <ellipse
                cx="38"
                cy="78"
                rx="6"
                ry="9"
                fill="#E8A080"
                stroke="#9E6B47"
                strokeWidth="2"
                className="animate-pawRunLeft"
              />
              <ellipse cx="38" cy="80" rx="3.5" ry="5" fill="#F5B090" opacity="0.6" />
              
              {/* Back right paw */}
              <ellipse
                cx="62"
                cy="78"
                rx="6"
                ry="9"
                fill="#E8A080"
                stroke="#9E6B47"
                strokeWidth="2"
                className="animate-pawRunRight"
              />
              <ellipse cx="62" cy="80" rx="3.5" ry="5" fill="#F5B090" opacity="0.6" />
              
              {/* Back/body (seen from above) */}
              <ellipse
                cx="50"
                cy="55"
                rx="24"
                ry="32"
                fill="#E8B896"
                stroke="#9E6B47"
                strokeWidth="2.5"
              />
              
              {/* Back shading */}
              <ellipse
                cx="48"
                cy="58"
                rx="18"
                ry="26"
                fill="#D4A077"
                opacity="0.3"
              />
              
              {/* Head seen from above - BIGGER */}
              <ellipse
                cx="50"
                cy="28"
                rx="26"
                ry="28"
                fill="#E8B896"
                stroke="#9E6B47"
                strokeWidth="2.5"
              />
              
              {/* Left ear (big and round, pointing up so we see the pink inside) */}
              <ellipse
                cx="30"
                cy="15"
                rx="14"
                ry="15"
                fill="#E8B896"
                stroke="#9E6B47"
                strokeWidth="2.5"
              />
              {/* Pink inner ear - LEFT */}
              <ellipse
                cx="30"
                cy="17"
                rx="10"
                ry="11"
                fill="#FFB8B8"
                opacity="0.9"
              />
              <ellipse
                cx="30"
                cy="18"
                rx="7"
                ry="8"
                fill="#FF9999"
                opacity="0.7"
              />
              
              {/* Right ear (big and round, pointing up so we see the pink inside) */}
              <ellipse
                cx="70"
                cy="15"
                rx="14"
                ry="15"
                fill="#E8B896"
                stroke="#9E6B47"
                strokeWidth="2.5"
              />
              {/* Pink inner ear - RIGHT */}
              <ellipse
                cx="70"
                cy="17"
                rx="10"
                ry="11"
                fill="#FFB8B8"
                opacity="0.9"
              />
              <ellipse
                cx="70"
                cy="18"
                rx="7"
                ry="8"
                fill="#FF9999"
                opacity="0.7"
              />
              
              {/* Little tuft of hair on top of head */}
              <path
                d="M 47 15 Q 49 11, 50 15 Q 51 11, 53 15"
                fill="none"
                stroke="#9E6B47"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 🎬 Animations */}
      <style jsx>{`
        @keyframes cheeseSlide {
          0% {
            transform: translateY(-120px);
          }
          100% {
            transform: translateY(calc(100vh + 100px));
          }
        }

        @keyframes mouseSlide {
          0% {
            transform: translateY(-140px) rotate(180deg);
          }
          50% {
            transform: translateY(-140px) rotate(180deg);
          }
          100% {
            transform: translateY(calc(100vh + 80px)) rotate(180deg);
          }
        }

        @keyframes tailSwing {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-12deg);
          }
          75% {
            transform: rotate(12deg);
          }
        }

        @keyframes pawRunLeft {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-4px) translateX(-2px);
          }
        }

        @keyframes pawRunRight {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-4px) translateX(2px);
          }
        }

        .animate-cheeseSlide {
          animation: cheeseSlide 5s linear infinite;
        }

        .animate-mouseSlide {
          animation: mouseSlide 5s linear infinite;
        }

        .animate-tailSwing {
          animation: tailSwing 0.4s ease-in-out infinite;
          transform-origin: 50px 85px;
        }

        .animate-pawRunLeft {
          animation: pawRunLeft 0.3s ease-in-out infinite;
        }

        .animate-pawRunRight {
          animation: pawRunRight 0.3s ease-in-out infinite;
          animation-delay: 0.15s;
        }
      `}</style>
    </>
  );
};

export default CheeseMouseAnimation;