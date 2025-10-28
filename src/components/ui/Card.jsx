// src/components/ui/Card.jsx
export default function Card({ children, className = "", padding = true }) {
  return (
    <div
      className={`bg-secondary rounded-xl ${padding ? "p-4" : ""} ${className}`}
    >
      {children}
    </div>
  );
}