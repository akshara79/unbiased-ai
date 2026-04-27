import Link from "next/link";

const features = [
  { icon: "🔍", title: "Bias Detection", desc: "Compare selection rates across demographic groups to surface hidden biases." },
  { icon: "📊", title: "Fairness Metrics", desc: "Compute Disparate Impact, Statistical Parity, and Equal Opportunity scores." },
  { icon: "💡", title: "Explainability", desc: "Rank feature importance and identify which attributes drive biased outcomes." },
  { icon: "🛠️", title: "Mitigation Suggestions", desc: "Get actionable recommendations to reduce bias in your AI pipeline." },
];

const useCases = [
  { icon: "🏢", label: "HR & Hiring" },
  { icon: "🏦", label: "Banking & Credit" },
  { icon: "🎓", label: "University Admissions" },
  { icon: "🏥", label: "Healthcare" },
  { icon: "📋", label: "Compliance Teams" },
  { icon: "🔬", label: "Data Scientists" },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="text-6xl mb-4">⚖️</div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          Unbiased AI Decision System
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          A fairness layer between AI predictions and final decisions. Upload your dataset,
          detect bias, compute fairness metrics, and get actionable mitigation suggestions — instantly.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/upload"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Analyze Your Dataset →
          </Link>
          <Link
            href="/dashboard"
            className="border border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            View Demo Dashboard
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-2xl border p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Use Cases */}
      <div className="bg-indigo-50 rounded-2xl p-8 mb-16">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Built for Every Team</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {useCases.map((u) => (
            <div key={u.label} className="text-center">
              <div className="text-3xl mb-1">{u.icon}</div>
              <div className="text-xs text-gray-600 font-medium">{u.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-8">How It Works</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {["Upload CSV", "Select Columns", "Run Analysis", "View Results", "Download Report"].map((step, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="text-xs text-gray-600 mt-1 text-center w-20">{step}</div>
              </div>
              {i < 4 && <div className="hidden sm:block text-gray-300 text-xl">→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
