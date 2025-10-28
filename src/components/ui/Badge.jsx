// src/components/ui/Badge.jsx
export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-gray-600 text-gray-200",
    success: "bg-green-600 text-green-100",
    error: "bg-red-600 text-red-100",
    warning: "bg-yellow-600 text-yellow-100",
    info: "bg-blue-600 text-blue-100",
    primary: "bg-red-600 text-white"
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}