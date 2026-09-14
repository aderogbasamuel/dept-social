export default function Banner({ text, type }) {
  if (!text) return null;
  const styles =
    type === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <div className={`text-sm border rounded-lg px-3 py-2 mb-4 ${styles}`}>
      {text}
    </div>
  );
}
