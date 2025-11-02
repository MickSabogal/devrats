// src/components/ui/Textarea.jsx
export default function Textarea({ 
  label, 
  error, 
  className = "",
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 rounded-lg
          bg-gray-800 border border-gray-700
          text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent
          transition-all resize-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}