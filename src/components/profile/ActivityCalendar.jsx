"use client";

import { useState, useEffect } from "react";

export default function ActivityCalendar({ userId }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activityDays, setActivityDays] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/users/me/activity");
        if (res.ok) {
          const data = await res.json();

          setStreak(data.streak || 0);

          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          const daysInCurrentMonth = Object.keys(data.activity || {})
            .filter(dateString => {
              const date = new Date(dateString);
              return (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
              );
            })
            .map(dateString => new Date(dateString).getDate());

          setActivityDays(daysInCurrentMonth);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }

      setLoading(false);
    };

    if (userId) fetchActivity();
  }, [userId, currentDate]);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goToPreviousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

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
      {/* 📆 Header + Streak */}
      <div className="text-center mb-4">
        <h2 className="text-white text-lg font-semibold">{monthYear}</h2>
        <p className="text-green-500 text-sm font-bold mt-1">
          🔥 {streak} day streak
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToPreviousMonth} className="p-2 rounded-lg hover:bg-gray-700 transition">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={goToNextMonth} className="p-2 rounded-lg hover:bg-gray-700 transition">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-secondary rounded-2xl p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Week days */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(d => (
                <div key={d} className="text-gray-500 text-xs text-center font-medium">{d}</div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, i) => (
                <div key={i}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm shadow 
                    ${day === null ? "invisible" : ""}
                    ${activityDays.includes(day)
                      ? "bg-green-600 text-white font-bold"
                      : isToday(day)
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-gray-700 text-gray-400"}
                  `}
                >
                  {day}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
