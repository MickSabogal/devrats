// src/components/ui/Button.jsx
import LoadingSpinner from "./LoadingSpinner";

export default function Button({ children, loading, fullWidth, ...props }) {
  return (
    <button
      disabled={loading}
      className={`py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold uppercase tracking-wide hover:shadow-lg hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}