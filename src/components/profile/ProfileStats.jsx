// src/components/profile/ProfileStats.jsx
export default function ProfileStats({ user }) {
  return (
    <div className="flex justify-center gap-16 mb-8">
      {/* Check-ins */}
      <div className="text-center">
        <p className="text-white text-2xl font-bold">{user?.streak || 0}</p>
        <p className="text-gray-400 text-sm">Check-ins</p>
      </div>

      {/* Days active */}
      <div className="text-center">
        <p className="text-white text-2xl font-bold">{user?.streak || 0}</p>
        <p className="text-gray-400 text-sm">Days active</p>
      </div>

      {/* Time active */}
      <div className="text-center">
        <p className="text-white text-2xl font-bold">0m</p>
        <p className="text-gray-400 text-sm">Time active</p>
      </div>
    </div>
  );
}