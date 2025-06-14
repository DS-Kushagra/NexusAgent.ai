export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-lg font-semibold text-gray-900">Debug Panel</h1>
            <a href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to App
            </a>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
