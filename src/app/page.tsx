import SpendForm from "@/components/SpendForm";

export default function Home() {
  return (
    // Full screen dark background
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-xl font-bold text-emerald-400">
          SpendLens
        </h1>
        <p className="text-sm text-gray-400">
          Find out if you're overpaying for AI tools
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Hero text */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Audit your AI tool spend
          </h2>
          <p className="text-gray-400 text-lg">
            Enter what you pay today. We'll tell you exactly 
            where you're overspending and what to do about it.
          </p>
        </div>

        {/* The form component */}
        <SpendForm />

      </div>
    </main>
  );
}