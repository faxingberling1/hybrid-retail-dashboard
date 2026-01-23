export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Blog</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600">
            Insights and updates about retail technology, POS systems, and business management.
          </p>
          {/* Add blog posts here */}
        </div>
      </div>
    </div>
  );
}