"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnalysisResult } from "@/types";
import ScoreCard from "@/components/ScoreCard";
import BiasAlertCard from "@/components/BiasAlertCard";
import FairnessChart from "@/components/FairnessChart";
import FeatureImportanceChart from "@/components/FeatureImportanceChart";
import MetricsTable from "@/components/MetricsTable";
import MitigationCard from "@/components/MitigationCard";

export default function DashboardPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">No analysis results yet</h2>
        <p className="text-gray-500 mb-6">Upload a dataset to see your fairness dashboard.</p>
        <Link href="/upload" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700">
          Upload Dataset →
        </Link>
      </div>
    );
  }

  const { datasetOverview: ov, fairnessScore, fairnessLevel, biasAlerts, fairnessMetrics, featureImportance, mitigationSuggestions, groupStats } = result;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Fairness Dashboard</h1>
          <p className="text-sm text-gray-500">{ov.totalRows} rows · {ov.totalColumns} columns · Prediction: <strong>{ov.predictionColumn}</strong></p>
        </div>
        <div className="flex gap-3">
          <Link href="/upload" className="text-sm border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50">
            New Analysis
          </Link>
          <Link href="/report" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">
            Download Report
          </Link>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-black text-indigo-600">{ov.totalRows.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Total Rows</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-black text-indigo-600">{biasAlerts.length}</div>
          <div className="text-xs text-gray-500 mt-1">Bias Alerts</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-black text-indigo-600">{ov.sensitiveAttributes.length}</div>
          <div className="text-xs text-gray-500 mt-1">Sensitive Attrs</div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-black text-indigo-600">{(ov.positiveOutcomeRate * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">Positive Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score */}
        <div>
          <ScoreCard score={fairnessScore} level={fairnessLevel as "fair" | "risk" | "biased"} />
        </div>
        {/* Alerts */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-semibold text-gray-700">Bias Alerts</h2>
          {biasAlerts.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
              ✅ No significant bias detected across sensitive attributes.
            </div>
          ) : (
            biasAlerts.map((a, i) => <BiasAlertCard key={i} alert={a} />)
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FairnessChart groupStats={groupStats} />
        <FeatureImportanceChart features={featureImportance} />
      </div>

      {/* Metrics table */}
      <div className="mb-8">
        <h2 className="font-semibold text-gray-700 mb-3">Fairness Metrics</h2>
        {fairnessMetrics.length > 0 ? (
          <MetricsTable metrics={fairnessMetrics} />
        ) : (
          <p className="text-sm text-gray-400">No metrics computed.</p>
        )}
      </div>

      {/* Mitigation */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-3">Mitigation Suggestions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mitigationSuggestions.map((s, i) => <MitigationCard key={i} suggestion={s} />)}
        </div>
      </div>
    </div>
  );
}
