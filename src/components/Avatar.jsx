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
const sizes = {
  6: "w-6 h-6",
  8: "w-8 h-8",
  10: "w-10 h-10",
  12: "w-12 h-12",
  14: "w-14 h-14",
  16: "w-16 h-16",
};

export default function Avatar({ name, size = 10 }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <div
      className={`${sizes[size]} ${colorForName(
        name
      )} rounded-full flex items-center justify-center text-white font-medium shrink-0`}
    >
      {initial}
    </div>
  );
}