// src/components/ui/Input.jsx
export default function Input({ label, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-400 uppercase mb-1">
          {label}
        </label>
      )}
      <input
        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-red-600 transition"
        {...props}
      />
    </div>
  );
}