export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-emerald-50/40 flex items-center justify-center p-6 dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm shadow-emerald-900/5 p-6 dark:bg-gray-900 dark:shadow-none dark:border dark:border-gray-800">
        <h1 className="text-xl font-semibold text-emerald-950 dark:text-gray-100 mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
