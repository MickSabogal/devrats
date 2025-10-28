// src/components/ui/Alert.jsx
export default function Alert({ type = "info", children }) {
  const styles = {
    success: "text-green-200 bg-green-800/30",
    error: "text-red-400 bg-red-800/30",
    info: "text-blue-200 bg-blue-800/30"
  };

  return (
    <div className={`mb-4 p-3 text-center rounded ${styles[type]}`}>
      {children}
    </div>
  );
}