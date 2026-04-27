"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { FeatureImportance } from "@/types";

const riskColor = { high: "#ef4444", medium: "#f59e0b", low: "#6366f1" };

export default function FeatureImportanceChart({ features }: { features: FeatureImportance[] }) {
  const data = features.slice(0, 10).map((f) => ({
    name: f.feature,
    Correlation: parseFloat((f.correlation * 100).toFixed(1)),
    risk: f.biasRisk,
  }));

  return (
    <div className="bg-white rounded-xl border p-4">
      <h3 className="font-semibold text-gray-700 mb-1">Feature Importance (Correlation with Outcome)</h3>
      <p className="text-xs text-gray-400 mb-4">Red = high bias risk, Yellow = medium, Blue = low</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit="%" domain={[0, 100]} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
          <Tooltip formatter={(v) => [`${v}%`, "Correlation"]} />
          <Bar dataKey="Correlation" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={riskColor[entry.risk as keyof typeof riskColor]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
