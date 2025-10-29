export default function ProfileHeader({ user }) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center mb-4 overflow-hidden">
        {user?.avatar && user.avatar !== "/images/default-avatar.png" ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-3xl font-bold">{initials}</span>
        )}
      </div>
      <h1 className="text-white text-xl font-semibold">{user?.name}</h1>
    </div>
  );
}