export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-emerald-50/40 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm shadow-emerald-900/5 p-6">
        <h1 className="text-xl font-semibold text-emerald-950 mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mb-5">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
