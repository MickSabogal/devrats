export default function ProfileStats({ user }) {
  return (
    <div className="flex gap-3 flex-1">
      <div className="bg-gray-700 rounded-2xl px-4 py-3 text-center shadow-lg border border-gray-800 flex-1">
        <p className="text-white text-xl font-bold">{user?.streak || 0}</p>
        <p className="text-gray-400 text-xs">Check-ins</p>
      </div>

      <div className="bg-gray-700 rounded-2xl px-4 py-3 text-center shadow-lg border border-gray-800 flex-1">
        <p className="text-white text-xl font-bold">0m</p>
        <p className="text-gray-400 text-xs">Time active</p>
      </div>
    </div>
  );
}