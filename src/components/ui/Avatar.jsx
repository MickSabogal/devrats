// src/components/ui/Avatar.jsx
export default function Avatar({ src, alt = "Avatar", size = "md", className = "" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <img
      src={src || "/images/default-avatar.png"}
      alt={alt}
      className={`rounded-full object-cover ${sizes[size]} ${className}`}
    />
  );
}