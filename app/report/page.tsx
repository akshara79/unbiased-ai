"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnalysisResult } from "@/types";

export default function ReportPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [downloading, setDownloading] = useState<"json" | "html" | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult");
    if (stored) setResult(JSON.parse(stored));
  }, []);

  async function download(format: "json" | "html") {
    if (!result) return;
    setDownloading(format);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, format }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fairness-report.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">No report available</h2>
        <p className="text-gray-500 mb-6">Run an analysis first to generate a report.</p>
        <Link href="/upload" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700">
          Upload Dataset →
        </Link>
      </div>
    );
  }

  const { datasetOverview: ov, fairnessScore, fairnessLevel, biasAlerts, mitigationSuggestions } = result;
  const scoreColor = fairnessLevel === "fair" ? "text-green-600" : fairnessLevel === "risk" ? "text-yellow-600" : "text-red-600";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-gray-900">Fairness Report</h1>
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">← Back to Dashboard</Link>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className={`text-4xl font-black ${scoreColor}`}>{fairnessScore}</div>
            <div className="text-sm text-gray-500">Fairness Score</div>
          </div>
          <div>
            <div className={`text-2xl font-bold uppercase ${scoreColor}`}>{fairnessLevel}</div>
            <div className="text-sm text-gray-500">Fairness Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{ov.totalRows.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Rows</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{biasAlerts.length}</div>
            <div className="text-sm text-gray-500">Bias Alerts</div>
          </div>
        </div>
      </div>

      {/* Dataset overview */}
      <div className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Dataset Overview</h2>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-gray-500">Prediction Column</dt><dd className="font-medium">{ov.predictionColumn}</dd>
          <dt className="text-gray-500">Sensitive Attributes</dt><dd className="font-medium">{ov.sensitiveAttributes.join(", ")}</dd>
          <dt className="text-gray-500">Columns</dt><dd className="font-medium">{ov.totalColumns}</dd>
          <dt className="text-gray-500">Positive Outcome Rate</dt><dd className="font-medium">{(ov.positiveOutcomeRate * 100).toFixed(1)}%</dd>
        </dl>
      </div>

      {/* Bias alerts */}
      <div className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Bias Alerts ({biasAlerts.length})</h2>
        {biasAlerts.length === 0 ? (
          <p className="text-sm text-green-600">No significant bias detected.</p>
        ) : (
          <ul className="space-y-2">
            {biasAlerts.map((a, i) => (
              <li key={i} className="text-sm border-l-4 pl-3 py-1" style={{ borderColor: a.severity === "high" ? "#ef4444" : a.severity === "medium" ? "#f59e0b" : "#6366f1" }}>
                <strong>{a.attribute}</strong>: {a.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mitigation */}
      <div className="bg-white rounded-2xl border p-6 mb-8">
        <h2 className="font-semibold text-gray-700 mb-3">Mitigation Suggestions</h2>
        <ul className="space-y-2">
          {mitigationSuggestions.map((s, i) => (
            <li key={i} className="text-sm">
              <span className="font-semibold">{s.title}</span>: {s.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Download buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => download("json")}
          disabled={downloading === "json"}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {downloading === "json" ? "Generating..." : "⬇ Download JSON Report"}
        </button>
        <button
          onClick={() => download("html")}
          disabled={downloading === "html"}
          className="flex-1 bg-gray-700 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {downloading === "html" ? "Generating..." : "⬇ Download HTML Report"}
        </button>
      </div>
    </div>
  );
}
