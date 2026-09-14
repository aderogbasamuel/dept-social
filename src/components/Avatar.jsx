const COLORS = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-lime-600",
  "bg-green-600",
  "bg-cyan-600",
];

// Picks a consistent color for the same name every time
function colorForName(name = "") {
  const code = name.charCodeAt(0) || 0;
  return COLORS[code % COLORS.length];
}

export default function Avatar({ name, size = 10 }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";
  const sizeClass = `w-${size} h-${size}`;
  const textSizeClass = size <= 8 ? "text-xs" : size <= 10 ? "text-sm" : "text-base";

  return (
    <div
      className={`${sizeClass} ${colorForName(
        name
      )} rounded-full flex items-center justify-center text-white font-medium ${textSizeClass} shrink-0`}
    >
      {initial}
    </div>
  );
}