"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ActivityCalendar({ userId }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activityDays, setActivityDays] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users/me/activity");

        if (res.ok) {
          const data = await res.json();

          setStreak(data.streak || 0);

          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          const daysInCurrentMonth = Object.keys(data.activity || {})
            .filter((dateString) => {
              const date = new Date(dateString);
              return (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
              );
            })
            .map((dateString) => new Date(dateString).getDate());

          setActivityDays(daysInCurrentMonth);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchActivity();
    }
  }, [userId, currentDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthYear = `${
    monthNames[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div>
      <style jsx>{`
        @keyframes borderSpin {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }

        .golden-border {
          position: relative;
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 40%,
            #ffd700 45%,
            #ffed4e 50%,
            #ffd700 55%,
            transparent 60%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: borderSpin 2s ease-in-out;
          animation-fill-mode: forwards;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-white text-lg font-semibold">{monthYear}</h2>
          <p className="text-green-500 text-sm font-bold mt-1 flex items-center justify-center gap-1">
            <img src="/images/star.png" alt="Cheese Star" className="w-4 h-4" />
            {streak} day streak
          </p>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="bg-secondary rounded-2xl p-4">
        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-3 border-gray-600 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-gray-500 text-xs text-center font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg shadow-lg shadow-black/30 relative overflow-hidden
                    ${day === null ? "invisible" : ""}
                    ${activityDays.includes(day) ? "golden-border" : ""}
                    ${
                      isToday(day) && !activityDays.includes(day)
                        ? "ring-2 ring-amber-400 bg-primary"
                        : ""
                    }
                    bg-gray-700`}
                >
                  {day && (
                    <>
                      {activityDays.includes(day) && (
                        <div className="w-full h-full p-2">
                          <Image
                            src="/images/fire.png"
                            alt="Activity"
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      )}
                      {isToday(day) && !activityDays.includes(day) && (
                        <div className="w-full h-full p-2">
                          <Image
                            src="/images/today.png"
                            alt="Today"
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      )}
                      {!activityDays.includes(day) && !isToday(day) && (
                        <span className="text-gray-400 text-xs">{day}</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* 🔹 Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-base">
          <div className="flex items-center gap-2">
            <Image
              src="/images/star.png"
              alt="Activity"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-gray-400 align-middle">Activity</span>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/images/today.png"
              alt="Today"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-gray-400 align-middle">Today</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-700"></div>
            <span className="text-gray-400 align-middle">No activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
