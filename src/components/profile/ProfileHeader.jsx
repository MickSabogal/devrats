export default function ProfileHeader({ user }) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <div className="w-41 h-41 rounded-2xl bg-green-600 flex items-center justify-center overflow-hidden border-8 border-black flex-shrink-0">
      {user?.avatar && user.avatar !== "/images/default-avatar.png" ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white text-4xl font-bold">{initials}</span>
      )}
    </div>
  );
}