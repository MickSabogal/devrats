"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ActivityCalendar({ userId }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activityDays, setActivityDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users/me/activity");
        
        if (res.ok) {
          const data = await res.json();

          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          const daysInCurrentMonth = Object.keys(data.activity || {})
            .filter(dateString => {
              const date = new Date(dateString);
              return date.getMonth() === currentMonth && 
                     date.getFullYear() === currentYear;
            })
            .map(dateString => new Date(dateString).getDate());
          
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-white text-lg font-semibold">{monthYear}</h2>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                  className={`
                    aspect-square flex items-center justify-center rounded-lg shadow-lg shadow-black/30
                    ${day === null ? "invisible" : ""}
                    bg-gray-700
                  `}
                >
                  {day && (
                    <>
                      {activityDays.includes(day) ? (
                        <div className="w-full h-full p-2 flex items-center justify-center">
                          <Image
                            src="/images/fire.png"
                            alt="Activity"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                      ) : isToday(day) ? (
                        <div className="w-full h-full p-2 flex items-center justify-center">
                          <Image
                            src="/images/today.png"
                            alt="Today"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          {day}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Subtitle */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative">
              <Image
                src="/images/fire.png"
                alt="Activity"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <span className="text-gray-400">Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative">
              <Image
                src="/images/today.png"
                alt="Today"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <span className="text-gray-400">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-700"></div>
            <span className="text-gray-400">No activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}