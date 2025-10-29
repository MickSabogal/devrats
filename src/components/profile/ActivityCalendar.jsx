"use client";

import { useState, useEffect } from "react";

export default function ActivityCalendar({ userId, lastPostDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activityDays, setActivityDays] = useState([]);

  useEffect(() => {
    const days = [];
    if (lastPostDate) {
      const lastDate = new Date(lastPostDate);
      days.push(lastDate.getDate());
    }
    setActivityDays(days);
  }, [lastPostDate]);

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

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-white text-lg font-semibold">{monthYear}</h2>
      </div>

      <div className="bg-secondary rounded-2xl p-4">
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
                aspect-square flex items-center justify-center rounded-lg text-sm shadow-lg shadow-black/30
                ${day === null ? "invisible" : ""}
                ${
                  activityDays.includes(day)
                    ? "bg-green-600 text-white font-semibold"
                    : "bg-gray-700 text-gray-400"
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}