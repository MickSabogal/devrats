export default function Input({ 
  label, 
  error, 
  icon: Icon,
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
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 rounded-lg
            bg-gray-800 border border-gray-700
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-third focus:border-transparent
            transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-third focus:ring-third' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-third">{error}</p>
      )}
    </div>
  );
}