import LoadingSpinner from "./LoadingSpinner";

export default function Button({ 
  children, 
  loading, 
  fullWidth, 
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled,
  className = "",
  ...props 
}) {
  const variants = {
  primary: "bg-green-500 hover:bg-green-600 text-[#0B111c]",
  secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700",
  outline: "bg-transparent hover:bg-white/10 text-white border-2 border-white",
  ghost: "bg-transparent hover:bg-white/10 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  greenOutline: "bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700",
};

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      disabled={loading || disabled}
      className={`rounded-lg font-semibold transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
}
